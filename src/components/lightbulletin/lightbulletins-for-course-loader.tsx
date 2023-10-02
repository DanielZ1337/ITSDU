export default function LightbulletinsForCourseLoader() {
    return (
        [...Array(4).keys()].map(i => i + 1).map((i) => (
            <div key={i} className="p-4 rounded-md bg-foreground/10 shadow-md hover:shadow-lg overflow-hidden">
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-400 rounded w-3/4"/>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-400 rounded"/>
                                <div className="h-4 bg-gray-400 rounded w-5/6"/>
                                <div className="h-4 bg-gray-400 rounded w-3/4"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-2 flex justify-between">
                    <span className="text-gray-600 flex gap-2 items-center">
                      Published by {' '}
                        <a
                            href="#"
                            className="text-blue-500 hover:underline"
                        >
                            <div className="animate-pulse h-4 w-24 bg-gray-400 rounded"/>
                        </a>{' '}
                        on
                        <div className="animate-pulse h-4 w-12 bg-gray-400 rounded"/>
                    </span>
                </div>
                <div className="mt-2 flex justify-between">
                    <span className="text-gray-600">
                      0 Comments
                    </span>
                    <span className="text-gray-600">
                        0 Resources
                    </span>
                </div>
            </div>
        ))
    )
}