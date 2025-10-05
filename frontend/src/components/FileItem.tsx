import {model} from "../../wailsjs/go/models";
import {CIcon, CProgrammingIcon, JavaIcon, PythonIcon} from "@hugeicons/core-free-icons/index";
import {HugeiconsIcon, IconSvgElement} from "@hugeicons/react";

interface FileItemProps {
    file: model.File;
    onFileSelected: (file: model.File) => void;
    isSelected: boolean;
}

function FileItem(
    {
        file,
        onFileSelected,
        isSelected,
    }: FileItemProps
) {
    const handleClick = () => {
        onFileSelected(file);
    };

    const icon: Record<string, IconSvgElement> = {
        '.cpp': CIcon,
        '.c': CProgrammingIcon,
        '.py': PythonIcon,
        '.java': JavaIcon,
    }

    return (
        <li key={file.name}>
            <button
                onClick={handleClick}
                disabled={isSelected}
                className={
                    'w-full py-1 px-7 border-l-2 hover:text-primary cursor-pointer flex flex-row gap-2 items-center justify-start ' +
                    (isSelected
                        ? 'border-primary bg-base-200 text-primary '
                        : 'border-transparent text-neutral-content ')
                }
            >
                <span>
                    <HugeiconsIcon
                        icon={icon[file.ext]}
                        size={20}
                    />
                </span>
                <span>{file.name}{file.ext}</span>
            </button>
        </li>
    );
}

export default FileItem;
