<template>
  <q-list>
    <!-- Create Folder Option (input name of folder to be created) -->
    <q-item clickable>
      <q-popup-proxy
        class="option-wrapper"
        transition-show="flip-down"
        transition-hide="flip-up"
        ref="createFolderPopup"
      >
        <q-item-section class="create-folder-wrapper">
          <div class="create-folder-header">
            <h5>Create Folder</h5>
          </div>
          <q-input
            class="input-folder-name"
            v-model="folderName"
            label="Folder Name"
            for="folderName"
            clearable
            :debounce="2000"
            :loading="isBtnCreateLoading"
            :rules="[isEmpty, checkFolderName, isFolderNameDuplicate]"
            ref="createFolderInput"
          />
          <q-btn
            class="btn-create"
            :disable="isBtnCreateDisabled"
            @click="createFolder"
            >Create</q-btn
          >
        </q-item-section>
      </q-popup-proxy>
      <q-item-section> {{ options[0].optionName }} </q-item-section>
    </q-item>

    <!-- Upload File Option (have q-uploader as popup) -->
    <q-item clickable>
      <q-popup-proxy
        class="option-wrapper"
        transition-show="flip-down"
        transition-hide="flip-up"
        ref="uploadFilePopup"
      >
        <q-uploader
          :url="getUrl"
          method="POST"
          field-name="files"
          color="#272822"
          text-color="#ffffff"
          :form-fields="[{ name: 'parentId', value: folderId }]"
          :headers="[
            {
              name: 'Authorization',
              value: 'Bearer ' + userInfo.userInfo.token,
            },
          ]"
          @uploaded="onFileUpload"
        />
      </q-popup-proxy>
      <q-item-section>{{ options[1].optionName }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { ref, watch } from "vue";
import { userInfoStore } from "stores/userinfo-store";
import axios from "axios";
const userInfo = userInfoStore();
axios.defaults.headers.common["Authorization"] =
  "Bearer " + userInfo.userInfo.token;

const props = defineProps({
  folderId: String,
  url: String,
});
const options = ref([
  {
    optionId: 1,
    optionName: "Create Folder",
  },
  {
    optionId: 2,
    optionName: "Upload File",
  },
]);

const uploadFilePopup = ref(null);
const folderName = ref("");
const folderNames = ref([]);
const createFolderInput = ref(null);
const createFolderPopup = ref(null);
const isBtnCreateDisabled = ref(true);
const isBtnCreateLoading = ref(false);

/**
 * provides the url to be used in uploading the file
 */
const getUrl = () => {
  return props.url + "uploadFile";
};

/**###################
 * ### File Upload ###
 * ###################
 */
const onFileUpload = () => {
  uploadFilePopup.value.hide();
};

/**#######################
 * ### Folder Creation ###
 * #######################
 */

/**
 * checks if foldername complies to rules
 */

watch(
  () => createFolderInput.value?.hasError,
  (newValue, oldValue) => {
    isBtnCreateLoading.value = true;
    console.log("create folder input error:", newValue);
    if (newValue) {
      isBtnCreateDisabled.value = true;
      isBtnCreateLoading.value = false;
      return;
    }

    isBtnCreateDisabled.value = false;
    isBtnCreateLoading.value = false;
  }
);

const isEmpty = () => {
  return !!folderName.value || "Field is required";
};

/**
 * checks if foldername passes as a folder name
 */
const checkFolderName = () => {
  const regex = /^(?!.*[/\\:*?"<>|`])[^\\s].{0,254}$/;
  return regex.test(folderName.value) || "Invalid Folder Name";
};

/**
 * manages the folder names, this should be set to empty
 * every 2 minutes, so the list will be updated.
 * @param {folder names} value
 */
const populateFolderNames = (value) => {
  folderNames.value = value;
  setTimeout(() => {
    folderNames.value = [];
  }, 120000);
};

/**
 * gets the folderNames and check if folderame is already taken
 */
const isFolderNameDuplicate = () => {
  console.log("folderduplicatefunction");
  if (!!folderNames.value) {
    axios
      .get(props.url + "getFolderNames", {
        params: {
          folderId: props.folderId,
          folderName: folderName.value,
        },
      })
      .then((response) => {
        console.log(response);
        populateFolderNames(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return !folderNames.value.includes(folderName.value) || "Duplicate File Name";
};

/**
 * creates the folder
 */
const createFolder = () => {
  console.log("hello");
  const url = "http://localhost:8080/api/gdrive/";
  axios
    .get(url + "createFolder", {
      params: {
        folderId: props.folderId,
        folderName: folderName.value,
      },
    })
    .then((response) => {
      console.log(response);
      populateFolderNames([]);
      createFolderPopup.value.hide();
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>

<style>
.option-wrapper {
  min-width: 400px;
  min-height: 200px;
}

.q-uploader {
  min-width: 100%;
  min-height: 200px;
}

.create-folder-wrapper {
  min-width: 100%;
  min-height: 200px;
  display: flex;
  justify-content: flex-end;
}

.create-folder-header {
  background-color: #272822;
  color: #ffffff;
  align-content: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

.create-folder-header h5 {
  margin-top: 0px;
  margin-bottom: 0px;
}

.input-folder-name {
  background-color: #ffffff;
  margin-bottom: 20px;
  margin-left: 20px;
  margin-right: 20px;
}

.btn-create {
  background-color: #ffffff;
  margin-bottom: 20px;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
