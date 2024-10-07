import { Loader } from "@/components/ui/loader";
import useGETssoUrl from "@/queries/sso/useGETssoUrl";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
export default function NativeSSOElement() {
  const [searchParams] = useSearchParams();

  const url = searchParams.get("url");

  if (!url) throw new Error("url is required");

  const urlRef = useRef<HTMLIFrameElement>(null);

  const { data, isLoading, refetch } = useGETssoUrl(
    {
      url,
    },
    {
      ...(urlRef.current?.src
        ? {
            enabled: urlRef.current?.src !== url,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: true,
            keepPreviousData: true,
          }
        : {}),
    },
  );

  useEffect(() => {
    if (urlRef.current && urlRef.current.src !== url) {
      refetch();
    }
  }, [url, urlRef.current?.src]);

  useEffect(() => {
    if (data?.Url && urlRef.current) {
      if (urlRef.current.src === data?.Url) return;

      urlRef.current.src = data?.Url;
    }
  }, [data?.Url]);

  if (isLoading || !data?.Url)
    return (
      <div className="m-auto flex max-h-full flex-col items-center justify-center rounded-md p-4 ring ring-purple-500/50 bg-foreground/10">
        <div className="m-auto flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-md">
          <div className="flex h-full items-center justify-center">
            <Loader size={"md"} className={"m-auto"} />
          </div>
        </div>
      </div>
    );

  return (
    <webview
      src={data.Url}
      style={{ width: "100%", height: "100%" }}
      ref={urlRef}
    />
  );
}
