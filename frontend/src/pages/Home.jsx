import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate()
    useEffect(() => {
        const user = localStorage.getItem("llp-user")
        if (!user) {
            navigate("/login")
        }
    },[])

    return <>
        home
    </>
}

export {
    Home
}