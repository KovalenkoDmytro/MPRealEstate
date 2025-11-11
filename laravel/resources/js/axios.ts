import axios, {AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig} from 'axios';

function readCookie(name: string) {
    const m = document.cookie.split('; ').find(r => r.startsWith(name + '='));
    return m ? decodeURIComponent(m.split('=').pop()!) : '';
}

export const api: AxiosInstance = axios.create({
    withCredentials: true,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

// Always attach fresh CSRF from XSRF-TOKEN cookie
api.interceptors.request.use((config: InternalAxiosRequestConfig<any>) => {
    const xsrf = readCookie('XSRF-TOKEN');
    if (xsrf){

        if (!config.headers) {
            config.headers = new AxiosHeaders();
        }

        config.headers.set('X-XSRF-TOKEN', xsrf);

    }
    return config;
});
