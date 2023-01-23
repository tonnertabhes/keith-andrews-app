package main

import (
	"context"
	"fmt"
	"jwt/config"
	"jwt/handlers"
	"jwt/shows"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)



func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error retrieving .env file")
	}


	fmt.Println("Application running at Port 12345")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	config.Client, _ = mongo.NewClient(options.Client().ApplyURI("mongodb://127.0.0.1:27017"))
	cliErr := config.Client.Connect(ctx)
	if cliErr != nil {
		fmt.Println(err.Error())
	}
	defer config.Client.Disconnect(ctx)
	router := mux.NewRouter()
	http.Handle("/", router)
	http.HandleFunc("/login", handlers.Login)
	http.HandleFunc("/home", handlers.Home)
	http.HandleFunc("/refresh", handlers.Refresh)
	router.HandleFunc("/createshow", shows.CreateShow).Methods("POST", "OPTIONS")
	router.HandleFunc("/getshows", shows.GetShows).Methods("GET", "OPTIONS")
	router.HandleFunc("/getshow/{id}", shows.GetShowById).Methods("GET", "OPTIONS")
	router.HandleFunc("/updateshow/{id}", shows.UpdateShow).Methods("PUT", "OPTIONS")
	router.HandleFunc("/deleteshow/{id}", shows.DeleteShow).Methods("DELETE", "OPTIONS")

	log.Fatal(http.ListenAndServe(":12345", nil))
}