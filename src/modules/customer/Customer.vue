<template>
    <div class="customer-container">
        <p class="title">Customer Management</p>
    </div>
  <a-table :columns="columns" :data-source="data.customers" :pagination="data.pagination" @change="handleTableChange">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined />
          Name
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.name }}
        </a>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a @click="showModalEdit(record)">Edit</a>
          <a-divider type="vertical" />
          <a-popconfirm
            v-if="data.customers.length"
            title="Sure to delete?"
            @confirm="onDelete(record.id)"
          >
            <a>Delete</a>
          </a-popconfirm>
        </span>
      </template>
    </template>
  </a-table>

  <!-- Modal Edit -->
  <div>
    <a-modal v-model:open="open" title="Basic Modal" @ok="handleSubmit">
       <a-form
        ref="formRef"
        :model="formState"
        name="basic"     
        :label-col="{ span: 24 }"   
        :wrapper-col="{ span: 24 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        class="login-form"
      >
        <a-form-item
          label="ຊື່ຜູ້ໃຊ້"
          name="username"
          :rules="[
            { required: true, message: 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ກ່ອນ...' }
          ]"
        >
          <a-input v-model:value="formState.username" placeholder="ຊື່ຜູ້ໃຊ້..." size="large">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="ນາມສະກູນ"
          name="surname"
          :rules="[
            { required: true, message: 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ກ່ອນ...' }
          ]"
        >
          <a-input v-model:value="formState.surname" placeholder="ຊື່ຜູ້ໃຊ້..." size="large">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="ທີ່ຢູ່"
          name="address"
          :rules="[
            { required: true, message: 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ກ່ອນ...' }
          ]"
        >
          <a-input v-model:value="formState.address" placeholder="ຊື່ຜູ້ໃຊ້..." size="large">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

         <a-form-item
          label="ອີເມວ"
          name="email"
          :rules="[
            { required: true, message: 'ກະລຸນາປ້ອນອີເມວກ່ອນ...' }
          ]"
        >
          <a-input v-model:value="formState.email" placeholder="ອີເມວ..." size="large">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="ວັນ ເດືອນ ປີເກີດ"
          name="birth_date"
          :rules="[
            { required: true, message: 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ກ່ອນ...' }
          ]"
        >
            <a-date-picker v-model:value="formState.birth_date" placeholder="ຊື່ຜູ້ໃຊ້..." size="large">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
            </a-date-picker>
        </a-form-item>

        <a-form-item
          label="ເພດ"
          name="gender"
          :rules="[
            { required: true, message: 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ກ່ອນ...' }
          ]"
        >
            <a-radio-group v-model:value="formState.gender">
              <a-radio-button value="female">ຍີງ</a-radio-button>
              <a-radio-button value="male">ຊາຍ</a-radio-button>
            </a-radio-group>
        </a-form-item>

      </a-form>
    </a-modal>
  </div>
  <!-- End -->
</template>
<script lang="ts" setup>
import { SmileOutlined } from '@ant-design/icons-vue';
import { onMounted, reactive, ref } from 'vue';
import apiClient from '../../common/configuration/axios.config';
import type { TablePaginationConfig } from 'ant-design-vue';
import type { ICustomer } from './interface/customer.interface';
import { message } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import { useRegister } from './composible/register.ts';
import type { FormInstance } from 'ant-design-vue';

const { adminUpdateProfile, adminDeleteCustomer } = useRegister();

const formRef = ref<FormInstance | null>(null);

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    // If validation passes, trigger onFinish with formState
    onFinish({ ...formState });
    open.value = false;
  } catch (error) {
    // Validation failed
    onFinishFailed(error);
  }
};

interface FormState {
  id: number,
  email: string;
  surname: string;
  username: string;
  address: string;
  birth_date: dayjs.Dayjs | null; 
  gender: string;
}

const formState = reactive<FormState>({
  id: 0,
  email: '',
  surname: '',
  username: '',
  address: '',
  birth_date: null,
  gender: ''
});

const onFinish = async (values: any) => {
  await adminUpdateProfile(values);
}

const onFinishFailed = (err: any) => {
  console.log('err: ', err)
}

const open = ref(false)

const showModalEdit = (value: any) => {
  formState.username = value.name;
  formState.surname = value.surname;
  formState.address = value.address;
  formState.birth_date = value.birth_date ? dayjs(value.birth_date) : null; 
  formState.gender = value.gender;
  formState.email = value.user.email;
  formState.id = value.id;
  open.value = true;
}

/** Delete */
const onDelete = async (id: number) => {
  try {
    await adminDeleteCustomer(id)
    message.success('Customer deleted successfully');
    await fetchCustomers(data.pagination.current, data.pagination.pageSize);
  } catch (error) {
    console.error(error);
    message.error('Failed to delete customer');
  }
};

const columns = [
  {
    name: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Surname',
    dataIndex: 'surname',
    key: 'surname',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Birth Date',
    key: 'birth_date',
    dataIndex: 'birth_date',
  },
  {
    title: 'Gender',
    key: 'gender',
    dataIndex: 'gender',
  },
  {
    title: 'Email',
    key: 'gender',
    customRender: ({ record }: { record: any }) => record.user?.email || '-',
  },
  {
    title: 'Action',
    key: 'action',
  },
];

const data = reactive<ICustomer>({
  customers: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
  }
})

const handleTableChange = (pagination: TablePaginationConfig) => {
  fetchCustomers(pagination.current ?? 1, pagination.pageSize ?? 10);
};

const fetchCustomers = async (page: number, limit: number) => {
  try {
    const response = await apiClient.get('students', {
      params: {
        page,
        limit,
      },
    });
    data.customers = response.data.data;

    // Set Pagination
    const pagination = response.data.pagination;
    data.pagination = {
      current: pagination.currentPage,
      pageSize: pagination.limit,
      total: pagination.total,
      showSizeChanger: true,
    };
    console.log(data.pagination);
  } catch (err: any) {
    console.log(err)
  }
}

onMounted(async () => {
  await fetchCustomers(data.pagination.current, data.pagination.pageSize);
})
</script>

<style lang="scss" scoped>
.customer-container {
  padding: 10px;
  margin-bottom: 10px;
  .title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }
}
</style>

