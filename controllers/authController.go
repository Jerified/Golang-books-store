package controllers

import (
	"context"
	"log"
	"time"

	// "net/http"

	"github.com/Jerified/go-bookstore/database"
	"github.com/Jerified/go-bookstore/models"
	"github.com/Jerified/go-bookstore/utils"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var userConnection *mongo.Collection = database.GetCollection(database.DB, "users")

func RegisterUser(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(data["password"]), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to hash password",
		})
	}
	newUser := models.User{
		ID:       primitive.NewObjectID(),
		Username: data["username"],
		Email:    data["email"],
		Password: string(hashedPassword),
		// Image:     new(string),
		// Name:      new(string),
		CreatedAt: time.Time{},
		UpdatedAt: time.Time{},
		Role:      models.UsersRole,
		// Bookmark:  []*models.Book{},
	}
	if err := utils.ValidateStruct(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	emailCount, err := userConnection.CountDocuments(ctx, bson.M{"email": data["email"]})
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

	result, err := userConnection.InsertOne(context.Background(), newUser)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Cannot Insert user",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(result)
}
