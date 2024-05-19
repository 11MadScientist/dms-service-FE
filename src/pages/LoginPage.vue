<template lang="">
  <div>
    <q-page class="flex flex-center">
      <q-card class="login-card">
        <q-card-section>
          <q-input
            class="center"
            for="username"
            color="white"
            :input-style="{ color: 'white' }"
            label-color="white"
            v-model="loginCredentials.username"
            label="Username"
          ></q-input>
          <q-input
            class="center"
            type="password"
            for="password"
            color="white"
            :input-style="{ color: 'white' }"
            label-color="white"
            v-model="loginCredentials.password"
            label="Password"
          ></q-input>
        </q-card-section>

        <q-separator dark />

        <q-card-actions>
          <q-btn @click="login" class="center" size="md" outline>Login </q-btn>
        </q-card-actions>
      </q-card>
    </q-page>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { userInfoStore } from "stores/userinfo-store";
import { useRouter } from "vue-router";

const userInfo = userInfoStore();
const router = useRouter();
const loginCredentials = ref({
  username: "",
  password: "",
});

onMounted(() => {
  if (userInfo.isLoggedIn) {
    console.log(userInfo.userInfo);
    router.push("/dashboard");
  }
});

function login() {
  axios
    .post("http://localhost:8080/api/login", loginCredentials.value)
    .then((response) => {
      userInfo.login(response);
      router.push("/dashboard");
    })
    .catch((error) => {
      console.log(error);
    });
}
</script>

<style lang="css">
.login-card {
  background-color: #272822;
  color: #ffffff;
  width: 80%;
  max-width: 350px;
  padding-bottom: 10px;
}

.center {
  width: 90%;
  margin: auto;
  text-color: #ffffff;
}
</style>
