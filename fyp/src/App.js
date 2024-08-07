import "./App.css";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import { Link } from "react-router-dom";
import Home from "./Components/Home/home";
import Register from "./Components/Login/Staff/Register/register";
import Login from "./Components/Login/Staff/Login/staff";
import Main from "./Components/Coordinator/Main";
import StudentMain from "./Components/Students/studentMain";
import TeacherMain from"./Components/Teacher/Dashboard/teacherMain"
import UpdateStudent from "./Components/Coordinator/Pages/manage staff/Student/updatestudent";
import UpdateTeacher from "./Components/Coordinator/Pages/manage staff/Teacher/updateTeacher";
import UpdateCoordinator from "./Components/Coordinator/Pages/manage staff/Staff/updateCoordinator";

import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<Main />} />
          <Route path="/coordinator" element={<Main />} />
          <Route path="/studentMain" element={<StudentMain />} />
          <Route path="/teacherDashboard" element={<TeacherMain />} />
          <Route path="/update-student/:id" element={<UpdateStudent />} />
          <Route path="/update-coordinator/:id" element={<UpdateCoordinator />} />
          <Route path="/update-teacher/:id" element={<UpdateTeacher />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
