import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function useFetchNextPageOnInView(hasNextPage: boolean | undefined, fetchNextPage: () => void) {
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    return ref;
}