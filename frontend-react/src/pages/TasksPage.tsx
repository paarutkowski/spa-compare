import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Task, TaskStatus } from "../types/task";
import { formatDate } from "../utils/formatDate";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { deleteTask, fetchTasks } from "../api/tasksApi";

type LoadStatus = "idle" | "loading" | "success" | "error";

function normalizeStatus(value: string | null): "all" | TaskStatus {
  if (value === "todo" || value === "in_progress" || value === "done")
    return value;
  return "all";
}

export function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQ = searchParams.get("q") ?? "";
  const initialStatus = normalizeStatus(searchParams.get("status"));

  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [error, setError] = useState<string>("");

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [query, setQuery] = useState<string>(initialQ);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(initialQ);
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>(
    initialStatus,
  );

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const s = normalizeStatus(searchParams.get("status"));

    setQuery(q);
    setDebouncedQuery(q);
    setStatusFilter(s);
  }, [searchParams]);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);

    const q = debouncedQuery.trim();
    if (q) next.set("q", q);
    else next.delete("q");

    if (statusFilter !== "all") next.set("status", statusFilter);
    else next.delete("status");

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [debouncedQuery, statusFilter, searchParams, setSearchParams]);

  const apiParams = useMemo(
    () => ({
      q: debouncedQuery || undefined,
      status: statusFilter,
    }),
    [debouncedQuery, statusFilter],
  );

  useEffect(() => {
    let mounted = true;

    async function load(): Promise<void> {
      setStatus("loading");
      setError("");

      try {
        const data = await fetchTasks(apiParams);
        if (!mounted) return;

        setTasks(
          [...data].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );

        setStatus("success");
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setStatus("error");
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [apiParams, refreshKey]);

  async function confirmDelete(): Promise<void> {
    if (!taskToDelete) return;

    try {
      await deleteTask(taskToDelete.id);
      setTaskToDelete(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  function clearFilters(): void {
    setQuery("");
    setStatusFilter("all");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Task Manager
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            React (TypeScript) • SPA • URL state • json-server
          </p>
        </header>

        <section className="rounded-xl border bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold">Tasks</h2>
              <div className="text-sm text-gray-600">
                {status === "success" ? `${tasks.length} items` : ""}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-400 sm:w-64"
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "all" | TaskStatus)
                }
                className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-400"
              >
                <option value="all">All</option>
                <option value="todo">Todo</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium hover:bg-gray-50"
              >
                Clear
              </button>

              <Link
                to="/tasks/new"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-black px-4 text-sm font-medium text-white"
              >
                Add task
              </Link>
            </div>
          </div>

          <div className="p-4">
            {status === "loading" && (
              <p className="text-sm text-gray-700">Loading…</p>
            )}

            {status === "error" && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                Error: {error}
              </div>
            )}

            {status === "success" && tasks.length === 0 && (
              <p className="text-sm text-gray-700">No tasks.</p>
            )}

            {status === "success" && tasks.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase text-gray-500">
                    <tr className="border-b">
                      <th className="py-2 pr-4">Title</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Priority</th>
                      <th className="py-2 pr-4">Created</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tasks.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <td className="py-2 pr-4 font-medium text-gray-900">
                          {t.title}
                        </td>
                        <td className="py-2 pr-4 text-gray-700">{t.status}</td>
                        <td className="py-2 pr-4 text-gray-700">
                          {t.priority}
                        </td>
                        <td className="py-2 pr-4 text-gray-700">
                          {formatDate(t.createdAt)}
                        </td>

                        <td className="py-2 text-right">
                          <div className="inline-flex gap-2">
                            <Link
                              to={`/tasks/${t.id}/edit`}
                              className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-100"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              onClick={() => setTaskToDelete(t)}
                              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <ConfirmDialog
          open={taskToDelete !== null}
          title="Delete task"
          description={
            taskToDelete
              ? `Are you sure you want to delete "${taskToDelete.title}"?`
              : undefined
          }
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() => setTaskToDelete(null)}
          onConfirm={() => void confirmDelete()}
        />
      </div>
    </div>
  );
}
