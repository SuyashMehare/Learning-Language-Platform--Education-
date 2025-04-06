import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");


    const handleSubmit = async(e) => {
            e.preventDefault();
            setErr("");
            setSuccess("")

            if(!email) {
                setErr("Please enter the email");
                return;
            }
    
            try {
                const res = await axios.post("https://learning-language-platform-education-kqws.onrender.com/api/v1/user/login",{email})
                console.log(res);
                
                if(res.data.success) {
                    setSuccess("User logged in")
                    localStorage.setItem("llp-user", email);
                    navigate("/home")
                }

            } catch (error) {
                console.log("Error",error);
                if(error?.status === 404) {
                    setErr("User not found. Please sign up first");
                    navigate("/signup")
                    return;
                }
                setErr("Soemthing went wrong please try again latter");
                return
            }
           
    
            console.log(res);        
        }

    return (<>
        <h3 class="text-center text-4xl mb-5" >Login User</h3>
        {
            (err && (
                <div class="text-red-300 text-center">{err} </div>
            ))
        }
        {
            (success && (
                <div class="text-green-300 text-center">{success} </div>
            ))
        }
        <form onSubmit={handleSubmit} class="flex flex-col gap-4 flex-wrap max-w-xl justify-self-center p-3 border rounded-md">
            <div class="flex flex-wrap gap-3">
                <label htmlFor="user-email" class="self-center">User email: </label>
                <input 
                    type="text" 
                    name="user-email" 
                    id="user-email" 
                    onChange={(e)=>setEmail(e.target.value)} 
                    placeholder="Enter Email" 
                    class="p-3"
                />
            </div>
        <button type="submit" class="bg-sky-500/50 p-1 w-40 self-center hover:bg-sky-700/50 hover:cursor-pointer rounded">Submit</button>
        </form>
    </>)
}

export {
    Login
}