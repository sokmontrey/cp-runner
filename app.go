package main

import (
	"bytes"
	"context"
	"cp-runner-go/internal/model"
	"cp-runner-go/internal/utils"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
)

// App struct
type App struct {
	ctx         context.Context
	path        string
	testDirPath string
	languages   map[string]model.Language
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
	utils.CreateDirIfNotExists(a.path)
	a.languages = map[string]model.Language{
		".cpp": {
			"C++",
			".cpp",
			"g++ $codeFile -o $tempFile && $tempFile < $inputFile",
		},
		".py": {
			"Python",
			".py",
			"python $codeFile < $inputFile",
		},
	}
}

// Helpers

func (a *App) getLanguageByExt(ext string) model.Language {
	return a.languages[ext]
}

// Event handlers

func (a *App) OnFileSelected(file model.File) {
	log.Println("File selected: ", file)
	utils.CreateDirIfNotExists(filepath.Join(a.path, file.Name))
	utils.CreateDirIfNotExists(filepath.Join(a.path, file.Name, "temps"))
	utils.CreateDirIfNotExists(filepath.Join(a.path, file.Name, "inputs"))
	utils.CreateDirIfNotExists(filepath.Join(a.path, file.Name, "actual-outputs"))
	utils.CreateDirIfNotExists(filepath.Join(a.path, file.Name, "expected-outputs"))
	utils.CreateDirIfNotExists(filepath.Join(a.path, file.Name, "diffs"))
}

func (a *App) OnTestcaseChanged(file model.File, testcase model.Testcase) {
	id := testcase.Id
	log.Println("Testcase changed: ", file, id, testcase)
	err := utils.WriteFile(filepath.Join(a.path, file.Name, "inputs", id+".in"), testcase.Input)
	if err != nil {
		log.Fatal(err)
	}
	err = utils.WriteFile(filepath.Join(a.path, file.Name, "expected-outputs", id+".out"), testcase.ExpectedOutput)
	if err != nil {
		log.Fatal(err)
	}
}

func (a *App) OnTestcaseDeleted(file model.File, id string) {
	log.Println("Testcase deleted: ", file, id)
	_ = os.Remove(filepath.Join(a.path, file.Name, "inputs", id+".in"))
	_ = os.Remove(filepath.Join(a.path, file.Name, "expected-outputs", id+".out"))
	_ = os.Remove(filepath.Join(a.path, file.Name, "actual-outputs", id+".txt"))
	_ = os.Remove(filepath.Join(a.path, file.Name, "diffs", id+".txt"))
	_ = os.Remove(filepath.Join(a.path, file.Name, "temps", id+".out"))
}

// Frontend API

func (a *App) GetAllFiles() []model.File {
	//filePath := filepath.Join(a.path)
	filePath := filepath.Join(a.path, "..")
	files, err := os.ReadDir(filePath)
	if err != nil {
		log.Fatal(err)
	}
	allowedExt := map[string]struct{}{}
	for _, language := range a.languages {
		allowedExt[language.Extension] = struct{}{}
	}

	// Find all files with allowed ext
	var results []model.File
	for _, file := range files {
		if file.IsDir() {
			continue
		}
		ext := filepath.Ext(file.Name())
		if _, ok := allowedExt[ext]; !ok {
			continue
		}
		results = append(results, model.File{
			FullName: file.Name(),
			Name:     strings.TrimSuffix(file.Name(), ext),
			Ext:      ext,
		})
	}

	return results
}

func (a *App) GetAllTestcaseIds(file model.File) []string {
	inputFiles, err := os.ReadDir(filepath.Join(a.path, file.Name, "inputs"))
	if err != nil {
		log.Fatal(err)
	}

	var results []string

	for _, inputFile := range inputFiles {
		if !inputFile.IsDir() && filepath.Ext(inputFile.Name()) == ".in" {
			ext := filepath.Ext(inputFile.Name())
			results = append(results, strings.TrimSuffix(inputFile.Name(), ext))
		}
	}

	return results
}

func (a *App) GetInput(file model.File, id string) string {
	input, err := os.ReadFile(filepath.Join(a.path, file.Name, "inputs", id+".in"))
	if err != nil {
		return ""
	}
	return string(input)
}

func (a *App) GetExpectedOutput(file model.File, id string) string {
	output, err := os.ReadFile(filepath.Join(a.path, file.Name, "expected-outputs", id+".out"))
	if err != nil {
		return ""
	}
	return string(output)
}

func (a *App) GetActualOutput(file model.File, id string) string {
	output, err := os.ReadFile(filepath.Join(a.path, file.Name, "actual-outputs", id+".txt"))
	if err != nil {
		return ""
	}
	return string(output)
}

func (a *App) GetDiff(file model.File, id string) string {
	diff, err := os.ReadFile(filepath.Join(a.path, file.Name, "diffs", id+".txt"))
	if err != nil {
		return ""
	}
	return string(diff)
}

func (a *App) GetAllTestcases(file model.File) []model.Testcase {
	ids := a.GetAllTestcaseIds(file)

	results := make([]model.Testcase, 0)
	for _, id := range ids {
		results = append(results, model.Testcase{
			Id:             id,
			Input:          a.GetInput(file, id),
			ExpectedOutput: a.GetExpectedOutput(file, id),
			ActualOutput:   a.GetActualOutput(file, id),
			Diff:           a.GetDiff(file, id),
		})
	}
	return results
}

func (a *App) ProcessSolution(file model.File) {
	language := a.getLanguageByExt(file.Ext)
	ids := a.GetAllTestcaseIds(file)

	var wg sync.WaitGroup

	for _, id := range ids {
		wg.Add(1)

		go func(id string) {
			defer wg.Done()

			codeFile := filepath.Join(a.path, "..", file.FullName)
			inputFile := filepath.Join(a.path, file.Name, "inputs", id+".in")
			actualOutputFile := filepath.Join(a.path, file.Name, "actual-outputs", id+".txt")
			expectedOutputFile := filepath.Join(a.path, file.Name, "expected-outputs", id+".out")
			tempFile := filepath.Join(a.path, file.Name, "temps", id+".out")
			diffFile := filepath.Join(a.path, file.Name, "diffs", id+".txt")

			isRun := a.RunCode(codeFile, inputFile, actualOutputFile, tempFile, language)

			runtime.EventsEmit(a.ctx, model.OutputChangedEventName, model.OutputChangedEvent{
				FileName: file.Name,
				Id:       id,
				Value:    a.GetActualOutput(file, id),
			})

			if isRun {
				a.CompareOutputs(expectedOutputFile, actualOutputFile, diffFile)
			} else {
				_ = os.WriteFile(diffFile, []byte(""), 0644)
			}

			runtime.EventsEmit(a.ctx, model.DiffChangedEventName, model.DiffChangedEvent{
				FileName: file.Name,
				Id:       id,
				Value:    a.GetDiff(file, id),
			})
		}(id)
	}

	wg.Wait()
}

func (a *App) RunCode(
	codeFile string,
	inputFile string,
	actualOutputFile string,
	tempFile string,
	language model.Language,
) bool {
	replacer := strings.NewReplacer(
		"$codeFile", codeFile,
		"$tempFile", tempFile,
		"$inputFile", inputFile,
	)

	replacedCommand := replacer.Replace(language.Command)
	cmd := exec.Command("sh", "-c", replacedCommand)
	output, err := cmd.CombinedOutput()
	if writeErr := os.WriteFile(actualOutputFile, bytes.TrimRight(output, "\n"), 0644); writeErr != nil {
		return false
	}
	if err != nil {
		return false
	}
	return true
}

func (a *App) CompareOutputs(
	expectedOutputFile string,
	actualOutputFile string,
	diffFile string,
) {
	writeErr := os.WriteFile(diffFile, []byte("0\n"), 0644)
	if writeErr != nil {
		log.Fatal(writeErr)
	}

	expected, _ := os.ReadFile(expectedOutputFile)
	actual, _ := os.ReadFile(actualOutputFile)

	expLines := strings.Split(strings.TrimSpace(string(expected)), "\n")
	actLines := strings.Split(strings.TrimSpace(string(actual)), "\n")

	var results []string
	maxLen := max(len(expLines), len(actLines))

	for i := 0; i < maxLen; i++ {
		if i < len(expLines) && i < len(actLines) && expLines[i] == actLines[i] {
			results = append(results, "1")
		} else {
			results = append(results, "0")
		}
	}

	err := os.WriteFile(diffFile, []byte(strings.Join(results, "\n")), 0644)
	if err != nil {
		log.Fatal(err)
	}
}

// Dummy method to expose event model to frontend

func (a *App) GetOutputChangedEvent() model.OutputChangedEvent {
	return model.OutputChangedEvent{
		FileName: "file",
		Id:       "id",
		Value:    "value",
	}
}

func (a *App) GetDiffChangedEvent() model.DiffChangedEvent {
	return model.DiffChangedEvent{
		FileName: "file",
		Id:       "id",
		Value:    "value",
	}
}
