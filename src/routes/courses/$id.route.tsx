import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/courses/$id")({
  component: () => <div>Hello /courses/$id!</div>,
});
