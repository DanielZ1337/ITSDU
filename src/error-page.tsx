import { buttonVariants } from "@/components/ui/button.tsx";
import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage({
  children,
}: {
  children?: React.ReactNode;
}) {
  const routeError = useRouteError() as any;

  console.error(routeError);

  if (children) {
    return <>{children}</>;
  }

  return (
    <div className={"flex flex-col items-center justify-center gap-6 h-full flex-1"}>
      <div className={"flex flex-col items-center justify-center"}>
        <div className={"text-9xl font-bold text-gray-500"}>
          {routeError?.statusText || 500}
        </div>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{routeError?.statusText || routeError?.message}</i>
        </p>
      </div>
      <Link className={buttonVariants()} to="/">
        Go back to the home page
      </Link>
    </div>
  );
}
