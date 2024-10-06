import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/courses/tasks")({
  component: () => <div>Hello /courses/tasks!</div>,
});
