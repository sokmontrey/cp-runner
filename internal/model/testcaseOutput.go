package model

type TestcaseRun struct {
	Id     string `json:"id"`
	Output string `json:"output"`
	Diff   string `json:"diff"`
}
