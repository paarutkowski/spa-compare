<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import type { TaskPriority, TaskStatus } from "../types/task";
import { createTask } from "../api/tasksApi";

const router = useRouter();

const title = ref("");
const status = ref<TaskStatus>("todo");
const priority = ref<TaskPriority>("medium");

const isSaving = ref(false);
const error = ref("");

const validationError = computed(() => {
  const t = title.value.trim();
  if (!t) return "Title is required.";
  if (t.length < 3) return "Title must be at least 3 characters.";
  return "";
});

async function handleSubmit(): Promise<void> {
  error.value = "";

  if (validationError.value) {
    error.value = validationError.value;
    return;
  }

  isSaving.value = true;

  try {
    await createTask({
      title: title.value.trim(),
      status: status.value,
      priority: priority.value,
      createdAt: new Date().toISOString(),
    });

    router.push("/tasks");
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Unknown error";
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-xl p-6">
      <h1 class="mb-4 text-2xl font-semibold">New task</h1>

      <form
        class="space-y-4 rounded-xl border bg-white p-6 shadow-sm"
        @submit.prevent="handleSubmit"
      >
        <div
          v-if="error"
          class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {{ error }}
        </div>

        <div>
          <label class="block text-sm font-medium">Title</label>
          <input
            v-model="title"
            class="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="e.g. Implement URL filters"
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
            :disabled="isSaving"
            class="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {{ isSaving ? "Saving…" : "Save" }}
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
