import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/courses/updates")({
  component: () => <div>Hello /courses/updates!</div>,
});
