import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify'; // Import toast

const AddCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferred_notification_method: ''
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/customers');
        setCustomers(response.data);
      } catch (error) {
        toast.error('Error fetching customers: ' + error.message); // Show error toast
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleCardClick = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      preferred_notification_method: ''
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
      await axios.post('http://127.0.0.1:5000/customers', formattedData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      toast.success('Customer added successfully'); // Show success toast
      // Refresh customer list
      const response = await axios.get('http://127.0.0.1:5000/customers');
      setCustomers(response.data);
      handleModalClose();
    } catch (error) {
      toast.error('Error adding customer: ' + error.message); // Show error toast
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        {loading ? (
          <div>Loading...</div>
        ) : (
          customers.map((customer) => (
            <Col key={customer.customer_id} md={4} className="mb-4">
              <Card className="custom-card">
                <Card.Body>
                  <Card.Text>Name: {customer.name}</Card.Text>
                  <Card.Text>Email: {customer.email}</Card.Text>
                  <Card.Text>Phone: {customer.phone}</Card.Text>
                  <Card.Text>Preferred Notification: {customer.preferred_notification_method}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Button variant="primary" onClick={handleCardClick}>Add Customer</Button>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
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
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="preferred_notification_method">
              <Form.Label>Preferred Notification Method</Form.Label>
              <Form.Control
                type="text"
                name="preferred_notification_method"
                value={formData.preferred_notification_method}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Customer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer /> {/* Include ToastContainer here */}
    </Container>
  );
};

export default AddCustomer;
