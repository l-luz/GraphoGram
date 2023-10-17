import axios from "axios";
let refresh = false;

axios.interceptors.response.use(resp => resp, async error => {
    if (error.response.status === 401){
        if (window.location.href === "http://localhost:3000/login"){
            return;
        }

        if (localStorage.getItem("access_token") === undefined || localStorage.getItem("access_token") === null){
            localStorage.clear();
            axios.defaults.headers.common['Authorization'] = null;
            window.location.href = '/erro401';
        }
        else if (error.response.status === 401 && !refresh) {
            console.log("aqui")
            refresh = true;
            console.log(localStorage.getItem('access_token'))

            console.log(localStorage.getItem('refresh_token'))
            const response = await
                axios.post('/api/login/refresh/', {
                    refresh: localStorage.getItem('refresh_token')
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }, { withCredentials: true });
            console.log(localStorage.getItem('access_token'))
            if (response.status === 200) {
                axios.defaults.headers.common['Authorization'] = `Bearer
            ${response.data['access']}`;
                localStorage.setItem('access_token', response.access);
                localStorage.setItem('refresh_token', response.refresh);
                return axios(error.config);
            }
        }
    }
    refresh = false;
    return error;
});