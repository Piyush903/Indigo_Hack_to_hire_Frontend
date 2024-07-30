import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify'; // Import toast

const AddAirport = () => {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    iata_code: '',
    name: '',
    city: '',
    country: '',
    timezone: ''
  });

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/airports');
        setAirports(response.data);
      } catch (error) {
        toast.error('Error fetching airports: ' + error.message); // Show error toast
      } finally {
        setLoading(false);
      }
    };

    fetchAirports();
  }, []);

  const handleCardClick = () => {
    setFormData({
      iata_code: '',
      name: '',
      city: '',
      country: '',
      timezone: ''
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
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
      await axios.post('http://127.0.0.1:5000/airports', formattedData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      toast.success('Airport added successfully'); // Show success toast
      // Refresh airport list
      const response = await axios.get('http://127.0.0.1:5000/airports');
      setAirports(response.data);
      handleModalClose();
    } catch (error) {
      toast.error('Error adding airport: ' + error.message); // Show error toast
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        {loading ? (
          <div>Loading...</div>
        ) : (
          airports.map((airport) => (
            <Col key={airport.airport_id} md={4} className="mb-4">
              <Card className="custom-card">
                <Card.Body>
                  <Card.Text>IATA Code: {airport.iata_code}</Card.Text>
                  <Card.Text>Name: {airport.name}</Card.Text>
                  <Card.Text>City: {airport.city}</Card.Text>
                  <Card.Text>Country: {airport.country}</Card.Text>
                  <Card.Text>Timezone: {airport.timezone}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Button variant="primary" onClick={handleCardClick}>Add Airport</Button>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Airport</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="iata_code">
              <Form.Label>IATA Code</Form.Label>
              <Form.Control
                type="text"
                name="iata_code"
                value={formData.iata_code}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="timezone">
              <Form.Label>Timezone</Form.Label>
              <Form.Control
                type="text"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Airport
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer /> {/* Include ToastContainer here */}
    </Container>
  );
};

export default AddAirport;
