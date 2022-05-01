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
