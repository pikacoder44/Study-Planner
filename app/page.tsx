export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Study Planner
        </h1>
        <p className="text-lg text-zinc-700 dark:text-zinc-300">
          Welcome to the Study Planner app! Please register or log in to get
          started.
        </p>
      </div>
    </div>
  );
}
