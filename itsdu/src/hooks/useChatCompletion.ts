import { useId, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getCompletion from "./getChatCompletion";

export default function useCompletionRQ(elementId: string | number) {
	const id = useId();

	const queryClient = useQueryClient();
	const { data } = useQuery<string>({
		queryKey: ["completion", elementId, id],
	});
	const [abortController, setAbortController] =
		useState<AbortController | null>();

	const { mutate, error, isLoading } = useMutation({
		mutationKey: ["completion", elementId, id],
		mutationFn: async (prompt: string) => {
			if (abortController) {
				abortController.abort();
			}
			const controller = new AbortController();
			const signal = controller.signal;
			setAbortController(controller);

			for await (const token of getCompletion(prompt, elementId, signal)) {
				queryClient.setQueryData<string>(
					["completion", elementId, id],
					(prev) => (prev ? prev + token : token),
				);
			}
			setAbortController(null);
		},
	});

	return [mutate, { data, error, isLoading }] as const;
}
