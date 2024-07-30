import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import ProjectCard from '../Components/Card';
import TicketModal from '../Components/Modal';
import "../App.css";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [flights, setFlights] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/tickets');
        setProjects(response.data);
      } catch (error) {
        toast.error('Error fetching tickets: ' + error.message); 
      } finally {
        setLoading(false);
      }
    };

    const fetchFlights = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/flights');
        setFlights(response.data);
      } catch (error) {
        toast.error('Error fetching flights: ' + error.message); 
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/customers');
        setCustomers(response.data);
      } catch (error) {
        toast.error('Error fetching customers: ' + error.message); 
      }
    };

    fetchProjects();
    fetchFlights();
    fetchCustomers();
  }, []);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <Container className="mt-4">
        <Row className="d-flex justify-content-between mb-3">
          <div>
            <Button variant="primary" onClick={handleModalShow}>
              Add Ticket
            </Button>
          </div>
        </Row>
        <Row>
          {projects.map((project) => (
            <Col key={project.ticket_id} md={4} className="mb-4">
              <ProjectCard project={project} />
            </Col>
          ))}
        </Row>
      </Container>

      <TicketModal
        show={showModal}
        onHide={handleModalClose}
        flights={flights}
        customers={customers}
        onTicketAdded={async () => {
          try {
            const response = await axios.get('http://127.0.0.1:5000/tickets');
            setProjects(response.data);
            toast.success('Ticket added successfully'); // Show success toast
          } catch (error) {
            toast.error('Error refreshing tickets: ' + error.message); // Show error toast
          }
        }}
      />
      <ToastContainer /> 
    </div>
  );
};

export default Home;
