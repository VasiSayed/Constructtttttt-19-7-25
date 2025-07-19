import axios from "axios";
const LOCAL_IP = "192.168.43.79";
// const LOCAL_IP = "192.168.0.104";
// const LOCAL_IP = "192.168.1.14";
// const LOCAL_IP = "192.168.78.214";
// const LOCAL_IP = "192.168.16.214";
// const LOCAL_IP = "192.168.0.204";
// const LOCAL_IP = "192.168.78.214";

const refreshToken = async () => {
  const refresh = localStorage.getItem("REFRESH_TOKEN");
  if (!refresh) throw new Error("No refresh token available");
  try {
    const response = await axios.post(
      `https://konstruct.world/users/token/refresh/`,
      {
        refresh,
      }
    );
    localStorage.setItem("ACCESS_TOKEN", response.data.access);
    return response.data.access;
  } catch (error) {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");
    window.location.href = "/login";
    throw error;
  }
};

// Auth microservice (LOGIN WILL WORK)
const axiosInstance = axios.create({
  baseURL: `https://konstruct.world/users/`,
});

// Project microservice (OTHER SERVICES - ASK FRIEND FOR PORTS)
export const projectInstance = axios.create({
  baseURL: `https://konstruct.world/projects/`,
});

// ❌ REMOVE THIS DUPLICATE INTERCEPTOR
// projectInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('ACCESS_TOKEN');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export const organnizationInstance = axios.create({
  baseURL: `https://konstruct.world/organizations/`,
});

export const checklistInstance = axios.create({
  baseURL: `https://konstruct.world/checklists/`,
});

export const NEWchecklistInstance = axios.create({
  baseURL: `https://konstruct.world/checklists/`,
});

// Attach token to every request
const attachTokenInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("ACCESS_TOKEN");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshToken();
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

attachTokenInterceptor(axiosInstance);
attachTokenInterceptor(projectInstance);
attachTokenInterceptor(organnizationInstance);
attachTokenInterceptor(checklistInstance);
attachTokenInterceptor(NEWchecklistInstance);
export default axiosInstance;
