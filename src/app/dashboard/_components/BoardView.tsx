import type { TaskListWithCards } from "@/types";
import AddTaskList from "./AddTaskList";
import TaskCard from "./task-card";
import TaskList from "./task-list";

export default function BoardView({
  taskLists,
}: {
  taskLists: TaskListWithCards[] | undefined;
}) {
  if (!taskLists) {
    return (
      <div className="flex h-full min-w-max gap-4 lg:gap-6">
        <AddTaskList />
      </div>
    );
  }

  return (
    <div className="flex h-full min-w-max gap-4 lg:gap-6">
      {taskLists
        .sort((a, b) => a.position - b.position)
        .map((taskList) => (
          <TaskList key={taskList.id} title={taskList.name}>
            {taskList.taskCards.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </TaskList>
        ))}
      <AddTaskList />
    </div>
  );
}
