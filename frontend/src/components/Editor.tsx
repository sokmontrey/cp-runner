import {useCallback, useEffect, useState} from "react";
import {model} from "../../wailsjs/go/models";
import TestcaseRow from "./TestcaseRow";
import {debounce} from "../lib/debounce";

interface EditorProps {
    testcases: model.Testcase[];
    onUpdateTestcase: (id: string, testcase: Partial<model.Testcase>) => void;
    onAddTestcase: () => void;
    selectedFile: model.File | null;
    onRefreshTestcases: () => void;
    onRemoveTestcase: (id: string) => void;
}

function Editor(
    {
        selectedFile,
        testcases,
        onUpdateTestcase,
        onAddTestcase,
        onRefreshTestcases,
        onRemoveTestcase,
    }: EditorProps
) {
    return (<div>
        <p>Editor: {selectedFile?.name}</p>
        {testcases.map(testcase =>
            <TestcaseRow
                key={testcase.id}
                testcase={testcase}
                onChange={onUpdateTestcase}
                onRemove={onRemoveTestcase}
            />
        )}
        <button onClick={onAddTestcase}>Add</button>
        <button onClick={onRefreshTestcases}>Refresh</button>
    </div>)
}

export default Editor;
