import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Row, Button, Modal, Form, Container } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify'; // Import toast
import '../Components/cards.css';

const AddFlight = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [airports, setAirports] = useState([]);
  const [formData, setFormData] = useState({
    flight_date: '',
    flight_status: '',
    departure_airport_id: '',
    arrival_airport_id: '',
    departure_time: '',
    arrival_time: '',
    airline: '',
    delay: 0,
  });

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/flights');
        setFlights(response.data);
      } catch (error) {
        toast.error('Error fetching flights: ' + error.message); // Show error toast
      } finally {
        setLoading(false);
      }
    };

    const fetchAirports = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/airports');
        setAirports(response.data);
      } catch (error) {
        toast.error('Error fetching airports: ' + error.message); // Show error toast
      }
    };

    fetchFlights();
    fetchAirports();
  }, []);

  const handleCardClick = (flight) => {
    setSelectedFlight(flight);
    setFormData(flight ? {
      flight_date: flight.flight_date,
      flight_status: flight.flight_status,
      departure_airport_id: flight.departure_airport_id,
      arrival_airport_id: flight.arrival_airport_id,
      departure_time: flight.departure_time ? new Date(flight.departure_time).toISOString().slice(0, 16) : '', // Adjust format if needed
      arrival_time: flight.arrival_time ? new Date(flight.arrival_time).toISOString().slice(0, 16) : '', // Adjust format if needed
      airline: flight.airline,
      delay: flight.delay,
    } : {
      flight_date: '',
      flight_status: '',
      departure_airport_id: '',
      arrival_airport_id: '',
      departure_time: '',
      arrival_time: '',
      airline: '',
      delay: 0,
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedFlight(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = new URLSearchParams();
    for (const [key, value] of Object.entries(formData)) {
      formattedData.append(key, value);
    }

    try {
      if (selectedFlight) {
        await axios.put(`http://127.0.0.1:5000/flights/${selectedFlight.flight_id}`, formattedData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        toast.success('Flight updated successfully'); // Show success toast
      } else {
        await axios.post('http://127.0.0.1:5000/flights', formattedData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        toast.success('Flight added successfully'); // Show success toast
      }
      handleModalClose();
    } catch (error) {
      toast.error('Error adding/updating the flight: ' + error.message); // Show error toast
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        {loading ? (
          <div>Loading...</div>
        ) : (
          flights.map((flight) => (
            <Col key={flight.flight_id} md={4} className="mb-4">
              <Card className="custom-card" onClick={() => handleCardClick(flight)}>
                <Card.Body>
                  <Row noGutters>
                    <Col xs={5} className="d-flex align-items-center justify-content-center">
                      <img src='https://storage.googleapis.com/image_buck_123/image-1.png' className='color-square' style={{backgroundColor: 'transparent', width:"100px", height:"100px"}} alt="Flight"/>
                    </Col>
                    <Col xs={7}>
                      <Card.Text style={{fontSize:"10px", fontWeight:"bold", margin:"5px"}} className="flight-name">{`${flight.airline || 'N/A'}`}</Card.Text>
                      <Card.Text style={{fontSize:"10px", fontWeight:"bold", margin:"5px"}} className="arrival-departure">
                        {`${flight.departure_airport_name || 'N/A'}`}
                      </Card.Text>
                      <Card.Text style={{fontSize:"10px", fontWeight:"bold", margin:"5px"}} className="arrival-departure">
                        {`${flight.arrival_airport_name || 'N/A'}`}
                      </Card.Text>
                      <Card.Text style={{fontSize:"10px", fontWeight:"bold", margin:"5px"}} className="customer-name">{`${flight.delay || 'N/A'}`}</Card.Text>
                      <Card.Text style={{fontSize:"10px", fontWeight:"bold", margin:"5px"}} className="customer-name">{`${flight.status || 'N/A'}`}</Card.Text>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Button variant="primary" onClick={() => handleCardClick(null)}>Add Flight</Button>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedFlight ? 'Edit Flight' : 'Add Flight'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="flight_date">
              <Form.Label>Flight Date</Form.Label>
              <Form.Control
                type="date"
                name="flight_date"
                value={formData.flight_date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="flight_status">
              <Form.Label>Flight Status</Form.Label>
              <Form.Control
                type="text"
                name="flight_status"
                value={formData.flight_status}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="departure_airport_id">
              <Form.Label>Departure Airport</Form.Label>
              <Form.Control
                as="select"
                name="departure_airport_id"
                value={formData.departure_airport_id}
                onChange={handleChange}
              >
                <option value="">Select Departure Airport</option>
                {airports.map((airport) => (
                  <option key={airport.airport_id} value={airport.airport_id}>
                    {`${airport.name} (${airport.iata_code})`}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="arrival_airport_id">
              <Form.Label>Arrival Airport</Form.Label>
              <Form.Control
                as="select"
                name="arrival_airport_id"
                value={formData.arrival_airport_id}
                onChange={handleChange}
              >
                <option value="">Select Arrival Airport</option>
                {airports.map((airport) => (
                  <option key={airport.airport_id} value={airport.airport_id}>
                    {`${airport.name} (${airport.iata_code})`}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="departure_time">
              <Form.Label>Departure Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="departure_time"
                value={formData.departure_time}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="arrival_time">
              <Form.Label>Arrival Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="arrival_time"
                value={formData.arrival_time}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="airline">
              <Form.Label>Airline</Form.Label>
              <Form.Control
                type="text"
                name="airline"
                value={formData.airline}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="delay">
              <Form.Label>Delay</Form.Label>
              <Form.Control
                type="number"
                name="delay"
                value={formData.delay}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {selectedFlight ? 'Update Flight' : 'Add Flight'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer /> {/* Include ToastContainer here */}
    </Container>
  );
};

export default AddFlight;
