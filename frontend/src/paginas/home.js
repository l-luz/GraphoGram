// Import the react JS packages
import { useEffect, useState } from "react";

// Define the Login function.
export const Home = () => {
    const [message, setMessage] = useState('');
    useEffect(() => {
        if (localStorage.getItem('access_token') === null) {
            window.location.href = '/login'
        }
        else {
            window.location.href = '/pastas'
        };
    }, []);
}
