package model

type File struct {
	FullName string `json:"fullName"`
	Name     string `json:"name"`
	Ext      string `json:"ext"`
}
