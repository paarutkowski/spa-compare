import { createRouter, createWebHistory } from "vue-router";
import TasksPage from "../pages/TasksPage.vue";
import TaskCreatePage from "../pages/TaskCreatePage.vue";
import TaskEditPage from "../pages/TaskEditPage.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/tasks" },
    { path: "/tasks", component: TasksPage },
    { path: "/tasks/new", component: TaskCreatePage },
    { path: "/tasks/:id/edit", component: TaskEditPage, props: true },
  ],
});
