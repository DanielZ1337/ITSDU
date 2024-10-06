import { useEffect, useState } from "react";
import { useUser } from "./atoms/useUser.ts";

export const useAIChatCompletion = (
  prompt: string,
  elementId: string | number,
  callback: () => void,
) => {
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [controller, setController] = useState<AbortController | null>(null);

  useEffect(() => {
    const newController = new AbortController();
    setController(newController);
    const { signal } = newController;

    async function fetchChatCompletion() {
      setLoading(true);

      try {
        if (!user) {
          throw new Error("No user");
        }

        const res = await fetch(`http://itsdu.danielz.dev/api/message/${elementId}`, {
          method: "POST",
          body: JSON.stringify({
            message: prompt,
            userId: user.PersonId,
          }),
          signal,
        });

        const reader = res.body?.getReader();

        if (!reader) {
          throw new Error("No reader");
        }

        const decoder = new TextDecoder("utf-8");

        let loop = true;

        while (loop) {
          if (signal?.aborted) {
            await reader.cancel();
            return;
          }
          const chunk = await reader.read();

          const { done, value } = chunk;

          if (done) {
            loop = false;
            break;
          }

          const decodedChunk = decoder.decode(value);
          setMessage((prev) => prev + decodedChunk);
        }
        setLoading(false);
        callback();
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        }
      }
    }

    fetchChatCompletion();

    return () => {
      newController.abort();
    };
  }, []);

  const abort = () => {
    if (controller) {
      controller.abort();
    }
  };

  return { loading, errorMessage, abort, message };
};
