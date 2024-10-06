export default function UnreadNotificationsPingIndicator({
  amount,
}: {
  amount?: number;
}) {
  return (
    <span className="absolute top-0 right-0 flex h-[20px] w-[20px]">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-secondary-500"></span>
      <span className="relative inline-flex rounded-full h-[20px] w-[20px] bg-secondary-500">
        <span className={"text-center m-auto text-xs text-white font-semibold"}>
          {amount && amount > 9 ? "+9" : amount}
        </span>
      </span>
    </span>
  );
}
