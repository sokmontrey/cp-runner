import {model} from "../../wailsjs/go/models";
import FileItem from "./FileItem";

interface ExplorerProps {
    files: model.File[];
    selectedFile: model.File | null;
    onFileSelected: (file: model.File) => void;
    refreshFiles: () => void;
}

function Explorer(
    {
        files,
        selectedFile,
        onFileSelected,
        refreshFiles,
    }: ExplorerProps
) {
    return (<div>
        <button onClick={refreshFiles}>Refresh</button>
        <p>File: {selectedFile?.name}</p>
        <ul>
            {files.map(file =>
                <FileItem
                    key={file.name}
                    file={file}
                    onFileSelected={onFileSelected}
                    selectedFile={selectedFile}
                />
            )}
        </ul>
    </div>)
}

export default Explorer;
