import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function useFetchNextPageOnInView(
  hasNextPage: boolean | undefined,
  fetchNextPage: () => void,
  isFetchingNextPage?: boolean,
) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  return ref;
}
