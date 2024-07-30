import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const TicketModal = ({ show, onHide, flights, customers, onTicketAdded }) => {
  const [formData, setFormData] = useState({
    flight_id: '',
    customer_id: '',
    notification_id: '',
  });

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
      await axios.post('http://127.0.0.1:5000/tickets', formattedData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      onTicketAdded(); // Refresh tickets list
      onHide(); // Close modal
    } catch (error) {
      console.error("There was an error adding the ticket!", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Ticket</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="flight_id">
            <Form.Label>Flight</Form.Label>
            <Form.Control
              as="select"
              name="flight_id"
              value={formData.flight_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Flight</option>
              {flights.map((flight) => (
                <option key={flight.flight_id} value={flight.flight_id}>
                  {`${flight.airline} - ${flight.departure_airport_name} to ${flight.arrival_airport_name}`}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="customer_id">
            <Form.Label>Customer</Form.Label>
            <Form.Control
              as="select"
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.customer_id} value={customer.customer_id}>
                  {customer.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="notification_id">
            <Form.Label>Notification ID</Form.Label>
            <Form.Control
              type="text"
              name="notification_id"
              value={formData.notification_id}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add Ticket
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TicketModal;
