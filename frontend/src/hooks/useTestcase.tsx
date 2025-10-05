import {model} from "../../wailsjs/go/models";
import {useCallback, useEffect, useState} from "react";
import {GetAllTestcases, OnTestcaseChanged} from "../../wailsjs/go/main/App";
import {EventsOff, EventsOn} from "../../wailsjs/runtime";
import {debounceByKey} from "../lib/debounce";

export const useTestcases = (selectedFile: model.File | null) => {
    const [testcases, setTestcases] = useState<model.Testcase[]>([]);

    const saveTestcases = useCallback(
        debounceByKey(
            async (testcase: model.Testcase) => {
                if (!selectedFile) return;
                await OnTestcaseChanged(selectedFile, testcase);
            },
            500,
            (testcase: model.Testcase) => testcase.id
        ),
        [selectedFile]
    );

    const fetchTestcases = async () => {
        if (!selectedFile) {
            return;
        }
        const fetchedTestcases = await GetAllTestcases(selectedFile);
        setTestcases(fetchedTestcases);
    }

    const updateTestcase = (id: string, patch: Partial<model.Testcase>, skipSave: boolean = false) => {
        if (!selectedFile) {
            return;
        }
        const odlTestcase = testcases.find(testcase => testcase.id === id);
        if (!odlTestcase) {
            return;
        }
        const newTestcase = {...odlTestcase, ...patch};
        setTestcases(prev =>
            prev.map(testcase => testcase.id === id
                ? newTestcase
                : testcase)
        );
        if (!skipSave) {
            saveTestcases(newTestcase);
        }
    }

    const addTestcase = () => {
        if (!selectedFile) {
            return;
        }
        const newTestcase = {
            id: (testcases.length + 1).toString(),
            input: "",
            expectedOutput: "",
            actualOutput: "",
            diff: "",
        };
        setTestcases(prev => [...prev, newTestcase,]);
        saveTestcases(newTestcase);
    }

    useEffect(() => {
        if (!selectedFile) {
            return;
        }

        EventsOn("output-changed", ({fileName, id, value}: model.OutputChangedEvent) => {
            if (fileName !== selectedFile.name) {
                return;
            }
            updateTestcase(id, {actualOutput: value}, true);
        });

        EventsOn("diff-changed", ({fileName, id, value}: model.DiffChangedEvent) => {
            if (fileName !== selectedFile.name) {
                return;
            }
            updateTestcase(id, {diff: value}, true);
        });

        return () => {
            EventsOff("output-changed");
            EventsOff("diff-changed");
        }
    }, [selectedFile, updateTestcase, testcases]);

    useEffect(() => {
        if (!selectedFile) {
            return;
        }
        fetchTestcases().then();
    }, [selectedFile]);

    return {
        testcases,
        updateTestcase,
        addTestcase,
        fetchTestcases,
        saveTestcases,
    }
}