import { Quasar } from "quasar";
import { markRaw } from "vue";
import RootComponent from "app/src/App.vue";

import createStore from "app/src/stores/index";
import createRouter from "app/src/router/index";
import { boot } from "quasar/wrappers";
import {
  userInfoStore,
  persistedStatePlugin,
} from "app/src/stores/userinfo-store";

export default boot(({ app, store }) => {
  app.use(store).use(persistedStatePlugin(userInfoStore(), "localUserInfo"));
});
