package model

type Testcase struct {
	Id             string `json:"id"`
	Input          string `json:"input"`
	ExpectedOutput string `json:"expectedOutput"`
	ActualOutput   string `json:"actualOutput"`
	Diff           string `json:"diff"`
}
