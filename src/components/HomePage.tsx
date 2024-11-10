import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import TodoCard from "./TodoCard";
import { useTasks } from "@/context/useTasks";
import { useEffect, useState } from "react";

import { AddTaskModal } from "./AddTaskModal";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    tasks,
    totalTasks,
    activeTasks,
    deleteTask,
    fetchTasks,
    expiredTasks,
    completedTask,
  } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden w-64 p-4 bg-white border-r lg:block">
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gray-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 text-red-500 bg-red-100 rounded-full">
                <svg
                  className=" w-5 h-5"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24">
                  <path d="M10.42 12.657A2.5 2.5 0 1 1 13.93 9.15" />
                  <path d="M8.5 8.5v2.833L10 12.5" />
                  <path d="M16 16a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v.667" />
                  <path d="M18 19H6a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1Z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expired Tasks</p>
                <p className="text-2xl font-bold">{expiredTasks}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-gray-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 text-orange-500 bg-orange-100 rounded-full">
                <svg
                  className=" w-5 h-5"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24">
                  <path d="M8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  <path d="M9 12h6" />
                  <path d="M9 16h6" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">All Active Tasks</p>
                <p className="text-2xl font-bold">{activeTasks}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-gray-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 text-blue-500 bg-blue-100 rounded-full">
                <svg
                  className=" w-5 h-5"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Tasks</p>
                <p className="text-2xl font-bold">
                  {completedTask}/{totalTasks}
                </p>
              </div>
            </div>
          </div>
          <Button
            className="w-full bg-[#0D0B21] text-white hover:bg-[#0D0B21]/90"
            onClick={() => setIsOpen(true)}>
            + Add Task
          </Button>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 bg-white w-auto">
          <AddTaskModal onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input className="pl-9" placeholder="Search Project" />
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className=" bg-[#0D0B21] text-white sm:hidden  hover:bg-[#0D0B21]/90">
                +
              </Button>
            </DialogTrigger>
            <DialogContent aria-modal className="p-0  bg-white w-auto">
              <AddTaskModal onClose={() => setIsOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* To Do Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-600" />
              <h2 className="font-semibold">To Do</h2>
              <Badge variant="secondary">3</Badge>
            </div>
            {tasks && tasks.length > 0 ? (
              tasks
                .filter((task) => task.category == "To Do")
                .map((task, idx) => (
                  <TodoCard
                    task={task}
                    key={idx}
                    ondelete={() => deleteTask(task.id)}
                  />
                ))
            ) : (
              <div>No To Do Tasks left</div>
            )}
            {/* Additional To Do cards would go here */}
          </div>

          {/* On Progress Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-400" />
              <h2 className="font-semibold">On Progress</h2>
              <Badge variant="secondary">2</Badge>
            </div>
            {tasks && tasks.length > 0 ? (
              tasks
                .filter((task) => task.category == "On Progress")
                .map((task, idx) => (
                  <TodoCard
                    task={task}
                    key={idx}
                    ondelete={() => deleteTask(task.id)}
                  />
                ))
            ) : (
              <div>No To Do Tasks left</div>
            )}
            {/* Additional On Progress cards would go here */}
          </div>

          {/* Done Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <h2 className="font-semibold">Done</h2>
              <Badge variant="secondary">2</Badge>
            </div>
            {tasks && tasks.length > 0 ? (
              tasks
                .filter((task) => task.category == "Done")
                .map((task, idx) => (
                  <TodoCard
                    task={task}
                    key={idx}
                    ondelete={() => deleteTask(task.id)}
                  />
                ))
            ) : (
              <div>No To Do Tasks left</div>
            )}
            {/* Additional Done cards would go here */}
          </div>
        </div>
      </div>
    </div>
  );
}
