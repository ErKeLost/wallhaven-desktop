<script setup lang="ts">
const formData = reactive({
  username: "",
  password: "",
});
const form = ref(null);
</script>

<template>
  <div>
    <img class="w-10 h-10 object-cover" src="@/assets/images/logo.png" />
    Welcome Varlet UI Kit
    <var-form ref="form" scroll-to-error="start">
      <var-input
        variant="outlined"
        placeholder="请输入用户名"
        :rules="[(v) => !!v || '用户名不能为空']"
        v-model="formData.username"
      />
      <var-input
        type="password"
        variant="outlined"
        placeholder="请输入密码"
        :rules="[
          (v) => !!v || '密码不能为空',
          (v) => v.length >= 8 || '密码长度不能低于8位',
        ]"
        v-model="formData.password"
      />
    </var-form>
  </div>
</template>
