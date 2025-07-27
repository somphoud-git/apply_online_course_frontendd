<template>
  <a-form
    :model="formState"
    name="basic"     
    :label-col="{ span: 24 }"   
    :wrapper-col="{ span: 24 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
    class="login-form"
  >
    <h2>ຍີນດີຕ້ອນຮັບ ເຂົ້າສູ່ລະບົບ</h2>

    <a-form-item
      label="Email"
      name="email"
      :rules="[
        { required: true, message: 'Please input your email!' }, 
        { type: 'email', message: 'The input is not a valid email!' }
      ]"
    >
      <a-input v-model:value="formState.email" size="large">
        <template #prefix>
          <UserOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
    >
        <a-input-password v-model:value="formState.password" size="large">
            <template #prefix>
               <LockOutlined class="site-form-item-icon" />
            </template>
        </a-input-password>
    </a-form-item>

    <a-form-item>
        <a-button type="primary" html-type="submit" block size="large" style="margin-top: 10px;">
            Submit
        </a-button>
    </a-form-item>

    <p v-if="Error" style="color: red">{{ Error }}</p>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
// import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuth } from './composible/auth.ts'

const router = useRouter();
const { login } = useAuth()

interface FormState {
  email: string;
  password: string;
}

const formState = reactive<FormState>({
  email: '',
  password: '',
});

const onFinish = async (values: any) => {
  await login(values.email, values.password)
    .then(() => {
      router.push({ name: "customer" });
    })
    .catch((error) => {
      console.error('Login failed:', error);
    });
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};


</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #e7e4e4;
  border-radius: 8px;
}
</style>
