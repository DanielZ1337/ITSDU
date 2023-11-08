async function* getCompletion(
    message: string,
    elementId: number | string,
    signal?: AbortSignal,
) {
    const url = new URL(
        `/api/message/${elementId}`,
        "http://localhost:3000",
    );

    console.log(url);

    const res = await fetch(url, {
        method: "POST",
        signal,
        body: JSON.stringify({
            message,
        }),
    });

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No reader");
    const decoder = new TextDecoder();

    let loop = true
    while (loop) {
        const {done, value} = await reader.read();

        if (done) {
            loop = false
            break
        }

        const token = decoder.decode(value);
        yield token;

        if (signal?.aborted) {
            await reader.cancel();
            return;
        }
    }
}

export default getCompletion;