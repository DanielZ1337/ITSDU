import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/courses/schedule")({
  component: () => <div>Hello /courses/schedule!</div>,
});
