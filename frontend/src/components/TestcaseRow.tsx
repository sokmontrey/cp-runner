import {memo} from "react";
import {model} from "../../wailsjs/go/models";

interface TestcaseRowProps {
    testcase: model.Testcase;
    onChange: (id: string, testcase: Partial<model.Testcase>) => void;
}

const TestcaseRow = memo(function TestcaseRow(
    {
        testcase,
        onChange,
    }: TestcaseRowProps
) {
    return (
        <div>
            <textarea
                value={testcase.input}
                onChange={e => onChange(testcase.id, {input: e.target.value})}
            />
            <textarea
                value={testcase.expectedOutput}
                onChange={e => onChange(testcase.id, {expectedOutput: e.target.value})}
            />
            <textarea
                value={testcase.actualOutput}
                readOnly
            />
            <textarea
                value={testcase.diff}
                readOnly
            />
        </div>
    );
});

export default TestcaseRow;
