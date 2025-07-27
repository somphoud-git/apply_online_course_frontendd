import apiClient from "../../../common/configuration/axios.config";

export function useRegister() {
  const register = async (values: any) => {
    const response = await apiClient.post("/student", {
      email: values.email,
      password: values.password,
      name: values.username,
    });
    return response.data;
  };

  const adminUpdateProfile = async (values: any) => {
    const response = await apiClient.put(`/students/${values.id}`, {
      name: values.username,
      surname: values.surname,
      birth_date: values.birth_date,
      gender: values.gender,
      email: values.email,
      address: values.address,
    });
    return response.data;
  };

  const adminDeleteCustomer = async(_id:number) => {
    const response = await apiClient.delete(`/students/${_id}`);
    return response.data;
  }

  

  return {
    register,
    adminUpdateProfile,
    adminDeleteCustomer,
  };
}
