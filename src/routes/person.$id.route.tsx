import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/person/$id")({
  component: () => <div>Hello /person/$id!</div>,
});
