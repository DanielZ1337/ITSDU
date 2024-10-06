import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/courses/info")({
  component: () => <div>Hello /courses/info!</div>,
});
