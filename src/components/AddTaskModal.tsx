import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useTasks } from "@/context/useTasks";
import Task from "@/types/Task";

interface AddTaskModalProps {
  onClose: () => void;
  taskToEdit?: Task;
}

export function AddTaskModal({ onClose, taskToEdit }: AddTaskModalProps) {
  const { addTask, updateTask } = useTasks();
  const [status, setStatus] = useState<string | "Low" | "Medium" | "High">(
    taskToEdit?.priority || "Low"
  );
  const [taskTitle, setTaskTitle] = useState(taskToEdit?.title || "TASK 1");
  const [taskDescription, setTaskDescription] = useState(
    taskToEdit?.description || ""
  );
  const [deadline, setDeadline] = useState<Date | undefined>(
    taskToEdit?.deadline ? new Date(taskToEdit.deadline) : new Date()
  );
  const [assignedTo, setAssignedTo] = useState<
    string | "To Do" | "On Progress" | "Done"
  >(taskToEdit?.category || "To Do");

  useEffect(() => {
    console.log(assignedTo);
  }, [assignedTo]);

  const handleSave = () => {
    // Implement save logic here
    if (!deadline) return Date.now();
    console.log(assignedTo);

    const task: Task = {
      id: taskToEdit?.id || uuidv4(),
      title: taskTitle,
      description: taskDescription,
      category: assignedTo,
      priority: status,
      deadline: deadline,
      duration: deadline.getTime() - Date.now(),
    };
    if (taskToEdit) {
      updateTask(taskToEdit.id, task); // Update the task
    } else {
      addTask(task);
    }

    onClose();
  };

  return (
    <Card className="w-full max-w-md mx-auto" aria-hidden="false">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">ADD TASK</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Input
                  className="font-semibold border-none text-lg p-0 focus-visible:ring-0"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem></DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="h-px bg-gray-200 " />
            </div>
            <Textarea
              className="min-h-[200px] resize-none"
              placeholder="Enter task description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="deadline"
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${
                          !deadline && "text-muted-foreground"
                        }`}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadline ? (
                          format(deadline, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 ">
                      <Calendar
                        className="bg-white"
                        mode="single"
                        selected={deadline}
                        onSelect={setDeadline}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assigned-to">Assigned to</Label>
                  <Select value={assignedTo} onValueChange={setAssignedTo}>
                    <SelectTrigger id="assigned-to">
                      <SelectValue placeholder="Assign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="To Do">To Do</SelectItem>
                      <SelectItem value="On Progress">On Progress</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label>Priority</label>
                <div className="flex space-x-4">
                  {/* Low Priority */}
                  <label className="flex items-center space-x-2 cursor-pointer sr">
                    <input
                      type="radio"
                      name="priority"
                      value="Low"
                      checked={status === "Low"}
                      onChange={(e) => setStatus(e.target.value)}
                    />
                    <span className="text-sm font-semibold">Low</span>
                  </label>

                  {/* Medium Priority */}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value="Medium"
                      checked={status === "Medium"}
                      onChange={(e) => setStatus(e.target.value)}
                    />
                    <span className="text-sm font-semibold">Medium</span>
                  </label>

                  {/* High Priority */}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value="High"
                      checked={status === "High"}
                      onChange={(e) => setStatus(e.target.value)}
                    />
                    <span className="text-sm font-semibold">High</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Task</Button>
      </CardFooter>
    </Card>
  );
}
