// Import the react JS packages
import { useEffect } from "react";

// Define the Login function.
export const Home = () => {
    useEffect(() => {
        if (localStorage.getItem('access_token') === null ) {
            window.location.href = '/login'
        }
        else {
            window.location.href = '/pastas'
        };
    }, []);
}
