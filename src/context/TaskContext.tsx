// TaskContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import Task from "@/types/Task";
const API_BASE_URL = "http://localhost:8000/api";

interface TaskContextType {
  tasks: Task[];
  totalTasks: number;
  activeTasks: number;
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

    setTotalTasks(total);
    setActiveTasks(active);
    setExpiredTasks(expired);
  };

  // Add a new task
  const addTask = async (task: Task) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, task);
      const updatedTasks = [...tasks, response.data];
      setTasks(updatedTasks);
      updateTaskCounts(updatedTasks);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Update a task
  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/tasks/${id}`,
        updatedTask
      );
      const updatedTasks = tasks.map((task) =>
        task.id === id ? response.data : task
      );
      setTasks(updatedTasks);
      updateTaskCounts(updatedTasks);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`);
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
      updateTaskCounts(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Timeout handling for tasks
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.duration &&
          now - new Date(task.deadline).getTime() > task.duration
            ? { ...task, category: "Timeout" }
            : task
        )
      );
    }, 1000 * 60); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        totalTasks,
        activeTasks,
        expiredTasks,
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
