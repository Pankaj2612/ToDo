// TaskContext.tsx
import React, { createContext, useState, ReactNode, useCallback } from "react";
import axios from "axios";
import Task from "@/types/Task";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface TaskContextType {
  tasks: Task[];
  totalTasks: number;
  activeTasks: number;
  completedTask: number;
  expiredTasks: number;
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, updatedTask: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  fetchTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [activeTasks, setActiveTasks] = useState<number>(0);
  const [expiredTasks, setExpiredTasks] = useState<number>(0);
  const [completedTask, setcompletedTask] = useState<number>(0);

  // Fetch all tasks from the backend
  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(response.data);
      updateTaskCounts(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, []);

  const updateTaskCounts = (tasks: Task[]) => {
    const total = tasks.length;
    const active = tasks.filter(
      (task) => task.category === "On Progress" || task.category !== "To Do"
    ).length;
    const expired = tasks.filter((task) => task.category === "Timeout").length;
    const compelete = tasks.filter((task) => task.category === "Done").length;

    setTotalTasks(total);
    setActiveTasks(active);
    setExpiredTasks(expired);
    setcompletedTask(compelete);
  };

  // Add a new task
  const addTask = async (task: Task) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, task);
      if (response.status === 201) {
        toast.success("New Task Created Succesfully");
      }
      const updatedTasks = [...tasks, response.data];
      setTasks(updatedTasks);
      updateTaskCounts(updatedTasks);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  // Update a task
  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/tasks/${id}`,
        updatedTask
      );
      if (response.status === 201) {
        toast.success("Task Updated");
      }
      const updatedTasks = tasks.map((task) =>
        task.id === id ? response.data : task
      );

      setTasks(updatedTasks);
      updateTaskCounts(updatedTasks);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/tasks/${id}`);
      const updatedTasks = tasks.filter((task) => task.id !== id);
      if (response.status === 201) {
        toast.success("Task Deleted Succesfully");
      }
      setTasks(updatedTasks);
      updateTaskCounts(updatedTasks);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    }
  };


  return (
    <TaskContext.Provider
      value={{
        tasks,
        totalTasks,
        activeTasks,
        expiredTasks,
        completedTask,
        addTask,
        updateTask,
        deleteTask,
        fetchTasks,
      }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
