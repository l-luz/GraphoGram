import { useEffect } from "react"
import axios from "axios";

export default function Logout () {
    useEffect(() => {
        (async () => {
            try {
                await
                    axios.post('api/logout/', {
                        refresh_token: localStorage.getItem('refresh_token')
                    }, { headers: { 'Content-Type': 'application/json' } },
                        { withCredentials: true });
                localStorage.clear();
                axios.defaults.headers.common['Authorization'] = null;
                window.location.href = '/'
            } catch (e) {
                console.log('Erro no logout', e)
            }
        })();
    }, []);
    return (
        <div></div>
    )
}

