import axios from "axios"
import { useEffect } from "react";
import {  useNavigate } from 'react-router-dom';
import { BACKEND_URLS } from "../constants/backend_urls";

function CardsOfOthers({ label, navLink, fetchDataEndpoint, postDataEndPoint, customCss }) {
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("llp-user")
        if (!user) {
            navigate("/login")
        }
    }, [])


    async function handleClick() {
        try {
            const user = localStorage.getItem("llp-user")
            const res = await axios.post(fetchDataEndpoint, { email: user })
            navigate(`${navLink}`, { state: { data: res.data, fetchDataEndpoint: fetchDataEndpoint, postDataEndPoint: postDataEndPoint } });
            //
        } catch (error) {
            console.log("Error found at CardsOfOthers", error);
            return
        }
    }

    return <div onClick={handleClick} class={`flex justify-center items-center border-0 w-50 h-50 rounded-xl outline-none text-xl ${customCss}`} >
        <div>
            <label htmlFor="nav-link">{label}</label>
            {/* <label htmlFor="nav-link">${navLink}</label> */}
        </div>
    </div>
}

export {
    CardsOfOthers
}