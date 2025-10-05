import {model} from "../../wailsjs/go/models";
import FileItem from "./FileItem";
import {HugeiconsIcon} from '@hugeicons/react';
import {FolderIcon, RefreshIcon} from '@hugeicons/core-free-icons/index';

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
        <div className={'flex flex-row justify-between items-center p-4'}>
            <p className={'text-sm flex flex-row gap-2'}>
                <HugeiconsIcon
                    icon={FolderIcon}
                    size={20}
                    className={'text-primary'}
                />
                <span> Explorer </span>
            </p>
            <button
                onClick={onRefreshFiles}
                className={'btn btn-ghost btn-sm btn-circle'}
            >
                <HugeiconsIcon
                    icon={RefreshIcon}
                    size={17}
                />
            </button>
        </div>
        <ul className={''}>
            {files.map(file =>
                <FileItem
                    key={file.name}
                    file={file}
                    onFileSelected={onFileSelected}
                    isSelected={selectedFile?.name === file.name}
                />
            )}
        </ul>
    </div>)
}

export default Explorer;
