import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import { TaskProvider } from "./context/TaskContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TaskProvider>
      <Toaster richColors position="bottom-center"/>
      <App />
    </TaskProvider>
  </StrictMode>
);
