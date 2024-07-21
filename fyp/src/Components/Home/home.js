import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import { Link } from "react-router-dom";
import Staff from "../Login/Staff/Login/staff";
import Student from "../Login/Student/student";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./home.css";
// import Navbar from "../NavBar/nav";
function Home() {
  return (
    <div className="App">
      <Tabs>
        <TabPanel>
          {" "}
          <Staff />
        </TabPanel>
        <TabPanel>
          {" "}
          <Student />
        </TabPanel>
        <TabList>
          <Tab>Staff</Tab>
          <Tab>Student</Tab>
        </TabList>
      </Tabs>
    </div>
  );
}

export default Home;
