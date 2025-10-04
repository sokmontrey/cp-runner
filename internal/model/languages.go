package model

type Language struct {
	Name      string   `json:"name"`
	Extension string   `json:"extension"`
	Commands  []string `json:"commands"`
}
