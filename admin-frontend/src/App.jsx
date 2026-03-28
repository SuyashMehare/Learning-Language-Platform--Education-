import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import CreateLectures from './pages/CreateLectures';
import UpdateLectures from './pages/UpdateLectures';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <NavBar />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-lectures" element={<CreateLectures />} />
          <Route path="/update-lectures" element={<UpdateLectures />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
