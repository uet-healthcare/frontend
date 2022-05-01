import * as yup from "yup";

export const signInSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Bạn chưa nhập email"),
  password: yup.string().required("Bạn chưa nhập password"),
});
