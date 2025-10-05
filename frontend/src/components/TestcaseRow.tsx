import {memo, useEffect, useRef} from "react";
import {model} from "../../wailsjs/go/models";
import {HugeiconsIcon} from "@hugeicons/react";
import {Cancel01Icon, Delete03Icon, Tick01Icon} from "@hugeicons/core-free-icons/index";

interface TestcaseRowProps {
    testcase: model.Testcase;
    onChange: (id: string, testcase: Partial<model.Testcase>) => void;
    onRemove: (id: string) => void;
}

const TestcaseRow = memo(function TestcaseRow(
    {
        testcase,
        onChange,
        onRemove,
    }: TestcaseRowProps
) {
    const textareaClass =
        "font-mono flex-1 border border-neutral-content/50 rounded-lg p-2 resize-none overflow-x-auto overflow-y-hidden whitespace-pre";

    // const autoResize = (el: HTMLTextAreaElement | null) => {
    //     if (!el) return;
    //     el.style.height = "auto";
    //     el.style.height = `${el.scrollHeight}px`;
    // };

    const autoResize = (el: HTMLTextAreaElement | null) => {
        if (!el) return;
        el.style.height = "0px";
        el.style.height = `${el.scrollHeight}px`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        autoResize(e.target);
        onChange(testcase.id, {input: e.target.value});
    };

    const handleExpectedOutputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        autoResize(e.target);
        onChange(testcase.id, {expectedOutput: e.target.value});
    };

    const handleOnRemove = () => {
        onRemove(testcase.id);
    };

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const expectedRef = useRef<HTMLTextAreaElement>(null);
    const actualRef = useRef<HTMLTextAreaElement>(null);

    const actualOutputList = testcase.actualOutput.split("\n");
    const diffList = testcase.diff.split("\n");
    const outputZip = [];
    for (let i = 0; i < Math.max(actualOutputList.length, diffList.length); i++) {
        outputZip.push([actualOutputList[i] || "", diffList[i] === '1' || false]);
    }

    const isCorrect = outputZip.every(([_, isCorrect]) => isCorrect);

    useEffect(() => {
        autoResize(inputRef.current);
        autoResize(expectedRef.current);
        autoResize(actualRef.current);
    }, [testcase.input, testcase.expectedOutput, testcase.actualOutput]);

    return (<div>
        <div>
            <div className="text-sm flex flex-row gap-2 items-center">
                {isCorrect ? (
                    <span className="text-green-500">
                        <HugeiconsIcon icon={Tick01Icon} size={20}/>
                    </span>
                ) : (
                    <span className="text-red-500">
                        <HugeiconsIcon icon={Cancel01Icon} size={20}/>
                    </span>
                )}
                <span>{testcase.id}</span>
            </div>
        </div>
        <div className="flex flex-row gap-2 py-2">
            <textarea
                ref={inputRef}
                value={testcase.input}
                onChange={handleInputChange}
                className={textareaClass}
                placeholder="Input..."
            />
            <textarea
                ref={expectedRef}
                value={testcase.expectedOutput}
                onChange={handleExpectedOutputChange}
                className={textareaClass}
                placeholder="Expected output..."
            />
            <div
                className={
                    "flex-1 font-mono border py-2 rounded-md whitespace-pre " +
                    (isCorrect ? "border-green-500/50" : "border-red-500/50")
                }
            >
                {outputZip.map(([actual, isCorrect], i) => (
                    <div key={i} className={isCorrect ? "bg-green-500/20" : "bg-red-500/20"}>
                        {actual || " "}
                    </div>
                ))}
            </div>
            <button
                onClick={handleOnRemove}
                className="btn btn-soft btn-secondary btn-sm btn-square mt-1"
            >
                <HugeiconsIcon icon={Delete03Icon} size={20}/>
            </button>
        </div>
    </div>);
});

export default TestcaseRow;