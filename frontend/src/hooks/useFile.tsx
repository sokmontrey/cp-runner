import {model} from "../../wailsjs/go/models";
import {useEffect, useState} from "react";
import {GetAllFiles, OnFileSelected} from "../../wailsjs/go/main/App";

export const useFiles = () => {
    const [files, setFiles] = useState<model.File[]>([]);
    const [selectedFile, setSelectedFile] = useState<model.File | null>(null);

    const handleSelectFile = async (file: model.File) => {
        await OnFileSelected(file);
        setSelectedFile(file);
    };

    const fetchFiles = async () => {
        const fetchedFiles = await GetAllFiles();
        setFiles(fetchedFiles);
    }

    useEffect(() => {
        fetchFiles().then();
    }, []);

    return {
        files,
        setFiles,
        selectedFile,
        selectFile: handleSelectFile,
        fetchFiles,
    };
}