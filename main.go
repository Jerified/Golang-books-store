package main

import (
	// "encoding/json"
	"fmt"
	"log"

	// "strconv"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

type Book struct {
	ID              int     `json:"id"`
	Title           string  `json:"title"`
	Author          string  `json:"author"`
	ISBN            *string `json:"isbn,omitempty"`
	PublicationYear int     `json:"publicationYear"`
	Genre           string  `json:"genre"`
	Description     string  `json:"description"`
	Price           float64 `json:"price"`
}

func main() {
	fmt.Println("Hello, world")

	app := fiber.New()

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	PORT := os.Getenv("PORT")

	books := []Book{}

	app.Get("/api/todos", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(books)
	})

	app.Post("/api/books", func(c *fiber.Ctx) error {
		book := &Book{}

		if err := c.BodyParser(book); err != nil {
			return err
		}

		if book.Title == "" {
			return c.Status(400).JSON(fiber.Map{"error": "Book body is required"})
		}

		books = append(books, *book)

		return c.Status(201).JSON(book)
	})

	// app.Patch("/api/books/:id", func(c *fiber.Ctx) error {
    //     idStr := c.Params("id")
	// 	id, err := strconv.Atoi(idStr)
	// 	if err != nil {
	// 	  return c.Status(400).JSON(fiber.Map{"error": "Invalid book ID"})
	// 	}
	
	// 	var updatedBook map[string]interface{}
	// 	body, err := io.ReadAll(c.Body())
	// 	if err != nil {
	// 	  return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	// 	}
	
	// 	if err := json.Unmarshal(body, &updatedBook); err != nil {
	// 	  return c.Status(400).JSON(fiber.Map{"error": "Invalid JSON format"})
	// 	}
	
	// 	found := false
	// 	for i, book := range books {
	// 	  if book.ID == id {
	// 		for key, value := range updatedBook {
	// 		  switch key {
	// 		  case "title":
	// 			books[i].Title = value.(string)
	// 		  case "author":
	// 			books[i].Author = value.(string)
	// 		  case "isbn":
	// 			if value != nil {
	// 			  isbn := value.(string)
	// 			  books[i].ISBN = &isbn
	// 			}
	// 		  case "publicationYear":
	// 			year, ok := value.(int)
	// 			if ok {
	// 			  books[i].PublicationYear = year
	// 			} else {
	// 			  return c.Status(400).JSON(fiber.Map{"error": "Invalid publicationYear format"})
	// 			}
	// 		  case "genre":
	// 			books[i].Genre = value.(string)
	// 		  case "description":
	// 			books[i].Description = value.(string)
	// 		  case "price":
	// 			price, ok := value.(float64)
	// 			if ok {
	// 			  books[i].Price = price
	// 			} else {
	// 			  return c.Status(400).JSON(fiber.Map{"error": "Invalid price format"})
	// 			}
	// 		  default:
	// 			return c.Status(400).JSON(fiber.Map{"error": "Invalid update field: " + key})
	// 		  }
	// 		}
	// 		found = true
	// 		break
	// 	  }
	// 	}
	
	// 	if !found {
	// 	  return c.Status(404).JSON(fiber.Map{"error": "Book not found"})
	// 	}
	
	// 	return c.Status(200).JSON(books[id-1])
	//   })
	log.Fatal(app.Listen(":" + PORT))
}
