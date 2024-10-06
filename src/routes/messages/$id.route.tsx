import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/messages/$id")({
  component: () => <div>Hello /messages/$id!</div>,
});
