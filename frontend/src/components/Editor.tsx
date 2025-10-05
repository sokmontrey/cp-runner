import {useCallback, useEffect, useState} from "react";
import {model} from "../../wailsjs/go/models";
import TestcaseRow from "./TestcaseRow";
import {debounce} from "../lib/debounce";
import {HugeiconsIcon} from "@hugeicons/react";
import {AddIcon, ArrowRight01Icon, RefreshIcon, WorkoutRunIcon} from "@hugeicons/core-free-icons/index";

interface EditorProps {
    testcases: model.Testcase[];
    onUpdateTestcase: (id: string, testcase: Partial<model.Testcase>) => void;
    onAddTestcase: () => void;
    selectedFile: model.File | null;
    onRefreshTestcases: () => void;
    onRemoveTestcase: (id: string) => void;
    onRunCode: () => void;
}

function Editor(
    {
        selectedFile,
        testcases,
        onUpdateTestcase,
        onAddTestcase,
        onRefreshTestcases,
        onRemoveTestcase,
        onRunCode,
    }: EditorProps
) {
    return (<div className={'p-4'}>
        <div className={'flex flex-row justify-start gap-2 items-center mb-4 sticky top-0 bg-base-200 z-10 p-4'}>
            <button
                className={'btn btn-primary btn-sm '}
                onClick={onRunCode}
            >
                Run
            </button>
            <button
                onClick={onRefreshTestcases}
                className={'btn btn-soft btn-default btn-sm btn-square '}
            >
                <HugeiconsIcon
                    icon={RefreshIcon}
                    size={20}
                />
            </button>
            <button
                onClick={onAddTestcase}
                className={'btn btn-soft btn-primary btn-sm btn-square '}
            >
                <HugeiconsIcon
                    icon={AddIcon}
                    size={20}
                />
            </button>
            <p className={'flex flex-row gap-2 text-neutral-content/80'}>
                {selectedFile?.name}{selectedFile?.ext}
            </p>
        </div>
        <div>
            <p className={'text-md text-neutral-content/80 mb-2'}>Testcases</p>
            {testcases.map(testcase =>
                <TestcaseRow
                    key={testcase.id}
                    testcase={testcase}
                    onChange={onUpdateTestcase}
                    onRemove={onRemoveTestcase}
                />
            )}
        </div>
    </div>)
}

export default Editor;
