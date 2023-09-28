import {Link, useRouteError} from "react-router-dom";
import {buttonVariants} from "@/components/ui/button.tsx";

export default function ErrorPage() {
    const error = useRouteError() as any;
    console.error(error);

    return (
        <div className={"flex flex-col items-center justify-center gap-6"}>
            <div className={"flex flex-col items-center justify-center"}>
                <div className={"text-9xl font-bold text-gray-500"}>500</div>
                <h1>Oops!</h1>
                <p>Sorry, an unexpected error has occurred.</p>
                <p>
                    <i>{error?.statusText || error?.message}</i>
                </p>
            </div>
            <Link className={buttonVariants()} to="/">Go back to the home page</Link>
        </div>
    );
}