import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Link } from "react-router-dom";
import Admin from "../Login/Admin/admin";
import Teacher from "../Login/Teacher/teacher";
import Student from "../Login/Student/student";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./home.css";
import Navbar from "../NavBar/nav";
function Home() {
  return (
    <div className="App">
      <Navbar />
      <Tabs>
        <TabPanel>
          {" "}
          <Admin />
        </TabPanel>
        <TabPanel>
          {" "}
          <Teacher />
        </TabPanel>
        <TabPanel>
          {" "}
          <Student />
        </TabPanel>
        <TabList>
          <Tab>Admin</Tab>
          <Tab>Teacher</Tab>
          <Tab>Student</Tab>
        </TabList>
      </Tabs>
    </div>
  );
}

export default Home;
