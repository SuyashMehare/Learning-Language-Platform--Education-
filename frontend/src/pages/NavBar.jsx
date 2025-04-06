const metadata = [
    { candidate: "Home", candidateLink: "/" },
    { candidate: "Sign Up", candidateLink: "/signup" },
    { candidate: "Login", candidateLink: "/login" },
    { candidate: "Others", candidateLink: "/others" },
    { candidate: "Progress", candidateLink: "/client/progress" },
]

function NavBar() {
    function handleClick(candidate) {
        navigate(candidate);
    }
    return <div class="flex gap-5 bg-cyan-700 mb-8 p-5 ">
        {
            metadata.map(({candidate, candidateLink}) => {
                return <a href={`${candidateLink}`} class="hover:underline hover:text-gray-900 ">{candidate}</a>
            })
           }
    </div>
}

export {
    NavBar
}