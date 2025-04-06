import axios from "axios"
import { Link, useNavigate } from 'react-router-dom';


function CardsOfOthers({label, navLink, fetchDataEndpoint, postDataEndPoint, customCss}) {
    const navigate = useNavigate();

    async function handleClick() {
       try {
         const res = await axios.post(`http://localhost:5000/${fetchDataEndpoint}`, {email: "user3@gmail.com"})
         navigate(`${navLink}`, { state: { data: res.data, fetchDataEndpoint: fetchDataEndpoint, postDataEndPoint: postDataEndPoint} });
         //
       } catch (error) {
        console.log("Error found at CardsOfOthers",error);
        return
       }
    }

    return <div onClick={handleClick} class={`flex justify-center items-center border-0 w-50 h-50 rounded-xl outline-none text-xl ${ customCss }`} >
        <div>
            <label htmlFor="nav-link">{label}</label>
            {/* <label htmlFor="nav-link">${navLink}</label> */}
        </div>
    </div>
}

export {
    CardsOfOthers
}