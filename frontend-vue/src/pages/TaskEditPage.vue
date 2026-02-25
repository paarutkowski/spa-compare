<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Task, TaskPriority, TaskStatus } from "../types/task";
import { fetchTask, updateTask } from "../api/tasksApi";

type LoadStatus = "loading" | "success" | "error";
type SaveStatus = "idle" | "saving" | "error";

const route = useRoute();
const router = useRouter();

const id = computed(() =>
  typeof route.params.id === "string" ? route.params.id : "",
);

const task = ref<Task | null>(null);

const loadStatus = ref<LoadStatus>("loading");
const loadError = ref("");

const saveStatus = ref<SaveStatus>("idle");
const saveError = ref("");

const title = ref("");
const status = ref<TaskStatus>("todo");
const priority = ref<TaskPriority>("medium");

const validationError = computed(() => {
  const t = title.value.trim();
  if (!t) return "Title is required.";
  if (t.length < 3) return "Title must be at least 3 characters.";
  return "";
});

async function load(): Promise<void> {
  loadStatus.value = "loading";
  loadError.value = "";

  try {
    if (!id.value) throw new Error("Invalid task id");

    const data = await fetchTask(id.value);
    task.value = data;

    title.value = data.title ?? "";
    status.value = data.status ?? "todo";
    priority.value = data.priority ?? "medium";

    loadStatus.value = "success";
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : "Unknown error";
    loadStatus.value = "error";
  }
}

onMounted(load);

async function handleSubmit(): Promise<void> {
  saveError.value = "";

  if (validationError.value) {
    saveStatus.value = "error";
    saveError.value = validationError.value;
    return;
  }

  if (!task.value) return;

  saveStatus.value = "saving";

  try {
    const payload: Task = {
      ...task.value,
      title: title.value.trim(),
      status: status.value,
      priority: priority.value,
    };

    await updateTask(task.value.id, payload);
    router.push("/tasks");
  } catch (e) {
    saveStatus.value = "error";
    saveError.value = e instanceof Error ? e.message : "Unknown error";
  } finally {
    saveStatus.value = "idle";
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-xl p-6">
      <h1 class="mb-4 text-2xl font-semibold">Edit task</h1>

      <p v-if="loadStatus === 'loading'" class="text-sm text-gray-700">
        Loading…
      </p>

      <div
        v-else-if="loadStatus === 'error'"
        class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
      >
        {{ loadError }}
        <button
          type="button"
          class="mt-4 rounded-lg border px-4 py-2 text-sm"
          @click="router.push('/tasks')"
        >
          Back
        </button>
      </div>

      <form
        v-else
        class="space-y-4 rounded-xl border bg-white p-6 shadow-sm"
        @submit.prevent="handleSubmit"
      >
        <div
          v-if="saveError"
          class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {{ saveError }}
        </div>

        <div>
          <label class="block text-sm font-medium">Title</label>
          <input
            v-model="title"
            class="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
          <p class="mt-1 text-xs text-gray-500">Min. 3 characters.</p>
        </div>

        <div>
          <label class="block text-sm font-medium">Status</label>
          <select
            v-model="status"
            class="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium">Priority</label>
          <select
            v-model="priority"
            class="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div class="flex gap-2">
          <button
            type="submit"
            :disabled="saveStatus === 'saving'"
            class="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {{ saveStatus === "saving" ? "Saving…" : "Save" }}
          </button>

          <button
            type="button"
            class="rounded-lg border px-4 py-2 text-sm"
            @click="router.push('/tasks')"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
