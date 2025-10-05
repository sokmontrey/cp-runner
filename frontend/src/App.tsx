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
        removeTestcase,
    } = useTestcases(selectedFile);

    const {
        runCode
    } = useRun(selectedFile);

    return (<>
        <Explorer
            files={files}
            selectedFile={selectedFile}
            onFileSelected={selectFile}
            onRefreshFiles={fetchFiles}
        />
        <Editor
            selectedFile={selectedFile}
            testcases={testcases}
            onAddTestcase={addTestcase}
            onUpdateTestcase={updateTestcase}
            onRemoveTestcase={removeTestcase}
            onRefreshTestcases={fetchTestcases}
        />
        <button onClick={runCode}>Run</button>
    </>);
}
