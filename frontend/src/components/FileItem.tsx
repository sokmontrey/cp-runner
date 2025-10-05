import { model } from "../../wailsjs/go/models";

interface FileItemProps {
    file: model.File;
    onFileSelected: (file: model.File) => void;
    selectedFile: model.File | null;
}

function FileItem(
    {
        file,
        onFileSelected,
        selectedFile,
    }: FileItemProps
) {
    return (
        <li key={file.name}>
            <button
                onClick={() => onFileSelected(file)}
                disabled={selectedFile?.fullName === file.fullName}
            >
                {file.name}{file.ext}
            </button>
        </li>
    );
}

export default FileItem;
