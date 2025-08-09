import axios from 'axios';

function readCookie(name: string) {
    const m = document.cookie.split('; ').find(r => r.startsWith(name + '='));
    return m ? decodeURIComponent(m.split('=').pop()!) : '';
}

window.axios = axios;

// Always send the right headers
window.axios.defaults.withCredentials = true; // keep cookies with requests
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Interceptor to refresh the CSRF token before each request
window.axios.interceptors.request.use(config => {
    const xsrf = readCookie('XSRF-TOKEN');
    if (xsrf) {
        config.headers['X-XSRF-TOKEN'] = xsrf;
    }
    return config;
});
