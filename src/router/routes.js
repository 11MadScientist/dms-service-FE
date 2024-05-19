const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/login", component: () => import("pages/LoginPage.vue") },
      { path: "/dashboard", component: () => import("pages/IndexPage.vue") },
      { path: "/gdrive", component: () => import("pages/GoogleDrive.vue") },
      {
        path: "/gdrive/oauth",
        component: () => import("src/callbacks/GoogleDriveCallback.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
