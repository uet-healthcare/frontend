import axios from "axios";

export const mainAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MAIN_URL,
});

// Add a request interceptor
mainAPI.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
mainAPI.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      if (window.localStorage.getItem("gotrue.user")) {
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
        window.localStorage.clear();
        window.location.href = "/dang-nhap";
      }
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
