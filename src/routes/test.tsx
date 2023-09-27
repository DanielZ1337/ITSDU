import {Button} from "@/components/ui/button.tsx";
import {useEffect} from "react";
import {useStarredCourseCards} from "@/queries/useStarredCourseCards.ts";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {StarredCourses} from "@/reponseTypes/starredCourses.ts";

export default function Test() {
    // const [fetchData, setFetchData] = useState<boolean>(false)

    const {data, isLoading, refetch, isFetching} = useStarredCourseCards({
        pageIndex: "0",
        pageSize: "10",
        sortBy: "rank",
        searchText: "",
        isShowMore: "false",
    }, {
        //@ts-ignore
        enabled: true
    })


    useEffect(() => {
        console.log(data)
    }, [data]);

    return (
        <>
            yes
            <Button onClick={() => {
                refetch().then(() => {
                    console.log(data)
                })
            }}>test</Button>
            {isLoading && isFetching && <p>loading...</p>}
            {/*{data && <pre>{JSON.stringify(data, null, 2)}</pre>}*/}
            <div className="grid grid-cols-3 gap-4">
            {/*@ts-ignore*/}
                {data && data["EntityArray"].map((card:StarredCourses["EntityArray"][0]) => {
                        return (
                            <Card className={"w-fit"} key={card.CourseId}>
                                <CardHeader>
                                    <CardTitle>{card.Title} {card.IsFavouriteCourse && "⭐"}</CardTitle>
                                </CardHeader>
                                <CardDescription>
                                    {card.NumberOfAnnouncements} {card.NumberOfAnnouncements > 1 ? "Announcements" : "Announcement"}
                                </CardDescription>
                                <CardContent>
                                    <p>Card Content</p>
                                </CardContent>
                                <CardFooter>
                                    <p>Card Footer</p>
                                </CardFooter>
                            </Card>
                        )
                    }
                )}
            </div>
        </>
    )
}