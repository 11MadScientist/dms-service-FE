<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { userInfoStore } from "stores/userinfo-store";

const userInfo = userInfoStore();
const router = useRouter();
axios.defaults.headers.common["Authorization"] =
  "Bearer " + userInfo.userInfo.token;

onMounted(() => {
  const authCode = router.currentRoute.value.query.code;
  console.log(authCode);
  auth(authCode);
});

function auth(code) {
  axios
    .get("http://localhost:8080/oauth", {
      params: { code: code },
    })
    .then((response) => {
      console.log(response);
      router.push("/gdrive");
    });
}
</script>
