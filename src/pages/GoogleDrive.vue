<template lang="">
  <div class="dms-header-wrapper">
    <img
      alt="Google Drive Icon"
      src="src/assets/icons/svg/gdrive.svg"
      style="width: 30px; height: 30px"
    />
    <h5>Google Drive Data Management System</h5>
  </div>
  <q-list>
    <FolderComponent
      v-for="folder in primaryFolders"
      :key="folder.id"
      v-bind="folder"
    />
  </q-list>
</template>

<script setup>
import { onMounted, ref } from "vue";
import FolderComponent from "components/FolderComponent.vue";
import axios from "axios";
import { userInfoStore } from "stores/userinfo-store";

const userInfo = userInfoStore();
axios.defaults.headers.common["Authorization"] =
  "Bearer " + userInfo.userInfo.token;

const primaryFolders = ref({});
const url = ref("http://localhost:8080/api/gdrive/");

onMounted(() => {
  getFileList();
});

/**
 * request server to get initial files
 */
const getFileList = () => {
  axios
    .get(url.value + "getFileList")
    .then((response) => {
      response.data.forEach((resp) => {
        resp.url = url.value;
      });
      primaryFolders.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      axios.get(url.value + "getRedirectURL").then((response) => {
        redirect(response.data);
      });
    });
};

const redirect = (link) => {
  window.location.href = link;
};
</script>
<style>
.q-item {
  min-height: 30px !important;
}

.dms-header-wrapper {
  background-color: #272822;
  color: #ffffff;
  align-content: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}
</style>
