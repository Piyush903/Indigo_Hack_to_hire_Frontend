import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Card, Col, Row,Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ProjectContext } from '../context/Projectcontext';
import './cards.css';

const ProjectCard = ({ project }) => {
  const [flightDetails, setFlightDetails] = useState({});
  const [customerDetails, setCustomerDetails] = useState({});
  const { setCurrentProject } = useContext(ProjectContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlightAndCustomerDetails = async () => {
      try {
        // Assuming the API for ticket has a field for flight_id and customer_id
        // Fetch flight details
        const flightResponse = await axios.get(`http://127.0.0.1:5000/flights/${project.flight_id}`);
        setFlightDetails(flightResponse.data);

        // Fetch customer details
        const customerResponse = await axios.get(`http://127.0.0.1:5000/customers/${project.customer_id}`);
        setCustomerDetails(customerResponse.data);
      } catch (error) {
        console.error('Error fetching flight or customer details:', error);
      }
    };

    fetchFlightAndCustomerDetails();
  }, [project.ticket_id]);

  const randomColor = Math.random() < 0.5 ? 'palegoldenrod' : 'purple';

  const handleCardClick = () => {
    // setCurrentProject({ name: project.name, id: project._id });
    // navigate(`/projects/${project.}`);
  };

  return (
    <Card className="custom-card" onClick={handleCardClick}>
      <Card.Body>
        <Row noGutters>
          <Col xs={5} className="d-flex  justify-content-center">
            <Image src='https://storage.googleapis.com/image_buck_123/image-1.png' className='color-squar' style={{backgroundColor:randomColor}}/>
          </Col>
          <Col xs={7}>
            <Card.Text style={{fontSize:"10px",fontWeight:"bold",margin:"5px"}} className="flight-name">{`${flightDetails.airline || 'N/A'}`}</Card.Text>
            <Card.Text style={{fontSize:"10px",fontWeight:"bold",margin:"5px"}} className="arrival-departure">
              {`${flightDetails.departure_airport_name || 'N/A'}`}
            </Card.Text>
            <Card.Text style={{fontSize:"10px",fontWeight:"bold",margin:"5px"}} className="arrival-departure">
              {` ${flightDetails.arrival_airport_name || 'N/A'}`}
            </Card.Text>
            <Card.Text style={{fontSize:"10px",fontWeight:"bold",margin:"5px"}} className="customer-name">{`${customerDetails.name || 'N/A'}`}</Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ProjectCard;
