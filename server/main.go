package main

import (
	"encoding/json"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/joho/godotenv"
)

func envLoad() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
}

func main() {
	envLoad()

	http.HandleFunc("/verify_recaptcha", recaptchaHandler)
	http.ListenAndServe(":8000", nil)
}

type RecaptchaResponse struct {
	Success     bool     `json:"success"`
	ChallengeTS string   `json:"challenge_ts"`
	Hostname    string   `json:"hostname"`
	ErrorCodes  []string `json:"error-codes"`
	Message     string   `json:"message"`
}

func verifyRecaptcha(response string) bool {
	secret := os.Getenv("RECAPTCHA_SECRET_KEY")
	apiUrl := "https://www.google.com/recaptcha/api/siteverify"

	postData := url.Values{
		"secret":   {secret},
		"response": {response},
	}

	res, err := http.PostForm(apiUrl, postData)
	if err != nil {
		return false
	}
	defer res.Body.Close()

	var resp RecaptchaResponse
	if err := json.NewDecoder(res.Body).Decode(&resp); err != nil {
		return false
	}

	return resp.Success
}

func recaptchaHandler(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w, r)

	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	r.ParseForm()
	recaptchaResponse := r.FormValue("g-recaptcha-response")

	success := verifyRecaptcha(recaptchaResponse)
	response := RecaptchaResponse{
		Success: success,
		Message: "reCAPTCHA verification failed",
	}
	if success {
		response.Message = "reCAPTCHA verified successfully"
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func setupCORS(w *http.ResponseWriter, req *http.Request) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}
