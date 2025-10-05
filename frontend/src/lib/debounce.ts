export function debounce<F extends (...args: any[]) => void>(fn: F, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<F>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

export function debounceByKey<F extends (...args: any[]) => void>(
    fn: F,
    delay: number,
    keySelector: (...args: Parameters<F>) => string
) {
    const timeouts = new Map<string, ReturnType<typeof setTimeout>>();

    return (...args: Parameters<F>) => {
        const key = keySelector(...args);
        const existing = timeouts.get(key);
        if (existing) clearTimeout(existing);

        const timeoutId = setTimeout(() => {
            fn(...args);
            timeouts.delete(key); // cleanup
        }, delay);

        timeouts.set(key, timeoutId);
    };
}