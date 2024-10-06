import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/courses/participants")({
  component: () => <div>Hello /courses/participants!</div>,
});
