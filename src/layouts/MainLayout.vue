<template>
  <q-layout view="lHh lpR lFf">
    <q-header
      v-show="userInfo.isLoggedIn"
      elevated
      class="bg-primary text-white"
      height-hint="98"
    >
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img
              @click="ping"
              src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg"
            />
          </q-avatar>
          DMS Service Repository
        </q-toolbar-title>

        <q-btn dense flat round icon="logout" @click="logout" />
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab
          v-for="dmsProf in dmsProfiles"
          :key="dmsProf.code"
          v-bind="dmsProf"
        />
      </q-tabs>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer
      v-show="userInfo.isLoggedIn"
      elevated
      class="bg-grey-8 text-white"
    >
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          <div>Title</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { userInfoStore } from "stores/userinfo-store";
import { useRouter } from "vue-router";
import axios from "axios";

const userInfo = userInfoStore();
const router = useRouter();

const dmsProfiles = [
  {
    code: "GD",
    label: "Google Drive",
    to: "/gdrive",
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logout() {
  // axios
  //   .post("http://localhost:8080/api/logout")
  //   .then((response) => {
  //     userInfo.logout();
  //     router.push("/login");
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  userInfo.logout();
  router.push("/login");
}

function ping() {
  axios
    .get("http://localhost:8080/api/user")
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
</script>
