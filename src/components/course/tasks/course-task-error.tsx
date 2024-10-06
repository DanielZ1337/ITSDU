export function CourseTaskError({ message }: { message: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold">Error</h1>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
