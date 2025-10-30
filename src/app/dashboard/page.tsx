"use client";

import { useRouter, useSearchParams } from "next/navigation";
import SecondHeader from "@/app/dashboard/_components/second-header";
import { dummyTaskLists } from "@/constants/dummyData";
// import { taskListService } from "@/services/tasklist-service";
import BoardView from "./_components/board-view";

type ViewMode = "list" | "board" | "calendar" | "analytics";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = (searchParams.get("view") as ViewMode) || "board";

  // function useTaskList() {
  //   return useQuery({
  //     queryKey: ["taskList"],
  //     queryFn: () => taskListService.getTaskLists("boardId"),
  //   });
  // }

  // const { data } = useTaskList();
  //  const taskLists = data?.data || dummyTaskLists;
  // const taskLists = data?.data;
  const taskLists = dummyTaskLists;

  const setView = (newView: ViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", newView);
    router.push(`?${params.toString()}`);
  };

  const renderView = () => {
    switch (view) {
      case "board":
        return <BoardView taskLists={taskLists} />;
      case "list":
        return (
          // <ListView taskLists={taskLists.flatMap((list) => list.taskCards)} />
          <div>ListView</div>
        );
      case "calendar":
        return (
          // <CalendarView tasks={taskLists.flatMap((list) => list.taskCards)} />
          <div>Calendar</div>
        );
      case "analytics":
        return (
          // <AnalyticsView tasks={taskLists.flatMap((list) => list.taskCards)} />
          <div>Analytics</div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SecondHeader setView={setView} currentView={view} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col">
          {/* Kanban Board Container */}
          <div className="custom-scrollbar-horizontal flex-1 overflow-x-auto px-4 py-4">
            {/* <BoardView taskLists={taskLists} /> */}
            {renderView()}
          </div>
        </div>
      </div>
    </>
  );
}
