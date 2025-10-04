import './App.css';
import {useEffect, useRef, useState} from "react";
import {
    GetAllSolutionFiles,
    GetAllTestcases, GetTestcaseRuns, RunCode,
    SaveTestcases,
    SelectFile,
} from "../wailsjs/go/main/App";
import {model} from "../wailsjs/go/models";

function App() {
    const [testcases, setTestcases] = useState<model.Testcase[]>([]);
    const [runs, setRuns] = useState<model.TestcaseRun[]>([]);
    const [currentFileExt, setCurrentFileExt] = useState<string>("");
    const [currentFileName, setCurrentFileName] = useState<string>("");
    const [files, setFiles] = useState<string[]>([]);

    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const onFileSelect = async (file: string) => {
        const {name, ext} = await SelectFile(file);
        setCurrentFileName(name);
        setCurrentFileExt(ext);
        const testcases = await GetAllTestcases(name);
        setTestcases(testcases);
        const outputs = await GetTestcaseRuns(currentFileName);
        setRuns(outputs);
        console.log("testcases: ", testcases);
    }

    const onInputChange = (id: string, input: string, output: string) => {
        const newTestcases = testcases.map(testcase =>
            testcase.id === id ? {...testcase, input: input, output: output} : testcase
        );
        setTestcases(newTestcases);
    }

    const onAddTestcase = () => {
        if (!currentFileName) {
            return;
        }
        const lastId = testcases.length > 0
            ? parseInt(testcases[testcases.length - 1].id)
            : 0;
        const newTestcase = {
            id: (lastId + 1).toString() || "1",
            input: "",
            output: ""
        };
        setTestcases([...testcases, newTestcase]);
    }

    const onRun = async () => {
        const isSuccess = await RunCode(currentFileName, currentFileExt);
        if (!isSuccess) {
            return;
        }
        const outputs = await GetTestcaseRuns(currentFileName);
        setRuns(outputs);
    }

    useEffect(() => {
        if (saveTimer.current) {
            clearTimeout(saveTimer.current);
        }

        saveTimer.current = setTimeout(() => {
            SaveTestcases(currentFileName, testcases)
                .then(() => console.log("saved"))
                .catch(err => console.error(err));
            saveTimer.current = null;
            console.log("testcase saved");
        }, 500);
    }, [testcases]);

    useEffect(() => {
        GetAllSolutionFiles()
            .then(files => setFiles(files));
    }, []);

    return (
        <div>
            <ul>
                {files.map(file =>
                    <li key={file.toString()}>
                        <button
                            key={file}
                            onClick={() => {
                                onFileSelect(file);
                            }}
                        >
                            {file}
                        </button>
                    </li>
                )}
            </ul>

            <div>
                {testcases.map((testcase, i) =>
                    <div key={testcase.id}>
                        <h3>{testcase.id}</h3>
                        <textarea
                            value={testcase.input}
                            onChange={e => onInputChange(testcase.id, e.target.value, testcase.output)}
                        />
                        <textarea
                            value={testcase.output}
                            onChange={e => onInputChange(testcase.id, testcase.input, e.target.value)}
                        />
                        <textarea
                            value={runs.find(run => run.id === testcase.id)?.output || ""}
                            readOnly
                        ></textarea>
                        <textarea
                            value={runs.find(run => run.id === testcase.id)?.diff || ""}
                            readOnly
                        ></textarea>
                    </div>
                )}
            </div>

            <button onClick={onAddTestcase}>Add</button>
            <button
                onClick={onRun}
            >Run</button>
        </div>
    )
}

export default App
