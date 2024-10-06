import useGETLinkOGPreview from "@/queries/extra/useGETLinkOGPreview";

export default function OgImagePreview({ url }: { url: string }) {
  const { isLoading, isError, data } = useGETLinkOGPreview(url);

  if (isLoading) {
    return (
      <div className={"w-full max-w-lg space-y-2 animate-pulse"}>
        <div className="flex h-64 items-center justify-center rounded bg-gray-300 dark:bg-gray-700">
          <svg
            className="h-10 w-10 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>
        <div className="w-full rounded-full bg-gray-200 h-2.5 dark:bg-gray-700 sm:w-72" />
        <div className="flex w-full items-center space-x-2">
          <div className="w-1/2 rounded-full bg-gray-200 h-2.5 dark:bg-gray-700 sm:w-32" />
          <div className="w-1/3 rounded-full bg-gray-300 h-2.5 dark:bg-gray-600s sm:w-24" />
          <div className="w-full rounded-full bg-gray-300 h-2.5 dark:bg-gray-600" />
        </div>
        <div className="flex w-full items-center space-x-2 max-w-[480px]">
          <div className="w-full rounded-full bg-gray-200 h-2.5 dark:bg-gray-700"></div>
          <div className="w-full rounded-full bg-gray-300 h-2.5 dark:bg-gray-600"></div>
          <div className="w-1/3 rounded-full bg-gray-300 h-2.5 dark:bg-gray-600 sm:w-24"></div>
        </div>
        <div className={"h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 sm:w-48"} />
      </div>
    );
  }

  if (isError || !data || !data.image.url) {
    return null;
  }

  return (
    <a
      className={
        "my-6 w-full h-full max-w-lg flex-wrap border-neutral-300 dark:border-neutral-500 border rounded-lg overflow-clip shadow-xl"
      }
      href={data.url}
      target={"_blank"}
      rel={"noopener noreferrer"}
    >
      <img
        src={data.image.url}
        alt={data.image.alt ?? data.title}
        width={0}
        height={0}
        sizes={"100vw"}
        className={"object-contain"}
        style={{ height: "100%", width: "100%" }}
      />

      <div className={"p-3 text-left break-all"}>
        <h1 className={"sm:text-xl text-base font-bold text-center mb-2 truncate"}>
          {data.title}
        </h1>
        <h3 className={"sm:text-base text-sm truncate"}>{data.description}</h3>
        <span className={"underline text-blue-500 text-xs"}>{data.url}</span>
      </div>
    </a>
  );
}
