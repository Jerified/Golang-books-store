package routes

import (
	"github.com/Jerified/go-bookstore/controllers"
	"github.com/gofiber/fiber/v2"
)

func BookRoutes(app *fiber.App) {
	app.Get("/api/books", controllers.GetBooks)
	app.Post("/api/books", controllers.CreateBook)
	app.Patch("/api/books/:id", controllers.UpdateBook)
	app.Delete("/api/books/:id", controllers.DeleteBook)
}

func UserRoutes(app *fiber.App) {
	app.Post("/api/register", controllers.RegisterUser)
	app.Post("/api/login", controllers.Login)
	app.Get("/api/user", controllers.User)
	app.Post("/api/logout", controllers.Logout)

}
