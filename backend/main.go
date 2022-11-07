package main

import (
	"fmt"
	"log"
	"main/database"
	"main/models"
	"reflect"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func personCreate(c *fiber.Ctx) error {
	var data map[string]interface{}

	err := c.BodyParser(&data)
	fmt.Println("-----------------")
	fmt.Printf("%T", data["phone_number"])
	fmt.Println("-----------------")
	if err != nil {
		return c.JSON(map[string]interface{}{
			"err":     err,
			"message": "Hatalı",
		})

	}
	if reflect.TypeOf(data["phone_number"]).String() == "float64" { //gelen değer float64 mü?
		strconv.FormatFloat(data["phone_number"].(float64), 'E', -1, 32) //eğer float 64 ise bunu stringe dönüştürme
	}
	person := models.Person{
		Name:        data["name"].(string),
		SurName:     data["surname"].(string),
		PhoneNumber: data["phone_number"].(string),
		CreatedAt:   time.Now(),
	}

	database.Database.Db.Create(&person)
	c.Status(200)
	return c.JSON(map[string]interface{}{
		"person":  person,
		"message": "Rehbere Kayıt Başarılı",
	})

}
func person(c *fiber.Ctx) error {

	person := []models.Person{}

	database.Database.Db.Find(&person)

	return c.JSON(map[string]interface{}{
		"message": "başarılı",
		"person":  person,
	})
}
func personUpdate(c *fiber.Ctx) error {
	var data map[string]interface{}

	err := c.BodyParser(&data)
	if err != nil {
		return c.JSON(map[string]interface{}{
			"err":     err,
			"message": "Hata",
		})
	}
	if data["name"] == "" {
		c.Status(404)
		return c.JSON(map[string]string{
			"err": "Kullanıcı Adı Boş Olamaz",
		})
	}
	person := models.Person{}
	// database.Database.Db.Model(&person).Where("id = ?", data["id"]).Updates(map[string]interface{}{
	// 	"name":         data["name"],
	// 	"sur_name":     data["surname"],
	// 	"phone_number": data["phone_number"],
	// 	"id":           data["id"],
	// })
	database.Database.Db.Model(&person).Where("id = ?", data["id"]).Updates(models.Person{
		Name:        data["name"].(string),
		SurName:     data["surname"].(string),
		PhoneNumber: data["phone_number"].(string),
		ID:          uint(data["id"].(float64)),
	})
	c.Status(200)
	return c.JSON(map[string]interface{}{
		"message":      "Başarılı",
		"changePerson": person,
	})

}
func personDelete(c *fiber.Ctx) error {
	id := c.Params("id")

	err := database.Database.Db.Delete(&models.Person{}, id).Error

	if err != nil {
		c.Status(400)
		return c.JSON(map[string]string{
			"message": "Silme başarısız",
		})
	}

	c.Status(200)
	return c.JSON(map[string]string{
		"message": "Silme Başarılı",
	})

}

func main() {
	app := fiber.New()

	database.ConnectDb()
	// Default config
	app.Use(cors.New())

	// Or extend your config for customization
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Post("directory/create", personCreate)

	app.Get("/person", person)

	app.Post("/person/update", personUpdate)

	app.Delete("/person/delete/:id", personDelete)

	log.Fatal(app.Listen(":8080"))

}
