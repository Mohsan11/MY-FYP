import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Link } from "react-router-dom";
import Coordinator from "../Login/Coordinator/coordinator";
import Teacher from "../Login/Teacher/teacher";
import Student from "../Login/Student/student";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./home.css";
import Navbar from "../NavBar/nav";
function Home() {
  return (
    <div className="App">
      <Tabs>
        <TabPanel>
          {" "}
          <Coordinator />
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
          <Tab>Coordinator</Tab>
          <Tab>Teacher</Tab>
          <Tab>Student</Tab>
        </TabList>
      </Tabs>
    </div>
  );
}

export default Home;
