<template>
    <div class="logo">
        <img src="https://halcenter.la/assets/hal-e-commerce.bc6f2561.jpg" />
    </div>
      <a-menu v-model:selectedKeys="selectedKeys" class="sidebar-menu" mode="inline">
        <a-menu-item key="1" @click="handleMenuClick('customer')">
          <user-outlined />
          <span>Customer</span>
        </a-menu-item>
        <a-menu-item key="2" @click="handleMenuClick('CourseCategory')">
          <video-camera-outlined />
          <span>Course Categories</span>
        </a-menu-item>
        <a-menu-item key="3" @click="handleMenuClick('Course')">
          <upload-outlined />
          <span>Course</span>
        </a-menu-item>
        <a-sub-menu key="sub2">
          <template #title>
            <span>
              <team-outlined />
              <span>Team</span>
            </span>
          </template>
          <a-menu-item key="6">Team 1</a-menu-item>
          <a-menu-item key="8">Team 2</a-menu-item>
        </a-sub-menu>
      </a-menu>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import {
  UserOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  UploadOutlined
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

const selectedKeys = ref<string[]>([]);

const router = useRouter();

const handleMenuClick = (key: string) => {
  router.push({ name: key });
};

</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.8125rem 0.5rem 0.8125rem 1rem;
  width: 100%;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
  img {
    width: 4rem;
    height: 4rem;
    margin-right: 0.8rem;
    margin-left: 0.25rem;
    object-fit: contain;
    border-radius: 5px;
  }
}
</style>