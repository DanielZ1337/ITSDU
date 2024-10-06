import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/updates/$id")({
  component: () => <div>Hello /updates/$id!</div>,
});
