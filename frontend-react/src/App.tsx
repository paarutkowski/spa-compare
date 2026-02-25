import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TasksPage } from "./pages/TasksPage";
import { TaskCreatePage } from "./pages/TaskCreatePage";
import { TaskEditPage } from "./pages/TaskEditPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/new" element={<TaskCreatePage />} />
        <Route path="/tasks/:id/edit" element={<TaskEditPage />} />
      </Routes>
    </BrowserRouter>
  );
}
