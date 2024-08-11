package main

import (
	"log"
	"os"

	"github.com/Jerified/go-bookstore/database"
	"github.com/Jerified/go-bookstore/routes"
	"github.com/gofiber/fiber/v2"
	// "go.mongodb.org/mongo-driver/mongo/options"
)

// var collection *mongo.Collection

func main() {
	
	
	app := fiber.New()
	
	database.Connect()
	
	routes.BookRoutes(app)
	routes.UserRoutes(app)


	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	log.Fatal(app.Listen("0.0.0.0:" + port))
}



