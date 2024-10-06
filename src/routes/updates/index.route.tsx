import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/updates/")({
  component: () => <div>Hello /updates/!</div>,
});
