package controllers

import (
	"context"
	// "fmt"
	// "log"
	// "os"
	// "time"

	"github.com/Jerified/go-bookstore/database"
	"github.com/Jerified/go-bookstore/models"

	"github.com/gofiber/fiber/v2"
	// "github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	// "go.mongodb.org/mongo-driver/mongo/options"
)
var bookConnection *mongo.Collection = database.GetCollection(database.DB, "books")
func GetBooks(c *fiber.Ctx) error {
	var books []models.Book

	cursor, err := bookConnection.Find(context.Background(), bson.M{})

	if err != nil {
		return err
	}

	defer cursor.Close(context.Background())

	for cursor.Next((context.Background())) {
		var book models.Book

		if err := cursor.Decode(&book); err != nil {
			return err
		}

		books = append(books, book)
	}

	return c.JSON(books)
}
func CreateBook(c *fiber.Ctx) error {
	book := new(models.Book)

	if err := c.BodyParser(book); err != nil {
		return err
	}

	if book.Title == "" || len(book.Authors) == 0 ||
		book.Price == 0 || book.PublishedDate == "" ||
		book.Category == "" || book.Description == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Title, Authors, Price, PublishedDate, Category, and Description are required",
		})
	}

	if book.Image.SmallThumbnail == "" || book.Image.Thumbnail == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Image links are required",
		})
	}

	// Insert book into MongoDB
	result, err := bookConnection.InsertOne(context.Background(), book)
	if err != nil {
		return err
	}

	book.ID = result.InsertedID.(primitive.ObjectID)

	return c.Status(201).JSON(
		// "message "Book created successfully",
		book)

}
func UpdateBook(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo ID"})
	}

	var book models.Book
	if err := c.BodyParser(&book); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Failed to parse request body"})
	}

	filter := bson.M{"_id": objectID}

	update := bson.M{
		"$set": bson.M{
			"price":         book.Price,
			"title":         book.Title,
			"subtitle":      book.Subtitle,
			"authors":       book.Authors,
			"publisher":     book.Publisher,
			"publishedDate": book.PublishedDate,
			"pageCount":     book.PageCount,
			"language":      book.Language,
			"description":   book.Description,
			"previewLink":   book.PreviewLink,
			"image": bson.M{
				"smallThumbnail": book.Image.SmallThumbnail,
				"thumbnail":      book.Image.Thumbnail,
			},
			"category":      book.Category,
			"infoLink":      book.InfoLink,
			"samplePDFLink": book.SamplePDFLink,
		},
	}

	result, err := bookConnection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update book"})
	}

	if result.MatchedCount == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Book not found"})
	}

	return c.Status(200).JSON(fiber.Map{"message": "Book updated successfully"})
}

func DeleteBook(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid book ID"})
	}

	filter := bson.M{"_id": objectID}

	result, err := bookConnection.DeleteOne(context.Background(), filter)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete book"})
	}

	if result.DeletedCount == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Book not found"})
	}

	return c.Status(200).JSON(fiber.Map{"message": "Book deleted successfully"})
}