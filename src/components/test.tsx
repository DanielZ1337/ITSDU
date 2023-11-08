import useGETpersonalTasks from "@/queries/tasks/useGETpersonalTasks";
import {
    ItslearningRestApiEntitiesTaskDeadlineFilter
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.TaskDeadlineFilter";
import {
    ItslearningRestApiEntitiesTaskStatusFilter
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.TaskStatusFilter";
import {useQuery} from '@tanstack/react-query';
import {PineconeStore} from 'langchain/vectorstores/pinecone'
import {PDFLoader} from 'langchain/document_loaders/fs/pdf'
import {embeddings} from "@/lib/openai-embeddings";
import {pineconeClient} from "@/lib/pinecone";

export default function TestSuspense() {

    const {data} = useGETpersonalTasks({
        deadline: ItslearningRestApiEntitiesTaskDeadlineFilter.All,
        PageIndex: 0,
        PageSize: 200,
        status: ItslearningRestApiEntitiesTaskStatusFilter.All
    })

    const fileName = 'lec04-server-side.pdf'

    const {data: pageLevelDocs} = useQuery(['testaisomething'], async () => {
        const response = await fetch(
            `https://itsdu.danielz.dev/s3/${fileName}`
        )

        const blob = await response.blob()

        const loader = new PDFLoader(blob!)

        const pageLevelDocs = await loader.load()

        return pageLevelDocs
    }, {
        suspense: true,
    })

    if (!pageLevelDocs) {
        return <div>Loading...</div>
    }

    const pinecone = pineconeClient
    const pineconeIndex = pinecone.Index('itsdu')

    return (
        <>
            <pre>
                {JSON.stringify(data, null, 2)}
            </pre>
            <button onClick={async () => {
                await PineconeStore.fromDocuments(
                    pageLevelDocs,
                    embeddings,
                    {
                        pineconeIndex,
                        namespace: fileName
                    }
                )
            }}>
                test
            </button>
        </>
    )
}


/* export default function TestSuspense() {

    const useUnstarredCourses = createQueryFunction<GETstarredCoursesParams, GETstarredCourses>(
        GETunstarredCoursesApiUrl,
        TanstackKeys.UnstarredCourses
    );


    const usePUTcourseFavorite = createMutationFunction<PUTcourseFavoriteParams, PUTcourseFavoriteParams, PUTcourseFavorite>(
        "PUT",
        PUTcourseFavoriteApiUrl,
        TanstackKeys.CourseFavorite
    );

    const {mutate} = usePUTcourseFavorite()

    const {data, isLoading} = useUnstarredCourses({})

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>Test Suspense</h1>
            <div>
                {data?.EntityArray.map((course) => (
                    <div key={course.CourseId}>
                        <p>{course.Title}</p>
                        <button onClick={() => {
                            mutate({
                                courseId: course.CourseId,
                            })
                        }}>Favorite
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
} */