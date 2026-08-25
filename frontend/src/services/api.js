import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    withXSRFToken: true,
});

const MUTATING_METHODS = ["post", "put", "patch", "delete"];

function hasXsrfCookie() {
    return document.cookie
        .split("; ")
        .some((cookie) => cookie.startsWith("XSRF-TOKEN="));
}

// The XSRF-TOKEN cookie doesn't exist until the backend has issued it once.
// On a fresh page load, the first mutating request (e.g. login/register)
// would otherwise be rejected by CSRF protection before it's even
// evaluated. Priming with a plain GET (bypassing this instance's own
// interceptors) sets the cookie first, so the real request succeeds.
api.interceptors.request.use(async (config) => {
    const method = (config.method || "").toLowerCase();

    if (MUTATING_METHODS.includes(method) && !hasXsrfCookie()) {
        await axios
            .get(`${api.defaults.baseURL}/auth/me`, {
                withCredentials: true,
            })
            .catch(() => {});
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl = error.config?.url || "";

        const isPublicAuthRequest =
            requestUrl === "/auth/login" ||
            requestUrl === "/auth/register";

        if (
            error.response?.status === 401 &&
            !isPublicAuthRequest
        ) {
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;