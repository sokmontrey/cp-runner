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

    return (<div className={'flex flex-row bg-base-300 h-screen'}>
        <div className={'w-64'}>
            <Explorer
                files={files}
                selectedFile={selectedFile}
                onFileSelected={selectFile}
                onRefreshFiles={fetchFiles}
            />
        </div>
        <div className={'flex-1 bg-base-200 rounded-l-2xl overflow-y-scroll'}>
            {selectedFile
                ? <Editor
                    selectedFile={selectedFile}
                    testcases={testcases}
                    onAddTestcase={addTestcase}
                    onUpdateTestcase={updateTestcase}
                    onRemoveTestcase={removeTestcase}
                    onRefreshTestcases={fetchTestcases}
                    onRunCode={runCode}
                />
                : <div className={'w-full h-full flex flex-row justify-center items-center gap-2 text-neutral-content/80'}>
                    <p>Select a file to get started</p>
                </div>
            }
        </div>
    </div>);
}
