import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/courses/plans")({
  component: () => <div>Hello /courses/plans!</div>,
});
