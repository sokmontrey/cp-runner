import './App.css';
import Explorer from "./components/Explorer";
import Editor from "./components/Editor";
import {useFiles} from "./hooks/useFile";
import {useTestcases} from "./hooks/useTestcase";
import {useRun} from "./hooks/useRun";

export default function App() {
    const {
        files,
        selectedFile,
        selectFile,
        fetchFiles,
    } = useFiles();

    const {
        testcases,
        fetchTestcases,
        updateTestcase,
        addTestcase,
    } = useTestcases(selectedFile);

    const {
        runCode
    } = useRun(selectedFile);

    return (<>
        <Explorer
            files={files}
            selectedFile={selectedFile}
            onFileSelected={selectFile}
            refreshFiles={fetchFiles}
        />
        <Editor
            addTestcase={addTestcase}
            selectedFile={selectedFile}
            testcases={testcases}
            updateTestcase={updateTestcase}
            fetchTestcases={fetchTestcases}
        />
        <button onClick={runCode}>Run</button>
    </>);
}
