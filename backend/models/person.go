package models

import "time"

type Person struct {
	ID          uint `json:"id" gorm:"primaryKey"`
	CreatedAt   time.Time
	Name        string `json:"name"`
	SurName     string `json:"surname"`
	PhoneNumber int    `json:"phone_number"`
}
