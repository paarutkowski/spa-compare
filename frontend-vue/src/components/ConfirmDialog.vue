<script setup lang="ts">
type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

const props = withDefaults(defineProps<Props>(), {
  confirmText: "Delete",
  cancelText: "Cancel",
});

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();
</script>

<template>
  <div
    v-if="props.open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  >
    <div class="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
      <h3 class="text-lg font-semibold">{{ props.title }}</h3>

      <p v-if="props.description" class="mt-2 text-sm text-gray-600">
        {{ props.description }}
      </p>

      <div class="mt-6 flex justify-end gap-2">
        <button
          type="button"
          class="rounded-lg border px-4 py-2 text-sm"
          @click="emit('cancel')"
        >
          {{ props.cancelText }}
        </button>

        <button
          type="button"
          class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
          @click="emit('confirm')"
        >
          {{ props.confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>
