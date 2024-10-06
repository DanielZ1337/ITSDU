import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/overview")({
  component: () => <div>Hello /overview!</div>,
});
