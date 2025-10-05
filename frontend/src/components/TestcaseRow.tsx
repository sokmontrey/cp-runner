import {memo} from "react";
import {model} from "../../wailsjs/go/models";

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
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(testcase.id, {input: e.target.value});
    };

    const handleExpectedOutputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(testcase.id, {expectedOutput: e.target.value});
    };

    const handleOnRemove = () => {
        onRemove(testcase.id);
    };

    return (
        <div>
            <textarea
                value={testcase.input}
                onChange={handleInputChange}
            />
            <textarea
                value={testcase.expectedOutput}
                onChange={handleExpectedOutputChange}
            />
            <textarea
                value={testcase.actualOutput}
                readOnly
            />
            <textarea
                value={testcase.diff}
                readOnly
            />
            <button onClick={handleOnRemove}>Remove</button>
        </div>
    );
});

export default TestcaseRow;
