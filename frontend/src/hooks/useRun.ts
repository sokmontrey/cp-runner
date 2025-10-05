import {model} from "../../wailsjs/go/models";
import {ProcessSolution} from "../../wailsjs/go/main/App";

export const useRun = (selectedFile: model.File | null) => {
    const runCode = async () => {
        if (!selectedFile) {
            return;
        }
        await ProcessSolution(selectedFile);
    }

    return {
        runCode,
    }
}