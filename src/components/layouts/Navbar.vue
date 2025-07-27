<template>
    <a-layout-header style="background: #fff">
      <menu-unfold-outlined
        v-if="collapsed"
        class="trigger"
        @click="onCollapsed"
        style="font-size: 20px; margin-left: -35px"
      />
      <menu-fold-outlined
        v-else
        class="trigger"
        @click="onCollapsed"
        style="margin-left: -35px; font-size: 20px"
      />
  
      <div class="header-action-container">
        <a-button @click="showConfirm" title="logout">Logout</a-button>
      </div>
    </a-layout-header>
  </template>
  
  <script lang="ts" setup>
  import { ref, h } from "vue";
  import { Modal } from 'ant-design-vue';
  import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    ExclamationCircleFilled,
  } from "@ant-design/icons-vue";

  const { confirm } = Modal;

  const handleOK = async () => {
    try {
      const token = localStorage.getItem('jwt');
      await fetch('/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      localStorage.removeItem('jwt');
      window.location.href = '/login'; // or your login route
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const showConfirm = () => {
    confirm({
      title: 'ເຈົ້າແນ່ໃຈບໍວ່າຕ້ອງການອອກຈາກລະບົບ?',
      icon: h(ExclamationCircleFilled),
      content: 'Are you sure you want to log out?',
      onOk: handleOK,
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const collapsed = ref<boolean>(false);
  const emit = defineEmits<{ (e: "toggleSidebar"): void }>();
  const onCollapsed = () => {
    collapsed.value = !collapsed.value;
    emit("toggleSidebar");
  };
  </script>
  
  <style lang="scss">
  .header-action-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
    margin-right: -25px;
    .navbar-btn {
      background-color: rgb(191, 219, 254);
      color: rgb(59, 130, 246);
      width: 32px;
      height: 32px;
      line-height: 32px;
      border-radius: 50% !important;
      padding-right: 0;
      padding-left: 0;
      text-align: center !important;
      :hover {
        cursor: pointer;
      }
    }
  }
  .ant-layout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
  }
  </style>
  