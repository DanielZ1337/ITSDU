import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import useGETstarredCourses from "@/queries/course-cards/useGETstarredCourses.ts";


export default function Test() {
    const {data, isLoading, refetch} = useGETstarredCourses({
        isShowMore: false,
        PageIndex: 0,
        PageSize: 10,
    }, {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retryOnMount: false,
        retryDelay: 0,
    })

    if (isLoading) {
        return <p>Loading...</p>
    }

    console.log(data)

    return (
        <>
            yes
            <Button onClick={() => {
                refetch().then(() => {
                    console.log(data)
                })
            }}>test</Button>
            {/*{data && <pre>{JSON.stringify(data, null, 2)}</pre>}*/}
            <div className="grid grid-cols-3 gap-4">
                {/*@ts-ignore*/}
                {data.EntityArray.map((card) => {
                    return <Card className={"w-fit"} key={card.CourseId}>
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
                })}
            </div>
        </>
    )
}