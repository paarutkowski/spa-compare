import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Task, TaskPriority, TaskStatus } from "../types/task";
import { fetchTask, updateTask } from "../api/tasksApi";

type LoadStatus = "loading" | "success" | "error";
type SaveStatus = "idle" | "saving" | "error";

export function TaskEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);

  const [loadStatus, setLoadStatus] = useState<LoadStatus>("loading");
  const [loadError, setLoadError] = useState("");

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState("");

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  useEffect(() => {
    let mounted = true;

    async function load(): Promise<void> {
      setLoadStatus("loading");
      setLoadError("");

      try {
        if (!id) throw new Error("Invalid task ID");
        const data = await fetchTask(id);

        if (!mounted) return;

        setTask(data);
        setTitle(data.title ?? "");
        setStatus(data.status ?? "todo");
        setPriority(data.priority ?? "medium");

        setLoadStatus("success");
      } catch (err) {
        if (!mounted) return;
        setLoadError(err instanceof Error ? err.message : "Unknown error");
        setLoadStatus("error");
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  function validate(): string | null {
    const t = title.trim();
    if (!t) return "Title is required.";
    if (t.length < 3) return "Title must be at least 3 characters.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaveError("");

    const validationError = validate();
    if (validationError) {
      setSaveStatus("error");
      setSaveError(validationError);
      return;
    }

    if (!task) return;

    setSaveStatus("saving");

    try {
      const payload: Task = {
        ...task,
        title: title.trim(),
        status,
        priority,
      };

      await updateTask(task.id, payload);

      navigate("/tasks");
    } catch (err) {
      setSaveStatus("error");
      setSaveError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaveStatus("idle");
    }
  }

  if (loadStatus === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-xl p-6">
          <p className="text-sm text-gray-700">Loading…</p>
        </div>
      </div>
    );
  }

  if (loadStatus === "error") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-xl p-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {loadError}
          </div>

          <button
            type="button"
            onClick={() => navigate("/tasks")}
            className="mt-4 rounded-lg border px-4 py-2 text-sm"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-xl p-6">
        <h1 className="mb-4 text-2xl font-semibold">Edit task</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border bg-white p-6 shadow-sm"
        >
          {saveError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {saveError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">Min. 3 characters.</p>
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saveStatus === "saving"}
              className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
            >
              {saveStatus === "saving" ? "Saving…" : "Save"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/tasks")}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
