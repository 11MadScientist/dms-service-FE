<template>
  <q-item>
    <q-item-section label="name" @click="downloadFile">
      <div class="file-section">
        <div class="file-icon">
          <img
            alt="File Icon"
            :src="getFileIcon(fileType)"
            style="width: 30px; height: 30px"
          />
        </div>
        <div class="file-name">
          {{ name }}
        </div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup>
import axios from "axios";
import { userInfoStore } from "stores/userinfo-store";
const userInfo = userInfoStore();
const fileIcons = {
  DOCX: "src/assets/icons/svg/document.svg",
  XLSX: "src/assets/icons/svg/excel.svg",
  PPTX: "src/assets/icons/svg/powerpoint.svg",
  PDF: "src/assets/icons/svg/pdf.svg",
  DEFAULT: "src/assets/icons/svg/default.svg",
  PNG: "src/assets/icons/svg/picture.svg",
  JPEG: "src/assets/icons/svg/picture.svg",
  JPG: "src/assets/icons/svg/picture.svg",
  GIF: "src/assets/icons/svg/picture.svg",
  MP4: "src/assets/icons/svg/video.svg",
};

axios.defaults.headers.common["Authorization"] =
  "Bearer " + userInfo.userInfo.token;

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: false,
  },
  fileType: {
    type: String,
    required: false,
    default: "DEFAULT",
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
 * Provides the icon path depending on the filetype
 * @param {*} fileType
 */
const getFileIcon = (fileType) => {
  if (null !== fileType) {
    let iconPath = fileIcons[fileType.toUpperCase()];

    if (null !== iconPath) {
      return iconPath;
    }
  }
  return fileIcons["DEFAULT"];
};

/**
 * sends request to the server to download the file
 */
const downloadFile = () => {
  console.log(JSON.stringify(props));
  axios
    .post(props.url + "downloadFile", JSON.stringify(props), {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "blob",
    })
    .then((response) => {
      console.log(response);
      console.log("Download Starting");
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", props.name);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>

<style>
.file-section {
  margin-left: 14px;
  display: flex;
  align-items: center;
}

.file-icon {
  margin-top: 4px;
}

.file-name {
  margin-left: 4px;
}

.q-item {
  min-height: 30px !important;
}
</style>
