<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { CourseCategoryComposible } from './composible/index';
import { message } from 'ant-design-vue';
import type { IFormStateCategory } from "../interface/category.interface";
import type { ICategoryEntiry } from "../course-category/entiy/category.entity.ts";
import type { IData } from "../course-category/interface/data.interface.ts";


const { fetchAll, adminDeleteCourseCategory, adminUpdateCourseCategory, adminCreateCourseCategory } = CourseCategoryComposible();
const deleting = ref(false);

const open = ref(false);
const openCreate = ref(false);

const formState = reactive<IFormStateCategory>({
    id: 0,
    name: ''
});

const createFormState = reactive<IFormStateCategory>({
    name: ''
});

const handleOK = async () => {
    try {
        await adminUpdateCourseCategory(formState);
        message.success('Course category updated successfully');
        open.value = false;
        const response = await fetchAll();
        data.categories = response.data;
    } catch (err: any) {
        console.log(err);
        message.error('Failed to update course category');
    }
};

const handleCreate = async () => {
    try {
        await adminCreateCourseCategory(createFormState);
        message.success('Course category created successfully');
        openCreate.value = false;
        // Reset form
        createFormState.name = '';
        const response = await fetchAll();
        data.categories = response.data;
    } catch (err: any) {
        console.log(err);
        message.error('Failed to create course category');
    }
};

const openModalEdit = (value: ICategoryEntiry) => {
    formState.id = value.id;
    formState.name = value.name;
    open.value = true;
};

const openModalCreate = () => {
    createFormState.name = '';
    openCreate.value = true;
};
//
const data = reactive<IData>({
    categories: [],
    isLoading: false
});

const onDelete = async (id: number) => {
    try {
        await adminDeleteCourseCategory(id);
        message.success('course category deleted successfully');
        const response = await fetchAll();
        data.categories = response.data;
    } catch (error) {
        console.error(error);
        message.error('Failed to delete course category');
    }
};

onMounted(async () => {
    await fetchItems();
    
});

const fetchItems = async () => {
    data.isLoading = true;
    const response = await fetchAll();
    data.categories = response.data;
    data.isLoading = false;
}

const columns = [
    {
        title: 'No',
        dataIndex: 'id',
        key: 'no',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Action',
        key: 'action',
    },
];
</script>

<template>
    <div>
        <div class="parent">
        <h2>List of Course Categories</h2>
            <a-button type="primary" @click="openModalCreate">
                Add New Category
            </a-button>
        </div>
        
        <a-table :dataSource="data.categories" :columns="columns"  :loading="data.isLoading">
            <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'no'">
                   {{ index+1 }}
                </template>
                <template v-if="column.key === 'action'">
                    <span>
                        <a @click="openModalEdit(record)">Edit</a>
                        <a-divider type="vertical" />
                        <a-popconfirm
                            v-if="data.categories.length"
                            title="Sure to Delete?"
                            @confirm="onDelete(record.id)"
                        >
                            <a>Delete</a>
                        </a-popconfirm>
                    </span>
                </template>
            </template>
        </a-table>
        
        <!-- Modal Update -->
        <a-modal v-model:open="open" title="Edit Course Category" @ok="handleOK">
            <a-form
                :model="formState"
                :label-col="{ span: 24 }"
                :wrapper-col="{ span: 24 }"
            >
                <a-form-item
                    label="Category Name"
                    name="name"
                    :rules="[{ required: true, message: 'Please enter category name' }]"
                >
                    <a-input v-model:value="formState.name" placeholder="Enter category name" />
                </a-form-item>
            </a-form>
        </a-modal>
        
        <!-- Modal Create -->
        <a-modal v-model:open="openCreate" title="Create Category" @ok="handleCreate">
            <a-form
                :model="createFormState"
                :label-col="{ span: 24 }"
                :wrapper-col="{ span: 24 }"
            >
                <a-form-item
                    label="Category Name"
                    name="name"
                    :rules="[{ required: true, message: 'Please enter category name' }]"
                >
                    <a-input v-model:value="createFormState.name" placeholder="Enter category name" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<style lang="scss" scoped>
.parent{
    display: flex;
    justify-content: space-between;
    padding: 20px;
}


</style>