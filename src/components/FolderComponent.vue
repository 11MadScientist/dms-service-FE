<template>
  <q-item>
    <q-item-section>
      <q-expansion-item
        :label="name"
        expand-separator
        switch-toggle-side
        @before-show="openFolder"
        @hide="closeFolder"
      >
        <template #header>
          <q-item class="header-wrapper">
            <img
              alt="File Icon"
              :src="folderImg"
              style="width: 30px; height: 30px"
            />
            <q-item-section class="label">
              {{ name }}
            </q-item-section>
          </q-item>
          <q-popup-proxy ref="folderMenu" context-menu>
            <q-list>
              <FolderMenuOptions :folderId="props.id" :url="props.url" />
            </q-list>
          </q-popup-proxy>
        </template>
        <q-list>
          <FolderComponent
            v-for="folder in folders"
            :key="folder.id"
            v-bind="folder"
          >
          </FolderComponent>

          <FileComponent v-for="file in files" :key="file.id" v-bind="file">
          </FileComponent>
        </q-list>
      </q-expansion-item>
    </q-item-section>
  </q-item>
</template>

<script setup>
import axios from "axios";
import { ref, computed } from "vue";
import { userInfoStore } from "stores/userinfo-store";
import FolderMenuOptions from "components/FolderMenuOptions.vue";
import FileComponent from "components/FileComponent.vue";
const userInfo = userInfoStore();

axios.defaults.headers.common["Authorization"] =
  "Bearer " + userInfo.userInfo.token;

const folders = ref([]);
const files = ref([]);
const folderImg = ref("src/assets/icons/svg/steins;gate_folder_close.svg");

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  mimeType: {
    type: String,
    required: false,
  },
  fileType: {
    type: String,
    required: false,
    default: "default",
  },
  parentId: {
    type: String,
    required: false,
  },
  size: {
    type: Number,
    required: false,
  },
  createDt: {
    type: String,
    required: false,
  },
  modifiedDt: {
    type: String,
    required: false,
  },
  url: {
    type: String,
  },
});

/**
 * action when folder is opened
 */
const openFolder = () => {
  getFileList(props.id, props.url);
  folderImg.value = "src/assets/icons/svg/steins;gate_folder_open.svg";
};

/**
 * action when folder is closed
 */
const closeFolder = () => {
  folderImg.value = "src/assets/icons/svg/steins;gate_folder_close.svg";
};

/**
 * request server for file list present inside the folder
 */
const getFileList = () => {
  axios
    .get(props.url + "getFileList", {
      params: {
        folderId: props.id,
      },
    })
    .then((response) => {
      folders.value = [];
      files.value = [];
      response.data.forEach((item) => {
        item.url = props.url;
        if (
          item.fileType !== null &&
          item.fileType.toUpperCase() === "FOLDER"
        ) {
          folders.value = [...folders.value, item];
        } else {
          files.value = [...files.value, item];
        }
      });
    })
    .catch((error) => {
      console.log(error);
      axios.get(props.url + "getRedirectURL").then((response) => {
        redirect(response.data);
      });
    });
};

/**
 * redirects the user to the google drive authorization request page
 * to authorize the app to access user's google drive data
 * @param {*} link
 */
const redirect = (link) => {
  window.location.href = link;
};
</script>
<style>
.q-item__section--side {
  display: none;
}

.header-wrapper {
  padding: 0px;
}

.label {
  margin-left: 4px;
  font-weight: 500;
}

.q-item {
  min-height: 30px !important;
}
</style>
