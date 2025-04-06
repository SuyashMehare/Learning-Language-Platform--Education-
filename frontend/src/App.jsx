import { Home, NavBar, Others, Quiz, SignUp, UserProgress, Vocabulary } from './pages'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from './pages'


function App() {

  return (
    <>
      <div class="">
        <NavBar/>
        <div class="flex flex-col h-screen justify-center items-center">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/others" element={<Others/>} />
              <Route path="/client/vocabulary/solved" element={<Vocabulary/>} />
              <Route path="/client/vocabulary/unsolved" element={<Vocabulary/>} />
              <Route path="/client/quiz/random" element={<Quiz/>} />
              <Route path="/client/progress" element={<UserProgress/>} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
      
    </>
  )
}

export default App
