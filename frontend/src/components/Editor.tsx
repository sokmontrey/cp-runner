import {useCallback, useEffect, useState} from "react";
import {model} from "../../wailsjs/go/models";
import TestcaseRow from "./TestcaseRow";
import {debounce} from "../lib/debounce";

interface EditorProps {
    testcases: model.Testcase[];
    updateTestcase: (id: string, testcase: Partial<model.Testcase>) => void;
    addTestcase: () => void;
    selectedFile: model.File | null;
    fetchTestcases: () => void;
}

function Editor(
    {
        testcases,
        updateTestcase,
        addTestcase,
        selectedFile,
        fetchTestcases,
    }: EditorProps
) {
    return (<div>
        <p>Editor: {selectedFile?.name}</p>
        {testcases.map(testcase =>
            <TestcaseRow
                key={testcase.id}
                testcase={testcase}
                onChange={updateTestcase}
            />
        )}
        <button onClick={addTestcase}>Add</button>
        <button onClick={fetchTestcases}>Refresh</button>
    </div>)
}

export default Editor;
