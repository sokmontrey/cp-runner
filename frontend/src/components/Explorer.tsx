import {model} from "../../wailsjs/go/models";
import FileItem from "./FileItem";

interface ExplorerProps {
    files: model.File[];
    selectedFile: model.File | null;
    onFileSelected: (file: model.File) => void;
    onRefreshFiles: () => void;
}

function Explorer(
    {
        files,
        selectedFile,
        onFileSelected,
        onRefreshFiles,
    }: ExplorerProps
) {
    return (<div>
        <button onClick={onRefreshFiles}>Refresh</button>
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
