package shows

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"jwt/config"
	"jwt/handlers"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
)

var APP_ADDRESS = "http://localhost:3000"

type Show struct {
	ID     string              `bson:"id" json:"id"` 
	Title  string			   `bson:"title" json:"title"`
	Venue  string			   `bson:"venue" json:"venue"`
	Date   string			   `bson:"date" json:"date"`
	Link   string			   `bson:"link" json:"link"`
}

var shows []Show

func generateUUID() uuid.UUID {
	uuid := uuid.New()
	return uuid
}

func validateToken(w http.ResponseWriter, r *http.Request) (valid bool) {
	w.Header().Set("Content-Type", "text/plain")
	w.Header().Set("Access-Control-Allow-Origin", APP_ADDRESS)
	w.Header().Set("Access-Control-Allow-Methods", "POST, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Authorization, Set-Cookie")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization, Set-Cookie")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Check for the token cookie's existence and return an Unauthorized error if there is no cookie, or a Bad Request error for any other error
		cookie := r.Header.Get("Authorization")
		realCookie, err := r.Cookie("token")
		
		if err != nil {
			if err == http.ErrNoCookie {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		tokenStr := realCookie.Value
		
		
		fmt.Printf("cookie: %v", cookie)
		fmt.Printf("tokenStr: %v", tokenStr)

		// Turn the cookie value into a string, also set up your claims which is what jwt checks against to verify cookie legitimacy
		claims := &handlers.Claims{}
	
		//Parses the JWT key using the claims and token string.
		tkn, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
			return handlers.JwtKey, nil
		})
	
		// Checks for errors returning the appropriate header response
		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				json.NewEncoder(w).Encode(http.StatusUnauthorized)
				return false
			}
			fmt.Println(err)
			json.NewEncoder(w).Encode(http.StatusBadRequest)
			return false
		}
	
		// checks that token is valid before proceeding
		if !tkn.Valid {
			json.NewEncoder(w).Encode(http.StatusUnauthorized)
			return false
		}
		return true
}

func CreateShow(w http.ResponseWriter, r *http.Request){
	w.Header().Add("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", APP_ADDRESS)
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Authorization, Set-Cookie")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization, Set-Cookie")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if (!validateToken(w, r)) {
		return
	}

	var show Show
	generatedID := generateUUID()
	show.ID = generatedID.String()
	err := json.NewDecoder(r.Body).Decode(&show)
	if err != nil {
		log.Fatal(err)
	}
	collection := config.Client.Database("keith").Collection("showlist")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	result, _ := collection.InsertOne(ctx, show)
	json.NewEncoder(w).Encode(result)
}

func GetShows(w http.ResponseWriter, r *http.Request){
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization, Set-Cookie")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	var Shows []Show
	collection := config.Client.Database("keith").Collection("showlist")
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var show Show
		cursor.Decode(&show)
		Shows = append(Shows, show)
	}
	if err := cursor.Err(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}
	json.NewEncoder(w).Encode(Shows)
}

func GetShowById(w http.ResponseWriter, r *http.Request){
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", APP_ADDRESS)
	w.Header().Set("Access-Control-Allow-Headers", "Authorization, Set-Cookie")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization, Set-Cookie")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	if (!validateToken(w, r)) {
		return
	}
	
	params := mux.Vars(r)
	id := params["id"]
	var show Show

	collection := config.Client.Database("keith").Collection("showlist")
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)

	err := collection.FindOne(ctx, bson.M{"id": id}).Decode(&show)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}
	json.NewEncoder(w).Encode(show)
}

func UpdateShow(w http.ResponseWriter, r *http.Request){
	w.Header().Set("content-type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", APP_ADDRESS)
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Authorization, Set-Cookie")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization, Set-Cookie")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	if (!validateToken(w, r)) {
		return
	}

	params := mux.Vars(r)
	id := params["id"]
	var show Show
	show.ID = id
	err := json.NewDecoder(r.Body).Decode(&show)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}


	collection := config.Client.Database("keith").Collection("showlist")
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)

	update := bson.M{
		"$set": show,
	}
	updated, err := collection.UpdateOne(ctx, bson.M{"id": id}, update)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}
	json.NewEncoder(w).Encode(updated)
}

func DeleteShow(w http.ResponseWriter, r *http.Request){
	w.Header().Set("Access-Control-Allow-Origin", APP_ADDRESS)
	w.Header().Set("Access-Control-Allow-Methods", "DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Authorization, Set-Cookie")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization, Set-Cookie")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if (!validateToken(w, r)) {
		return
	}
	
	params := mux.Vars(r)
	id := params["id"]
	
	collection := config.Client.Database("keith").Collection("showlist")
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)

	del, err := collection.DeleteOne(ctx, bson.M{"id": id})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}
	json.NewEncoder(w).Encode(del)
}