// Derived from example code at https://github.com/gin-gonic/gin
package test

import (
	"backend/models"
	"backend/router"
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-playground/assert/v2"
)

func TestCreateCharacter_201(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"Name": "Test Hero",
		"Description": "The most heroic hero in all of testing land",
		"Level": 50,
		"ClassType": 0,
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo"
	}`)

	req, _ := http.NewRequest("POST", "/characters/create", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.Character{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 201, res.Code)
	assert.Equal(t, "Test Hero", results.Name)
	assert.Equal(t, "The most heroic hero in all of testing land", results.Description)
	assert.Equal(t, uint(50), results.Level)
	assert.Equal(t, uint(0), results.ClassType)
	var spells []models.Spell
	assert.Equal(t, spells, results.Spells)
	var items []models.Item
	assert.Equal(t, items, results.Items)
}

func TestCreateCharacter_400(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "hi"
	}`)

	req, _ := http.NewRequest("POST", "/characters/create", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 400, res.Code)
}

func TestCreateCharacter_500(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"Name": "Test Hero",
		"Description": "The most heroic hero in all of testing land",
		"Level": 50,
		"ClassType": 0,
		"OwnerToken": "definitely a legit token"
	}`)

	req, _ := http.NewRequest("POST", "/characters/create", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 500, res.Code)
}

func TestGetCharacters_200(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo"
	}`)

	req, _ := http.NewRequest("POST", "/characters/get", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &[]models.Character{}
	json.NewDecoder(res.Body).Decode(results)

	testHero := -1
	for i := 0; i < len(*results); i++ {
		if (*results)[i].Name == "Test Hero" {
			testHero = i
			break
		}
	}

	assert.NotEqual(t, testHero, -1)
	if testHero == -1 {
		return
	}

	assert.Equal(t, 200, res.Code)
	assert.Equal(t, "Test Hero", (*results)[testHero].Name)
	assert.Equal(t, "The most heroic hero in all of testing land", (*results)[testHero].Description)
	assert.Equal(t, uint(50), (*results)[testHero].Level)
	assert.Equal(t, uint(0), (*results)[testHero].ClassType)
	var spells []models.Spell
	assert.Equal(t, spells, (*results)[testHero].Spells)
	var items []models.Item
	assert.Equal(t, items, (*results)[testHero].Items)
}

func TestGetCharacters_500(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "A totally legit token"
	}`)

	req, _ := http.NewRequest("POST", "/characters/get", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 500, res.Code)
}

func TestDeleteCharacter_202(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RpbmdhZG1pbiJ9.06xPQiaBk0W0IVx6KXcgBMFn_yvSM-6-Dbk4aiuMnOo",
		"CharacterID": 7
	}`)

	req, _ := http.NewRequest("DELETE", "/characters/delete", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	results := &models.Character{}
	json.NewDecoder(res.Body).Decode(results)

	assert.Equal(t, 202, res.Code)
	assert.Equal(t, "Test Hero", results.Name)
	assert.Equal(t, "The most heroic hero in all of testing land", results.Description)
	assert.Equal(t, uint(50), results.Level)
	assert.Equal(t, uint(0), results.ClassType)
	var spells []models.Spell
	assert.Equal(t, spells, results.Spells)
	var items []models.Item
	assert.Equal(t, items, results.Items)
}

func TestDeleteCharacter_500(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "real token",
		"CharacterID": 2
	}`)

	req, _ := http.NewRequest("DELETE", "/characters/delete", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 500, res.Code)
}

func TestDeleteCharacter_403(t *testing.T) {
	res := httptest.NewRecorder()

	//JSON request and parsing information at https://www.kirandev.com/http-post-golang
	body := []byte(`{
		"OwnerToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6InRlc3RlciJ9.Bx8FNXdyly-sYAktvvFq9rY0qiQt7bN8j5Kb3ZU_2eI",
		"CharacterID": 4
	}`)

	req, _ := http.NewRequest("DELETE", "/characters/delete", bytes.NewBuffer(body))
	router.Router.ServeHTTP(res, req)

	assert.Equal(t, 403, res.Code)
}
