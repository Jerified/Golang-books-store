package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Book struct {
	ID            primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Price         float64            `json:"price"`
	Title         string             `json:"title"`
	Subtitle      string             `json:"subtitle,omitempty"`
	Authors       []string           `json:"authors"`
	Publisher     string             `json:"publisher"`
	PublishedDate string             `json:"publishedDate"`
	PageCount     int                `json:"pageCount"`
	Language      string             `json:"language"`
	Description   string             `json:"description"`
	PreviewLink   string             `json:"previewLink"`
	Image         Image              `json:"image"`
	Category      string             `json:"category"`
	InfoLink      string             `json:"infoLink"`
	SamplePDFLink string             `json:"samplePDFLink,omitempty"`
}
type Image struct {
	SmallThumbnail string `json:"smallThumbnail"`
	Thumbnail      string `json:"thumbnail"`
}

var collection *mongo.Collection

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file:", err)
	}

	MONGODB_URI := os.Getenv("MONGODB_URI")
	clientOpions := options.Client().ApplyURI(MONGODB_URI)
	client, err := mongo.Connect(context.Background(), clientOpions)

	if err != nil {
		log.Fatal(err)
	}

	defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MONGODB ATLAS")

	collection = client.Database("golang-bookstore_db").Collection("books")

	app := fiber.New()

	app.Get("/api/books", getBooks)
	app.Post("/api/books", createBook)
	app.Patch("/api/books/:id", updateBook)
	app.Delete("/api/books/:id", deleteBook)

	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	log.Fatal(app.Listen("0.0.0.0:" + port))

}

func getBooks(c *fiber.Ctx) error {
	var books []Book

	cursor, err := collection.Find(context.Background(), bson.M{})

	
	if err != nil {
		return err
	}

	defer cursor.Close(context.Background())

	for cursor.Next((context.Background())) {
		var book Book

		if err := cursor.Decode(&book); err != nil {
			return err
		}

		books = append(books, book)
	}

	return c.JSON(books)
}
func createBook(c *fiber.Ctx) error {
	book := new(Book)

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
	result, err := collection.InsertOne(context.Background(), book)
	if err != nil {
		return err
	}

	book.ID = result.InsertedID.(primitive.ObjectID)

	return c.Status(201).JSON(
		// "message "Book created successfully",
		book)

}

func updateBook(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo ID"})
	}

	var book Book
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

	result, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update book"})
	}

	if result.MatchedCount == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Book not found"})
	}

	return c.Status(200).JSON(fiber.Map{"message": "Book updated successfully"})
}

func deleteBook(c *fiber.Ctx) error {
    id := c.Params("id")
    objectID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "Invalid book ID"})
    }

    filter := bson.M{"_id": objectID}

    result, err := collection.DeleteOne(context.Background(), filter)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Failed to delete book"})
    }

    if result.DeletedCount == 0 {
        return c.Status(404).JSON(fiber.Map{"error": "Book not found"})
    }

    return c.Status(200).JSON(fiber.Map{"message": "Book deleted successfully"})
}

