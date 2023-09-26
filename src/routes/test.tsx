import {Button} from "@/components/ui/button.tsx";
import {useEffect, useState} from "react";
import {useStarredCourseCards} from "@/queries/useStarredCourseCards.ts";

export default function Test() {
    const [fetchData, setFetchData] = useState<boolean>(false)

    const {data, isLoading, isFetching} = useStarredCourseCards({
        pageIndex: "0",
        pageSize: "10",
        sortBy: "rank",
        searchText: "",
        isShowMore: "false",
    }, {
        //@ts-ignore
        enabled: fetchData
    })

    useEffect(() => {
        console.log(data)
    }, [data]);

    return (
        <>
            <Button onClick={() => {
                setFetchData(true)
            }}>test</Button>
            {isLoading && isFetching && <p>loading...</p>}
            {data && <p>{JSON.stringify(data)}</p>}
        </>
    )
}