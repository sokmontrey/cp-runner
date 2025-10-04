package main

import (
	"context"
	"cp-runner-go/internal/model"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// App struct
type App struct {
	ctx         context.Context
	path        string
	testDirPath string
	languages   []model.Language
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	currentPath, _ := os.Getwd()
	a.path = filepath.Join(currentPath, "cp-runner")
	a.createDirIfNotExists(a.path)
	a.createDirIfNotExists(filepath.Join(a.path, "testcases"))
	a.createDirIfNotExists(filepath.Join(a.path, "temps"))
	a.createDirIfNotExists(filepath.Join(a.path, "diffs"))
	a.createDirIfNotExists(filepath.Join(a.path, "outputs"))
	a.languages = []model.Language{
		{
			"C++",
			".cpp",
			[]string{
				"g++ $codeFile -o $tempFile",
				"$tempFile < $inputFile",
			},
		},
		//{
		//	"Python",
		//	".py",
		//	[]string{
		//		"python3 $fileName$fileExt < $inputFile > $outputFile",
		//	},
		//},
	}
}

func (a *App) GetCurrentPath() string {
	return a.path
}

// Helpers

func (a *App) createDirIfNotExists(path string) {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		err := os.Mkdir(path, 0755)
		if err != nil {
			log.Fatal(err)
		}
	}
}

func (a *App) writeFile(path string, value string) error {
	err := os.WriteFile(path, []byte(value), 0644)
	if err != nil {
		return err
	}
	return nil
}

// Frontend API

func (a *App) GetAllSolutionFiles() []string {
	filePath := filepath.Join(a.path)
	//filePath := filepath.Join(a.path, "..") // TODO: replace this
	files, err := os.ReadDir(filePath)
	if err != nil {
		log.Fatal(err)
	}

	allowedExt := map[string]struct{}{
		".go": {},
	}

	for _, language := range a.languages {
		allowedExt[language.Extension] = struct{}{}
	}

	var results []string
	for _, file := range files {
		if file.IsDir() {
			continue
		}
		ext := filepath.Ext(file.Name())
		if _, ok := allowedExt[ext]; ok {
			results = append(results, file.Name())
		}
	}

	return results
}

func (a *App) GetAllTestcaseIds(fileName string) []string {
	files, err := os.ReadDir(filepath.Join(a.path, "testcases", fileName))
	if err != nil {
		log.Fatal(err)
	}

	var results []string

	for _, file := range files {
		if !file.IsDir() && filepath.Ext(file.Name()) == ".in" {
			ext := filepath.Ext(file.Name())
			results = append(results, strings.TrimSuffix(file.Name(), ext))
		}
	}

	return results
}

func (a *App) GetTestcase(fileName string, id string) model.Testcase {
	input, err := os.ReadFile(filepath.Join(a.path, "testcases", fileName, id+".in"))
	if err != nil {
		log.Fatal(err)
	}
	output, err := os.ReadFile(filepath.Join(a.path, "testcases", fileName, id+".out"))
	if err != nil {
		log.Fatal(err)
	}
	return model.Testcase{
		Id:     id,
		Input:  string(input),
		Output: string(output),
	}
}

func (a *App) GetAllTestcases(fileName string) []model.Testcase {
	testcaseIds := a.GetAllTestcaseIds(fileName)
	results := make([]model.Testcase, 0, len(testcaseIds))
	for _, id := range testcaseIds {
		results = append(results, a.GetTestcase(fileName, id))
	}
	return results
}

func (a *App) SelectFile(file string) model.File {
	ext := filepath.Ext(file)
	fileName := strings.TrimSuffix(file, ext)
	a.createDirIfNotExists(filepath.Join(a.path, "testcases", fileName))
	a.createDirIfNotExists(filepath.Join(a.path, "diffs", fileName))
	a.createDirIfNotExists(filepath.Join(a.path, "outputs", fileName))
	a.createDirIfNotExists(filepath.Join(a.path, "temps", fileName))
	return model.File{
		Name: fileName,
		Ext:  ext,
	}
}

func (a *App) SaveTestcases(fileName string, testcases []model.Testcase) {
	if len(testcases) == 0 {
		return
	}
	for _, testcase := range testcases {
		err := a.writeFile(filepath.Join(a.path, "testcases", fileName, testcase.Id+".in"), testcase.Input)
		if err != nil {
			log.Fatal(err)
		}
		err = a.writeFile(filepath.Join(a.path, "testcases", fileName, testcase.Id+".out"), testcase.Output)
		if err != nil {
			log.Fatal(err)
		}
	}
}

func (a *App) GetTestcaseRuns(fileName string) []model.TestcaseRun {
	testcaseIds := a.GetAllTestcaseIds(fileName)
	results := make([]model.TestcaseRun, 0, len(testcaseIds))
	for _, id := range testcaseIds {
		diff, err := os.ReadFile(filepath.Join(a.path, "diffs", fileName, id+".txt"))
		if err != nil {
			continue
		}
		output, err := os.ReadFile(filepath.Join(a.path, "outputs", fileName, id+".txt"))
		if err != nil {
			continue
		}
		results = append(results, model.TestcaseRun{
			Id:     id,
			Output: string(output),
			Diff:   string(diff),
		})
	}
	return results
}

func (a *App) GetLanguages() []model.Language {
	return a.languages
}

func (a *App) getLanguageByExt(ext string) model.Language {
	for _, language := range a.languages {
		if language.Extension == ext {
			return language
		}
	}
	return model.Language{}
}

func (a *App) RunCode(fileName string, fileExt string) bool {
	language := a.getLanguageByExt(fileExt)
	testcaseIds := a.GetAllTestcaseIds(fileName)

	for _, testcaseId := range testcaseIds {
		codeFile := filepath.Join(a.path, fileName+fileExt)
		inputFile := filepath.Join(a.path, "testcases", fileName, testcaseId+".in")
		expectedOutputFile := filepath.Join(a.path, "testcases", fileName, testcaseId+".out")
		outputFile := filepath.Join(a.path, "outputs", fileName, testcaseId+".txt")
		diffFile := filepath.Join(a.path, "diffs", fileName, testcaseId+".txt")
		tempFile := filepath.Join(a.path, "temps", fileName, testcaseId+".out")

		replacer := strings.NewReplacer(
			"$codeFile", codeFile,
			"$inputFile", inputFile,
			"$outputFile", outputFile,
			"$tempFile", tempFile,
		)

		for _, command := range language.Commands {
			cmd := exec.Command("sh", "-c", replacer.Replace(command))
			output, err := cmd.CombinedOutput()
			if writeErr := os.WriteFile(outputFile, output, 0644); writeErr != nil {
				log.Fatal(writeErr)
			}
			if err != nil {
				writeErr := os.WriteFile(diffFile, []byte("0\n"), 0644)
				if writeErr != nil {
					log.Fatal(writeErr)
				}
				break
			}
		}
		expected, _ := os.ReadFile(expectedOutputFile)
		actual, _ := os.ReadFile(outputFile)

		expLines := strings.Split(strings.TrimSpace(string(expected)), "\n")
		actLines := strings.Split(strings.TrimSpace(string(actual)), "\n")

		var results []string
		for i := 0; i < len(expLines) && i < len(actLines); i++ {
			if expLines[i] == actLines[i] {
				results = append(results, "1")
			} else {
				results = append(results, "0")
			}
		}
		if len(expLines) != len(actLines) {
			for i := len(results); i < max(len(expLines), len(actLines)); i++ {
				results = append(results, "0")
			}
		}

		_ = os.WriteFile(diffFile, []byte(strings.Join(results, "\n")), 0644)
	}
	return true
}
