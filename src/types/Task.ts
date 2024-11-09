interface Task {
  id: string;
  title: string;
  description: string;
  category: string | "To Do" | "On Progress" | "Done" | "Timeout";
  duration: number; // Duration in milliseconds
  deadline: Date;
  priority: string | "Low" | "Medium" | "High";
}

export default Task;
