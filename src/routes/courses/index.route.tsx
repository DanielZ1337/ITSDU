import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/courses/")({
  component: () => <div>Hello /courses/!</div>,
});
