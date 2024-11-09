import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import Task from "@/types/Task";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { AddTaskModal } from "./AddTaskModal";
import { useState } from "react";

interface TodoCardProps {
  task: Task;
  ondelete: () => Promise<void>;
}

const TodoCard: React.FC<TodoCardProps> = ({ task, ondelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const priorityColors: Record<Task["priority"], string> = {
    High: "red-100",
    Medium: "yellow-400",
    Low: "orange-100",
  };

  const color = priorityColors[task.priority];
  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="flex flex-row d items-center justify-between space-y-0 pb-2">
        <Badge
          variant="secondary"
          className={task.category === "Done" ? `bg-green-300` : `bg-${color}`}>
          {task.category == "Done" ? "Completed" : task.priority}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <svg
                className="h-4 w-4"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsOpen(true)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={ondelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            {/* Optional trigger, could be the "Edit" button itself */}
          </DialogTrigger>
          <DialogContent className="p-0 bg-white w-auto">
            {/* Pass taskToEdit to the AddTaskModal */}
            <AddTaskModal
              onClose={() => setIsOpen(false)} // Close the modal when done
              taskToEdit={task} // Pass the task to edit
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg mb-2">{task.title}</CardTitle>
        <p className="text-sm text-gray-500">{task.description}</p>
        <div className="mt-4 text-sm text-gray-500">
          Deadline: {new Date(task.deadline).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoCard;
