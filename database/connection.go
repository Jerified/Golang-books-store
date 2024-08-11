package database

import (
	"context"
	"fmt"
	"log"
	"os"

	// "github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	// "go.mongodb.org/mongo-driver/bson"
	// "go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)


func Connect() *mongo.Client {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file:", err)
	}

	MONGODB_URI := os.Getenv("MONGODB_URI")
	clientOptions := options.Client().ApplyURI(MONGODB_URI)
	client, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	// defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	// defer ca
	fmt.Println("Connected to MONGODB ATLAS")
	return client

}
var DB *mongo.Client = Connect()

func GetCollection(client *mongo.Client, collectionName string) *mongo.Collection  {
	collection := client.Database("golang-bookstore_db").Collection(collectionName)
	
	return collection
	
}

