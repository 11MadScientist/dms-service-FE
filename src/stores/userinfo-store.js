import { defineStore } from "pinia";
import createPersistedStatePlugin from "./persisted-state-plugin";

export const userInfoStore = defineStore("userInfo", {
  state: () => ({
    isLoggedIn: false,
    userInfo: {},
  }),

  actions: {
    login(resp) {
      this.isLoggedIn = true;
      this.userInfo = resp.data;
    },

    logout() {
      this.userInfo = {};
      this.isLoggedIn = false;
    },
  },
});

export const persistedStatePlugin = createPersistedStatePlugin;
