package main

import (
	"log"
	"os"

	"github.com/Jerified/go-bookstore/database"
	"github.com/Jerified/go-bookstore/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)


func main() {

	database.Connect()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowMethods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
		// AllowHeaders: "Content-Type, Authorization, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Expose-Headers, Access-Control-Max-Age, Access-Control-Allow-Credentials",
		AllowCredentials: true, 

		AllowOrigins: "http://localhost:3000",
	}))

	routes.BookRoutes(app)
	routes.UserRoutes(app)
	routes.BookmarkRoute(app)


	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	log.Fatal(app.Listen("0.0.0.0:" + port)) 
}
