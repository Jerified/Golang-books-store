package controllers

import (
	"context"
	"fmt"
	"log"

	"github.com/Jerified/go-bookstore/database"
	"github.com/Jerified/go-bookstore/models"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var bookmarkConnection *mongo.Collection = database.GetCollection(database.DB, "users")

func AddBookToBookmark(c *fiber.Ctx) error {
	userID, err := primitive.ObjectIDFromHex(c.Params("userId"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid User ID"})
	}
	bookID, err := primitive.ObjectIDFromHex(c.Params("bookId"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid Book ID"})
	}

	ctx := context.Background()

	// Find user by ID
	filter := bson.M{"_id": userID}
	var user models.User
	if err := bookmarkConnection.FindOne(ctx, filter).Decode(&user); err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(404).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Failed to find user"})
	}

	// Initialize bookmark field if it is null
	if user.Bookmark == nil {
		update:= bson.M{"$set": bson.M{"bookmark": []primitive.ObjectID{}}}
		if _, err := bookmarkConnection.UpdateOne(ctx, filter, update); err != nil {
			log.Printf("Failed to initialize bookmark field: %v", err)
			return c.Status(500).JSON(fiber.Map{"error": "Failed to initialize bookmark field"})
		}
	}

	// Check if book already exists in bookmarks
	for _, existingBookID := range user.Bookmark {
		if existingBookID == bookID {
			return c.Status(400).JSON(fiber.Map{"error": "Book already exists in bookmarks"})
		}
	}

	// Update user's bookmark list
	update := bson.M{"$push": bson.M{"bookmark": bookID}}
	result, err := bookmarkConnection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Failed to add book to bookmark: %v", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to add book to bookmark"})
	}

	return c.Status(200).JSON(fiber.Map{"message": "Book added to bookmark successfully"})
}

func GetUserBookmarks(c *fiber.Ctx) error {
	userID, err := primitive.ObjectIDFromHex(c.Params("userId"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid User ID"})
	}

	ctx := context.Background()

	// Find user by ID
	filter := bson.M{"_id": userID}
	var user models.User
	if err := bookmarkConnection.FindOne(ctx, filter).Decode(&user); err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(404).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Failed to find user"})
	}

	// Fetch book details for each book ID in bookmark
	var bookmarks []models.Book
	var bookCollection *mongo.Collection = database.GetCollection(database.DB, "books")

	for _, bookID := range user.Bookmark {
		bookFilter := bson.M{"_id": bookID}
		var book models.Book
		if err := bookCollection.FindOne(ctx, bookFilter).Decode(&book); err != nil {
		} else {
			bookmarks = append(bookmarks, book)
		}
	}

	return c.JSON(bookmarks)
}

func RemoveBookFromBookmark(c *fiber.Ctx) error {
	userID, err := primitive.ObjectIDFromHex(c.Params("userId"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid User ID"})
	}
	bookID, err := primitive.ObjectIDFromHex(c.Params("bookId"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid Book ID"})
	}

	ctx := context.Background()

	// Find user by ID
	filter := bson.M{"_id": userID}
	var user models.User
	if err := bookmarkConnection.FindOne(ctx, filter).Decode(&user); err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(404).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(500).JSON(fiber.Map{"error": "Failed to find user"})
	}

	// Check if book exists in bookmarks
	found := false
	for i, existingBookID := range user.Bookmark {
		if existingBookID == bookID {
			found = true
			user.Bookmark = append(user.Bookmark[:i], user.Bookmark[i+1:]...)
			break
		}
	}

	if !found {
		return c.Status(400).JSON(fiber.Map{"error": "Book not found in bookmarks"})
	}

	// Update user's bookmark list
	update := bson.M{"$set": bson.M{"bookmark": user.Bookmark}}
	if _, err := bookmarkConnection.UpdateOne(ctx, filter, update); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to remove book from bookmark"})
	}

	return c.Status(200).JSON(fiber.Map{"message": "Book removed from bookmark successfully"})
}
