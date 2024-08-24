package controllers

import (
	"context"
	"fmt"
	"log"
	"regexp"
	"time"


	"github.com/Jerified/go-bookstore/database"
	"github.com/Jerified/go-bookstore/models"
	"github.com/Jerified/go-bookstore/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var userConnection *mongo.Collection = database.GetCollection(database.DB, "users")
var secretKey = "SuckMyDickBitchlol"

var emailRegex = regexp.MustCompile(`^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$`)

func RegisterUser(c *fiber.Ctx) error {
	var data models.User

	if err := c.BodyParser(&data); err != nil {
		fmt.Println(err)
		return err
	}
	fmt.Println(string(c.Body()))

	if err := utils.ValidateStruct(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	if !emailRegex.MatchString(data.Email) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid email format",
		})
	}
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	emailCount, err := userConnection.CountDocuments(ctx, bson.M{"email": data.Email})
	defer cancel()

	if err != nil {
		log.Panic(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error occured while checking email",
		})
	}
	if emailCount > 0 {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "User with this email already exists",
		})
	}
	hashedPassword, err := bcrypt.GenerateFromPassword(data.Password, bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to hash password",
		})
	}
	newUser := models.User{
		Username: data.Username,
		Email:    data.Email,
		Password: hashedPassword,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		Role:      models.UsersRole,
	}

	result, err := userConnection.InsertOne(context.Background(), newUser)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Cannot Insert user",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(result)
}

func Login(c *fiber.Ctx) error {
	var data models.User

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	fmt.Println(data)

	if err := utils.ValidateStruct(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}
	if !emailRegex.MatchString(data.Email) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid email format",
		})
	}
	var user models.User
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	userConnection.FindOne(ctx, bson.M{"email": data.Email}).Decode(&user)

	if user.ID == primitive.NilObjectID {
		fmt.Println("incorrect email")
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Email not found",
		})
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data.Password))
	if err != nil {
		fmt.Println("incorrect password")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid Email or Password",
		})
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID.Hex(),
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	})

	token, err := claims.SignedString([]byte(secretKey))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to generate token",
		})
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
		// Secure:   true,
	}
	c.Cookie(&cookie)

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"user":    user,
		"message": "Login successful",
	})
}

func User(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookie, &jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Unauthenticated",
		})
	}

	claims, ok := token.Claims.(*jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to parse claims",
		})
	}

	sub := (*claims)["sub"].(string)
	id, err := primitive.ObjectIDFromHex(sub)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid user ID in token",
		})
	}

	var user models.User
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	userConnection.FindOne(ctx, bson.M{"_id": id}).Decode(&user)

	return c.JSON(user)
}

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}
