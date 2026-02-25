<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Task, TaskStatus } from "../types/task";
import { deleteTask, fetchTasks } from "../api/tasksApi";
import { formatDate } from "../utils/formatDate";
import ConfirmDialog from "../components/ConfirmDialog.vue";

type LoadStatus = "idle" | "loading" | "success" | "error";

function normalizeStatus(value: unknown): "all" | TaskStatus {
  return value === "todo" || value === "in_progress" || value === "done"
    ? value
    : "all";
}

const route = useRoute();
const router = useRouter();

const tasks = ref<Task[]>([]);
const status = ref<LoadStatus>("idle");
const error = ref("");

const taskToDelete = ref<Task | null>(null);

const query = ref(typeof route.query.q === "string" ? route.query.q : "");
const debouncedQuery = ref(query.value);
const statusFilter = ref<"all" | TaskStatus>(
  normalizeStatus(route.query.status),
);

const refreshKey = ref(0);

let debounceId: number | null = null;

watch(
  () => route.query,
  (q) => {
    const nextQ = typeof q.q === "string" ? q.q : "";
    const nextStatus = normalizeStatus(q.status);

    query.value = nextQ;
    debouncedQuery.value = nextQ;
    statusFilter.value = nextStatus;
  },
);

watch(
  () => query.value,
  (val) => {
    if (debounceId) window.clearTimeout(debounceId);
    debounceId = window.setTimeout(() => {
      debouncedQuery.value = val.trim();
    }, 300);
  },
);

watch([() => debouncedQuery.value, () => statusFilter.value], ([q, s]) => {
  const nextQuery: Record<string, string> = {};

  if (q) nextQuery.q = q;
  if (s !== "all") nextQuery.status = s;

  router.replace({ path: "/tasks", query: nextQuery }).catch(() => {});
});

const apiParams = computed(() => ({
  q: debouncedQuery.value || undefined,
  status: statusFilter.value,
}));

async function load(): Promise<void> {
  status.value = "loading";
  error.value = "";

  try {
    const data = await fetchTasks(apiParams.value);

    tasks.value = [...data].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    status.value = "success";
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Unknown error";
    status.value = "error";
  }
}

onMounted(load);

watch([apiParams, () => refreshKey.value], load);

function clearFilters(): void {
  query.value = "";
  statusFilter.value = "all";
}

async function confirmDelete(): Promise<void> {
  if (!taskToDelete.value) return;

  try {
    await deleteTask(taskToDelete.value.id);
    taskToDelete.value = null;
    refreshKey.value += 1;
  } catch (e) {
    alert(e instanceof Error ? e.message : "Delete failed");
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-6xl p-6">
      <header class="mb-6">
        <h1 class="text-2xl font-semibold tracking-tight">Task Manager</h1>
        <p class="mt-1 text-sm text-gray-600">
          Vue 3 (TypeScript) • SPA • URL state • json-server
        </p>
      </header>

      <section class="rounded-xl border bg-white shadow-sm">
        <div
          class="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 class="text-base font-semibold">Tasks</h2>
            <div class="text-sm text-gray-600">
              <span v-if="status === 'success'">{{ tasks.length }} items</span>
            </div>
          </div>

          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              v-model="query"
              placeholder="Search…"
              class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-400 sm:w-64"
            />

            <select
              v-model="statusFilter"
              class="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-400"
            >
              <option value="all">All</option>
              <option value="todo">Todo</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>

            <button
              type="button"
              class="inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium hover:bg-gray-50"
              @click="clearFilters"
            >
              Clear
            </button>

            <router-link
              to="/tasks/new"
              class="inline-flex h-10 items-center justify-center rounded-lg bg-black px-4 text-sm font-medium text-white"
            >
              Add task
            </router-link>
          </div>
        </div>

        <div class="p-4">
          <p v-if="status === 'loading'" class="text-sm text-gray-700">
            Loading…
          </p>

          <div
            v-else-if="status === 'error'"
            class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            Error: {{ error }}
          </div>

          <p
            v-else-if="status === 'success' && tasks.length === 0"
            class="text-sm text-gray-700"
          >
            No tasks.
          </p>

          <div
            v-else-if="status === 'success' && tasks.length > 0"
            class="overflow-x-auto"
          >
            <table class="w-full text-left text-sm">
              <thead class="text-xs uppercase text-gray-500">
                <tr class="border-b">
                  <th class="py-2 pr-4">Title</th>
                  <th class="py-2 pr-4">Status</th>
                  <th class="py-2 pr-4">Priority</th>
                  <th class="py-2 pr-4">Created</th>
                  <th class="py-2 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="t in tasks"
                  :key="t.id"
                  class="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td class="py-2 pr-4 font-medium text-gray-900">
                    {{ t.title }}
                  </td>
                  <td class="py-2 pr-4 text-gray-700">{{ t.status }}</td>
                  <td class="py-2 pr-4 text-gray-700">{{ t.priority }}</td>
                  <td class="py-2 pr-4 text-gray-700">
                    {{ formatDate(t.createdAt) }}
                  </td>

                  <td class="py-2 text-right">
                    <div class="inline-flex gap-2">
                      <router-link
                        :to="`/tasks/${t.id}/edit`"
                        class="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-100"
                      >
                        Edit
                      </router-link>

                      <button
                        type="button"
                        class="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                        @click="taskToDelete = t"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ConfirmDialog
        :open="taskToDelete !== null"
        title="Delete task"
        :description="
          taskToDelete
            ? `Are you sure you want to delete &quot;${taskToDelete.title}&quot;?`
            : undefined
        "
        confirm-text="Delete"
        cancel-text="Cancel"
        @cancel="taskToDelete = null"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>
