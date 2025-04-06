import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
    baseURL: "http://localhost:4000/api", // Base URL for your API
    withCredentials: true, // Include cookies in requests
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = Cookies.get("refreshToken");
                console.log(refreshToken);

                // if (!refreshToken) {
                //     console.error("No refresh token available");
                //     window.location.href = "/login";
                //     return Promise.reject((new Error("No refresh token available")));
                // }

                const response = await axios.post(
                    "http://localhost:4000/api/users/refreshtoken",
                    { refreshToken },
                    { withCredentials: true }
                );

                const newToken = response.data.token;
                Cookies.set("token", newToken); // Save the new token in cookies
                Cookies.set("refreshToken", response.data.refreshToken); // Save the new refresh token in cookies
                apiClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                processQueue(null, newToken);
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;