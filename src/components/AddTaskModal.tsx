import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { useTasks } from "@/context/useTasks";
import Task from "@/types/Task";

interface AddTaskModalProps {
  onClose: () => void;
  taskToEdit?: Task;
}

export function AddTaskModal({ onClose, taskToEdit }: AddTaskModalProps) {
  const { addTask, updateTask } = useTasks();
  const [taskTitle, setTaskTitle] = useState(taskToEdit?.title || "TASK 1");
  const [taskDescription, setTaskDescription] = useState(
    taskToEdit?.description || ""
  );
  const [deadline, setDeadline] = useState<Date | undefined>(
    taskToEdit?.deadline ? new Date(taskToEdit.deadline) : undefined
  );
  const [assignedTo, setAssignedTo] = useState<string>(
    taskToEdit?.category || "To Do"
  );
  const [priority, setPriority] = useState(taskToEdit?.priority || "Medium");

  const handleSave = () => {
    // Implement save logic here
    if (!deadline) return Date.now();
    const task: Task = {
      id: uuidv4(),
      title: taskTitle,
      description: taskDescription,
      category: assignedTo,
      priority: priority,
      deadline: deadline,
      duration: deadline.getTime() - Date.now(),
    };
    if (taskToEdit) {
      updateTask(taskToEdit.id, task); // Update the task
    } else {
      addTask(task); // Add a new task
    }

    onClose();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">ADD TASK</CardTitle>
        {/* <Button variant="ghost" size="icon" onClick={onClose}>
          <Plus className="h-4 w-4 rotate-45" />
          <span className="sr-only">Close</span>
        </Button> */}
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
              <div className="h-px bg-gray-200" aria-hidden="true" />
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
                        initialFocus
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
                <Label>Priority</Label>
                <RadioGroup
                  defaultValue="Medium"
                  value={priority}
                  onValueChange={setPriority}
                  className="flex space-x-2 ">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Low"
                      id="Low"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="Low"
                      className="rounded-full cursor-pointer px-3 py-1 text-xs font-semibold peer-aria-checked:bg-green-100 peer-aria-checked:text-green-600 bg-gray-100">
                      Low
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Medium"
                      id="Medium"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="Medium"
                      className="rounded-full px-3 cursor-pointer py-1 text-xs font-semibold peer-aria-checked:bg-yellow-100 peer-aria-checked:text-yellow-600 bg-gray-100">
                      Medium
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="High"
                      id="High"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="High"
                      className="rounded-full px-3 cursor-pointer py-1 text-xs font-semibold peer-aria-checked:bg-red-100 peer-aria-checked:text-red-600 bg-gray-100">
                      High
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>

        <Button className="bg-primary" onClick={handleSave}>
          Save Task
        </Button>
      </CardFooter>
    </Card>
  );
}
