<script setup lang="ts">
import { reactive, ref, onMounted, h } from 'vue'
import { message } from 'ant-design-vue'
import { useCourse } from '../course/composible/index'
import type { ICourseEntity } from '../course/entity/course.entity'
import dayjs from 'dayjs'
const {
  fetchItems: fetchItemsFromComposable,
  getAllTeachers,
  getAllCategories,
  createNewCourse,
  updateStatusChange,
  deleteCourse,
  useCourseStore,
} = useCourse()

// ——— Reactive State ———
const data = reactive({
  courses: [] as ICourseEntity[],
  teachers: [] as { value: number; label: string }[],
  categories: [] as { value: number; label: string }[],
  isLoading: false,
})
const isOpenModalAdd = ref(false)
const formState = reactive({
  teacher_id: null as number | null,
  category_id: null as number | null,
  title: '',
  max_students: null as number | null,
  duration_hours: null as number | null,
  price: null as number | null,
  registration_start_date: null as string | null,
  registration_end_date: null as string | null,
  start_date: null as string | null,
  end_date: null as string | null,
  description: '',
})

// ——— loadcourse ———
async function loadCourses() {
  data.isLoading = true
  try {
    const resp = await fetchItemsFromComposable()
    data.courses = resp.data
  } catch (err) {
    console.error(err)
    message.error('Failed to load courses')
  } finally {
    data.isLoading = false
  }
}

async function loadLists() {
  try {
    const tResp = await getAllTeachers()
    data.teachers = tResp.data.map((t: any) => ({ value: t.id, label: t.user.username || 'Unknown' }))
    const cResp = await getAllCategories()
    data.categories = cResp.data.map((c: any) => ({ value: c.id, label: c.name || 'Unknown' }))
  } catch (err) {
    console.error(err)
    message.error('Failed to load dropdown lists')
  }
}

// ——— Delete (fixed) ———
async function onDelete(id: number) {
  try {
    await deleteCourse(id)
    // reload the courses after delete
    await loadCourses()
    message.success('Course deleted successfully')
  } catch (error) {
    console.error('Error deleting course:', error)
    message.error('Failed to delete course')
  }
}
// ——— Lifecycle ———
onMounted(async () => {
  await loadCourses()
  await loadLists()
})

// ——— Actions ———
function openModalAdd() {
  Object.assign(formState, {
    teacher_id: null,
    category_id: null,
    title: '',
    max_students: null,
    duration_hours: null,
    price: null,
    registration_start_date: null,
    registration_end_date: null,
    start_date: null,
    end_date: null,
    description: '',
  })
  isOpenModalAdd.value = true
}

//formstate edit
const formStateEdit = reactive({
        id: 0,
        teacher_id: '',
        category_id: '',
        title: '',
        max_students: 0,
        duration_hours: 0,
        price: 0,
        registration_start_date: '',
        registration_end_date: '',
        start_date: '',
        end_date: '',
        description: ''
    });

//open modal edit
const isOpenModalEdit = ref(false)
const openEditModal = (record: ICourseEntity) => {
  console.log('object', record.registration_start_date ? dayjs(record.registration_start_date).format('YYYY-MM-DD') : '');
        formStateEdit.id = record.id;
        formStateEdit.teacher_id = record.teacher_id;
        formStateEdit.category_id = record.category_id;
        formStateEdit.title = record.title;
        formStateEdit.max_students = record.max_student;
        formStateEdit.duration_hours = record.duration_hours;
        formStateEdit.price = record.price;
        formStateEdit.registration_start_date = record.registration_start_date ? dayjs(record.registration_start_date).format('YYYY-MM-DD') : '';
        formStateEdit.registration_end_date = record.registration_end_date ? dayjs(record.registration_end_date).format('YYYY-MM-DD') : '';
        formStateEdit.start_date = record.start_date ? dayjs(record.start_date).format('YYYY-MM-DD') : '';
        formStateEdit.end_date = record.end_date ? dayjs(record.end_date).format('YYYY-MM-DD') : '';
        formStateEdit.description = record.description;

        console.log('Open Edit Modal with record:', formStateEdit);
        
        isOpenModalEdit.value = true;
    }

    //hanndle edit submit
    const onHandleEditSubmit = async () => {
        try {
            await updateCourse(formStateEdit);
            isOpenModalEdit.value = false;
            await fetchAll();
        } catch (error) {
            console.error('Error updating course:', error);
        }
    }

    //update course
    const updateCourse = async (courseData: any) => {
    try {
      const response = await apiClient.put(
        `course/update-course/${courseData.id}`,
        {
          teacher_id: courseData.teacher_id,
          category_id: courseData.category_id,
          title: courseData.title,
          description: courseData.description,
          duration_hours: Number(courseData.duration_hours),
          max_student: Number(courseData.max_students),
          price: Number(courseData.price),
          end_date: courseData.end_date
            ? new Date(courseData.end_date).toISOString()
            : null,
          start_date: courseData.start_date
            ? new Date(courseData.start_date).toISOString()
            : null,
          register_start_date: courseData.registration_start_date
            ? new Date(courseData.registration_start_date).toISOString()
            : null,
          register_end_date: courseData.registration_end_date
            ? new Date(courseData.registration_end_date).toISOString()
            : null,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating course:", error);
      throw new Error("An unexpected error occurred while updating the course");
    }
  };

// ——— Status Change Handler ———
async function handleStatusChange(record: ICourseEntity, checked: boolean): Promise<void> {
  const newStatus: 'open' | 'closed' = checked ? 'open' : 'closed'
  try {
    await updateStatusChange(record.id, newStatus)
    const idx = data.courses.findIndex(c => c.id === record.id)
    if (idx !== -1) data.courses[idx].status = newStatus
    message.success(`Course has been ${newStatus === 'open' ? 'ເປີດ' : 'ປິດ'} successfully`)
  } catch (err: any) {
    console.error('Error updating course status:', err)
    message.error('Failed to update course status')
    await loadCourses()
  }
}

async function handleSubmit() {
  try {
    await createNewCourse(formState as ICourseEntity)
    message.success('Course created successfully')
    isOpenModalAdd.value = false
    await loadCourses()
  } catch (err: any) {
    console.error('Error creating course:', err)
    message.error(err.response?.data?.message || 'Failed to create course')
  }
}
async function handleEditSubmit() {
  try {
    await updateCourse(formState as ICourseEntity)
    message.success('Course updated successfully')
    isOpenModalEdit.value = false
    await loadCourses()
  } catch (err: any) {
    console.error('Error updating course:', err)
    message.error(err.response?.data?.message || 'Failed to update course')
  }
}
// ——— Table Columns ———
const columns = [
  { 
    title: 'ລຳດັບ', 
    key: 'index',
    customRender: ({ index }: { index: number }) => index + 1
  },
  {
    title: 'ໝວດໝູ່',
    dataIndex: 'category',
    key: 'category',
    customRender: ({ record }: { record: ICourseEntity }) => record.category?.name || '-',
  },
  { title: 'ຫົວຂໍ້', dataIndex: 'title', key: 'title' },
  {
    title: 'ຈຳນວນນັກສຶກສາ',
    dataIndex: 'max_students',
    key: 'max_students',
    customRender: ({ record }: { record: ICourseEntity }) => `${record.max_students ?? 0} ຄົນ`,
  },
  {
    title: 'ຊົ່ວໂມງຮຽນ',
    dataIndex: 'duration_hours',
    key: 'duration_hours',
    customRender: ({ record }: { record: ICourseEntity }) =>
      `${record.duration_hours ?? 0} ຊົ່ວໂມງ`,
  },
  {
    title: 'ລາຄາ',
    dataIndex: 'price',
    key: 'price',
    customRender: ({ record }: { record: ICourseEntity }) =>
      `${record.price?.toLocaleString('lo-LA') ?? '0'} ກີບ`,
  },
  { title: 'ເປີດລົງທະບຽນ', dataIndex: 'registration_start_date', key: 'registration_start_date' },
  { title: 'ປິດລົງທະບຽນ', dataIndex: 'registration_end_date', key: 'registration_end_date' },
  { title: 'ເປີດຮຽນ', dataIndex: 'start_date', key: 'start_date' },
  { title: 'ປິດຮຽນ', dataIndex: 'end_date', key: 'end_date' },
  {
    title: 'ສະຖານະ',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ record }: { record: ICourseEntity }) => {
      const status = record.status ?? 'open'
      const color = status === 'open' ? 'green' : 'red'
      const text = status === 'open' ? 'ເປີດ' : 'ປິດ'
      return h('span', { style: { color, fontWeight: 'bold' } }, text)
    },
  },
  { title: 'Action', key: 'action' },
]

//test testfunction
const openTestModal = (value) => {
  console.log('testsomphoud', value)

}
</script>

<template>
  <div>
    <div class="parent">
      <p>ລາຍການ Course</p>
      <a-button type="primary" @click="openModalAdd">ເພີ່ມຂໍ້ມູນ</a-button>
    </div>

    <a-table 
      :dataSource="data.courses" 
      :columns="columns" 
      :loading="data.isLoading"
      rowKey="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <span class="flex items-center gap-2">
            <a-switch
              :checked="record.status === 'open'"
              @change="(checked) => handleStatusChange(record, checked)"
              :checked-children="'ເປີດ'"
              :un-checked-children="'ປິດ'"
            />
            <a-divider type="vertical" />
            <!-- <a @click="() => openEditModal(record)">Edit</a> -->
            <a @click="openEditModal(record)">Edit</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="Sure to Delete?"
              ok-text="ຢືນຢັນ"
              cancel-text="ຍົກເລີກ"
              @confirm="onDelete(record.id)"
            >
              <a style="color: red;">Delete</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a @click="openTestModal(record)">TestDer</a>
          </span>
        </template>
      </template>
    </a-table>
    <!-- //add modal -->
    <a-modal 
      v-model:visible="isOpenModalAdd" 
      title="ເພີ່ມ Course" 
      @ok="handleSubmit" 
      @cancel="isOpenModalAdd = false"
      :ok-text="'ບັນທຶກ'"
      :cancel-text="'ຍົກເລີກ'"
    >
      <div class="select-container">
        <label for="teacher-select">ອາຈານ</label>
        <a-select
          id="teacher-select"
          v-model:value="formState.teacher_id"
          :options="data.teachers"
          show-search
          placeholder="Select a teacher"
          style="width: 100%"
        />
      </div>

      <div class="select-container">
        <label for="category-select">ໝວດ</label>
        <a-select
          id="category-select"
          v-model:value="formState.category_id"
          :options="data.categories"
          show-search
          placeholder="Select a category"
          style="width: 100%"
        />
      </div>

      <div class="select-container">
        <label for="title-input">ຫົວຂໍ້</label>
        <a-input id="title-input" v-model:value="formState.title" />
      </div>

      <div class="select-container">
        <label for="max-students-input">ຈຳນວນນັກສຶກສາ</label>
        <a-input-number id="max-students-input" v-model:value="formState.max_students" style="width: 100%" />
      </div>

      <div class="select-container">
        <label for="duration-input">ຈຳນວນຊົ່ວໂມງ</label>
        <a-input-number id="duration-input" v-model:value="formState.duration_hours" style="width: 100%" />
      </div>

      <div class="select-container">
        <label for="price-input">ລາຄາ</label>
        <a-input-number id="price-input" v-model:value="formState.price" style="width: 100%" />
      </div>

      <div class="select-container">
        <label for="reg-start-input">ວັນທີ່ເປີດລົງທະບຽນ</label>
        <a-date-picker id="reg-start-input" v-model:value="formState.registration_start_date" style="width: 100%" />
      </div>

      <div class="select-container">
        <label for="reg-end-input">ວັນທີ່ປິດລົງທະບຽນ</label>
        <a-date-picker id="reg-end-input" v-model:value="formState.registration_end_date" style="width: 100%" />
      </div>

      <div class="select-container">
        <label for="start-input">ວັນທີ່ເປີດຮຽນ</label>
        <a-date-picker id="start-input" v-model:value="formState.start_date" style="width: 100%" />
      </div>

      <div class="select-container">
        <label for="end-input">ວັນທີ່ປິດຮຽນ</label>
        <a-date-picker id="end-input" v-model:value="formState.end_date" style="width: 100%" />
      </div>

      <div class="select-container">
        <label for="desc-input">ລາຍລະອຽດ</label>
        <a-textarea id="desc-input" v-model:value="formState.description" :rows="4" />
      </div>
    </a-modal>

     <!-- //edit modal -->
     <a-modal v-model:open="isOpenModalEdit" title="ແກ້ໄຂ Course" @ok="onHandleEditSubmit">
      <div class="select-container">
        <label for="teacher-select">ອາຈານ</label>
        <a-select
          id="teacher-select"
          v-model:value="formStateEdit.teacher_id"
          :options="data.teachers"
          show-search
          placeholder="Select a teacher"
          style="width: 100%"
        />
      </div>

      <div class="select-container">
        <label for="category-select">ໝວດ</label>
        <a-select
          id="category-select"
          v-model:value="formStateEdit.category_id"
          :options="data.categories"
          show-search
          placeholder="Select a category"
          style="width: 100%"
        />
      </div>

      <div class="select-container">
        <label for="title-input">ຫົວຂໍ້</label>
        <a-input id="title-input" v-model:value="formStateEdit.title" />
      </div>

      <div class="select-container">
        <label for="max-students-input">ຈຳນວນນັກສຶກສາ</label>
        <a-input-number id="max-students-input" v-model:value="formStateEdit.max_students" style="width: 100%" />
      </div>

      <div class="select-container">
        <label for="duration-input">ຈຳນວນຊົ່ວໂມງ</label>
        <a-input-number id="duration-input" v-model:value="formStateEdit.duration_hours" style="width: 100%" />
      </div>

      <div class="select-container">
        <label for="price-input">ລາຄາ</label>
        <a-input-number id="price-input" v-model:value="formStateEdit.price" style="width: 100%" />
      </div>

      <div class="select-container">
        <label for="reg-start-input">ວັນທີ່ເປີດລົງທະບຽນ</label>
        <a-date-picker
        v-model:value="formStateEdit.registration_start_date"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        style="width: 100%"
/>
      </div>

      <div class="select-container">
        <label for="reg-end-input">ວັນທີ່ປິດລົງທະບຽນ</label>
        <a-date-picker id="reg-end-input" v-model:value="formStateEdit.registration_end_date"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD" 
        style="width: 100%" />
      </div>

      <div class="select-container">
        <label for="start-input">ວັນທີ່ເປີດຮຽນ</label>
        <a-date-picker id="start-input" v-model:value="formStateEdit.start_date" 
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        style="width: 100%" />
      </div>

      <div class="select-container">
        <label for="end-input">ວັນທີ່ປິດຮຽນ</label>
        <a-date-picker id="end-input" v-model:value="formStateEdit.end_date" 
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        style="width: 100%" />
      </div>

      <div class="select-container">
        <label for="desc-input">ລາຍລະອຽດ</label>
        <a-textarea id="desc-input" v-model:value="formStateEdit.description" :rows="4" />
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.parent {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}
.select-container {
  margin-bottom: 1rem;
}
.select-container label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}
</style>
