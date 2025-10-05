package model

const (
	OutputChangedEventName = "output-changed"
	DiffChangedEventName   = "diff-changed"
)

type OutputChangedEvent struct {
	FileName string `json:"fileName"`
	Id       string `json:"id"`
	Value    string `json:"value"`
}

type DiffChangedEvent struct {
	FileName string `json:"fileName"`
	Id       string `json:"id"`
	Value    string `json:"value"`
}
