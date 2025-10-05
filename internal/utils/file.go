package utils

import (
	"log"
	"os"
)

func CreateDirIfNotExists(path string) {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		err := os.Mkdir(path, 0755)
		if err != nil {
			log.Fatal(err)
		}
	}
}

func WriteFile(path string, value string) error {
	err := os.WriteFile(path, []byte(value), 0644)
	if err != nil {
		return err
	}
	return nil
}
