import { model } from "../../wailsjs/go/models";
import { useCallback, useEffect, useState } from "react";
import { GetAllTestcases, OnTestcaseChanged, OnTestcaseDeleted } from "../../wailsjs/go/main/App";
import { EventsOff, EventsOn } from "../../wailsjs/runtime";
import { debounceByKey } from "../lib/debounce";

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

    const updateTestcase = useCallback(
        (id: string, patch: Partial<model.Testcase>, skipSave: boolean = false) => {
            setTestcases(prev => {
                const old = prev.find(t => t.id === id);
                if (!old) return prev;
                const updated = { ...old, ...patch };
                const newList = prev.map(t => (t.id === id ? updated : t));
                if (!skipSave && selectedFile) saveTestcases(updated);
                return newList;
            });
        },
        [selectedFile, saveTestcases]
    );

    const fetchTestcases = useCallback(async () => {
        if (!selectedFile) return;
        const fetched = await GetAllTestcases(selectedFile);
        setTestcases(fetched);
    }, [selectedFile]);

    const addTestcase = useCallback(() => {
        if (!selectedFile) return;
        const newTestcase = {
            id: Date.now().toString(),
            input: "",
            expectedOutput: "",
            actualOutput: "",
            diff: "",
        };
        setTestcases(prev => [...prev, newTestcase]);
        saveTestcases(newTestcase);
    }, [selectedFile, saveTestcases]);

    const removeTestcase = useCallback(
        async (id: string) => {
            if (!selectedFile) return;
            await OnTestcaseDeleted(selectedFile, id);
            setTestcases(prev => prev.filter(t => t.id !== id));
        },
        [selectedFile]
    );

    useEffect(() => {
        if (!selectedFile) return;

        const handleOutputChanged = ({ fileName, id, value }: model.OutputChangedEvent) => {
            if (fileName !== selectedFile.name) return;
            updateTestcase(id, { actualOutput: value }, true);
        };

        const handleDiffChanged = ({ fileName, id, value }: model.DiffChangedEvent) => {
            if (fileName !== selectedFile.name) return;
            updateTestcase(id, { diff: value }, true);
        };

        EventsOn("output-changed", handleOutputChanged);
        EventsOn("diff-changed", handleDiffChanged);

        return () => {
            EventsOff("output-changed");
            EventsOff("diff-changed");
        };
    }, [selectedFile, updateTestcase]);

    useEffect(() => {
        if (!selectedFile) return;
        fetchTestcases().then();
    }, [selectedFile, fetchTestcases]);

    return {
        testcases,
        updateTestcase,
        addTestcase,
        fetchTestcases,
        saveTestcases,
        removeTestcase,
    };
};
