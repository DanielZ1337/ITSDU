import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold">ITSDU</h1>
          <p className="text-lg">
            The ITS Dutch University is a Dutch university that offers a variety of
            courses in the fields of IT and Engineering.
          </p>
        </div>
      </div>
    </div>
  );
}
