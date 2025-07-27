import apiClient from "../../../common/configuration/axios.config";
//import type { ICourseEntity } from "../entity/course.entity";

export function useCourse() {
    const fetchItems = async () => {
       const response = await apiClient.get("/course/get-all", {
            params: {
                page: 1,
                limit: 10,
                search: "",
            },     
        });
         return response.data;
    }
    //fetch teacher
    const getAllTeachers = async() => {
        const response = await apiClient.get("teacher/get-all");
        return response.data
    };
    //fetch catgory
    const getAllCategories = async() => {
        const response = await apiClient.get("course/categories");
        return response.data
    }

    const createNewCourse = async (courseData: any) => {
        try{
            const response = await apiClient.post("course/create-course", {
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
              });
            return response.data;
        }catch (error:any) {
            console.log("Error creating course:", error);
            throw new error("Failed to create course. Please try again later.");
        }
    }

    const updateStatusChange = async (id: number, status: string) => {
        try {
          const response = await apiClient.put(`course/update-status/${id}`, {
            status: status,
          });
          return response.data;
        } catch (error: any) {
          console.error("Error updating course status:", error);
          throw new Error(
            "An unexpected error occurred while updating course status"
          );
        }
      };

      //updateCourse
      const updateCourse = async (id: number, courseData: any) => {
        try {
            const response = await apiClient.put(`course/update-course/${id}`, {
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
              });
            return response.data;
        } catch (error:any) {
            console.error("Error updating course:", error);
            throw new Error("An unexpected error occurred while updating the course");
        }
      }
      // deleteCourse
      const deleteCourse = async (id: number) => {
        try {
            const response = await apiClient.delete(`course/delete-course/${id}`);
            return response.data;
        } catch (error: any) {
            console.error("Error deleting course:", error);
            throw new Error("An unexpected error occurred while deleting the course");
        }
      }

    return{
        fetchItems,
        createNewCourse,
        getAllTeachers,
        getAllCategories,
        updateStatusChange,
        deleteCourse,
        updateCourse,
    }

    
}