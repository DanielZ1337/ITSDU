import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/messages/")({
  component: () => <div>Hello /messages/!</div>,
});
