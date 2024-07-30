import React from 'react';
import CustomNavbar from './Components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { ProjectProvider } from './context/Projectcontext';
import Sidebar from './Components/Sidebar';
import AddFlight from './pages/AddFlight';
import AddAirport from './pages/AddAirport';
import AddCustomer from './pages/AddCustomer';

const App = () => {
  return (
    <ProjectProvider>
      <Router>
        <div className="app">
          <Routes>
            
            <Route path="/" element={<Sidebar />}>
              <Route exact path="" element={<Home />} />
              <Route path="/add-customer" element={<AddCustomer/>} />
              <Route path="/add-flight" element={<AddFlight/>} />
              <Route path="/add-airport" element={<AddAirport/>} />
              {/* <Route path="/create-ticket" element={<CreateTicket />} /> */}
            </Route>
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </ProjectProvider>
  );
};

export default App;
