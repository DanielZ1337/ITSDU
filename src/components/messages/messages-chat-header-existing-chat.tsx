import {Button} from "@/components/ui/button.tsx";

export default function MessagesChatHeaderExistingChat({
                                                           isSettingNewThreadName,
                                                           setIsSettingNewThreadName,
                                                       }: {
    isSettingNewThreadName: boolean,
    // eslint-disable-next-line no-unused-vars
    setIsSettingNewThreadName: (value: boolean) => void,
}) {
    return (
        <div className={"flex space-x-2"}>
            <Button variant={"outline"} type="button">
                Other Actions
            </Button>
            <Button variant={"outline"} type="button"
                    onClick={() => setIsSettingNewThreadName(!isSettingNewThreadName)}>
                {isSettingNewThreadName ? "Cancel" : "Edit name"}
            </Button>
        </div>
    )
}