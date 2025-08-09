// axios.ts
import axios, { AxiosError } from 'axios';

function readCookie(name: string) {
    const m = document.cookie.split('; ').find(r => r.startsWith(name + '='));
    return m ? decodeURIComponent(m.split('=').pop()!) : '';
}

export const api = axios.create({
    withCredentials: true, // send laravel_session
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    // baseURL: '/', // optional; keep relative URLs from Ziggy
});

// Always attach fresh CSRF from XSRF-TOKEN cookie
api.interceptors.request.use(config => {
    const xsrf = readCookie('XSRF-TOKEN');
    if (xsrf) (config.headers ||= {})['X-XSRF-TOKEN'] = xsrf;
    return config;
});

// Optional: normalize errors a bit
api.interceptors.response.use(
    (res) => res,
    (err: AxiosError<any>) => {
        const msg =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            'Request failed';
        return Promise.reject(new Error(msg));
    }
);
