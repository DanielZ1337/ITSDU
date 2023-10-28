export default function UnreadNotificationsPingIndicator({amount}: {
    amount?: number
}) {

    return (
        <span className="flex h-[20px] w-[20px] absolute top-0 right-0">
            <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-500 opacity-75"></span>
            <span
                className="relative inline-flex rounded-full h-[20px] w-[20px] bg-secondary-500">
                <span className={"text-center m-auto text-xs text-white font-semibold"}>
                    {amount && amount > 9 ? "+9" : amount}
                </span>
            </span>
        </span>
    )
}