export function CourseTaskEmpty() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold">No tasks</h1>
      <p className="text-gray-600">You have no tasks in this course.</p>
    </div>
  );
}
