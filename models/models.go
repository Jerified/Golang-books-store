package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
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

type UserRole string

const (
	AdminRole UserRole = "admin"
	UsersRole UserRole = "user"
	// Guest
)

type User struct {
	ID        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Username  string             `json:"username" bson:"username"`
	Email     string             `json:"email" validate:"required,email"`
	Password  string             `json:"-"`
	Image     *string            `json:"image"`
	Name      *string            `json:"name"`
	CreatedAt time.Time          `json:"createdAt"`
	UpdatedAt time.Time          `json:updatedAt"`
	Role      UserRole
	Bookmark  []*Book
}
