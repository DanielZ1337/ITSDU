import {Suspense} from "react";
import {Spinner} from "@nextui-org/spinner";

export default function SuspenseWrapper({children}: {
    children: React.ReactNode
}) {
    return (
        <Suspense
            fallback={<Spinner size="lg" color="primary" label="Loading..." className={"m-auto"}/>}>
            {children}
        </Suspense>
    )
}