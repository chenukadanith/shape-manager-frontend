// src/components/ShapeManager.jsx

import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Modal,
  Form,
  Alert,
  Badge,
  ButtonGroup
} from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';
// Import the helper functions from the new file
import { parseCoordinates, isRectangleCoordinates } from '../utils/shapeValidators';


const ShapeManager = ({
  shapes,
  onAddShape,
  onUpdateShape,
  onDeleteShape,
  overlappingShapes,
  onCheckOverlaps
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingShape, setEditingShape] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'rectangle',
    coordinates: '',
    centerX: '',
    centerY: '',
    radius: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const shapeTypes = [
    { value: 'rectangle', label: 'Rectangle' },
    { value: 'triangle', label: 'Triangle' },
    { value: 'circle', label: 'Circle' },
    { value: 'polygon', label: 'Polygon' }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'rectangle',
      coordinates: '',
      centerX: '',
      centerY: '',
      radius: ''
    });
    setErrors({});
    setEditingShape(null);
    setApiError('');
  };

  const handleShowModal = (shape = null) => {
    if (shape) {
      setEditingShape(shape);
      if (shape.type === 'circle') {
        setFormData({
          name: shape.name,
          type: shape.type,
          coordinates: '',
          centerX: shape.centerX || '',
          centerY: shape.centerY || '',
          radius: shape.radius || ''
        });
      } else {
        setFormData({
          name: shape.name,
          type: shape.type,
          coordinates: shape.coordinates || '',
          centerX: '',
          centerY: '',
          radius: ''
        });
      }
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Shape name is required.';
    } else if (shapes.some(s => s.name.toLowerCase() === formData.name.toLowerCase() &&
                                 (!editingShape || s.id !== editingShape.id))) {
      newErrors.name = 'Shape name must be unique.';
    }

    // Validate coordinates based on shape type
    if (formData.type === 'circle') {
      const parsedCenterX = parseFloat(formData.centerX);
      const parsedCenterY = parseFloat(formData.centerY);
      const parsedRadius = parseFloat(formData.radius);

      if (isNaN(parsedCenterX) || isNaN(parsedCenterY)) {
        newErrors.centerX = 'Center X and Y must be valid numbers.';
        newErrors.centerY = 'Center X and Y must be valid numbers.'; // Add for clarity
      } else if (parsedCenterX < 0 || parsedCenterY < 0) { // NEW VALIDATION: Negative coordinates
        newErrors.centerX = 'Center coordinates cannot be negative.';
        newErrors.centerY = 'Center coordinates cannot be negative.';
      }

      if (isNaN(parsedRadius) || parsedRadius <= 0) {
        newErrors.radius = 'Radius must be a positive number.';
      }

    } else { // For rectangle, triangle, polygon
      if (!formData.coordinates.trim()) {
        newErrors.coordinates = 'Coordinates are required for this shape type.';
      } else {
        const parsedCoords = parseCoordinates(formData.coordinates); // Use imported helper

        if (!parsedCoords) {
          // parseCoordinates returns null if format is wrong OR if negative coords found
          newErrors.coordinates = 'Coordinates must be in format: x1,y1;x2,y2;... (e.g., 10,10;100,10). Each coordinate must be a valid non-negative number.';
        } else {
          const numPoints = parsedCoords.length;

          // Validate number of coordinate pairs based on type
          if (formData.type === 'triangle') {
            if (numPoints !== 3) {
              newErrors.coordinates = 'A triangle requires exactly 3 coordinate pairs.';
            }
          } else if (formData.type === 'rectangle') {
            if (numPoints !== 4) {
              newErrors.coordinates = 'A rectangle requires exactly 4 coordinate pairs.';
            } else if (!isRectangleCoordinates(parsedCoords)) { // Use imported helper for geometric validation
              newErrors.coordinates = 'The provided coordinates do not form a valid rectangle.';
            }
          } else if (formData.type === 'polygon') {
            if (numPoints < 3) {
              newErrors.coordinates = 'A polygon requires at least 3 coordinate pairs.';
            }
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) {
      return;
    }

    let payload;

    if (formData.type === 'circle') {
      payload = {
        name: formData.name.trim(),
        type: formData.type,
        coordinates: null,
        centerX: parseFloat(formData.centerX),
        centerY: parseFloat(formData.centerY),
        radius: parseFloat(formData.radius)
      };
    } else {
      payload = {
        name: formData.name.trim(),
        type: formData.type,
        coordinates: formData.coordinates.trim(),
        centerX: null,
        centerY: null,
        radius: null
      };
    }

    if (editingShape) {
      payload.id = editingShape.id;
    }

    setLoading(true);

    try {
      if (editingShape) {
        const response = await axiosInstance.put(`/shapes/${editingShape.id}`, payload);
        onUpdateShape(response.data);
        console.log("Shape updated:", response.data);
      } else {
        const response = await axiosInstance.post('/shapes', payload);
        onAddShape(response.data);
        console.log("Shape added:", response.data);
      }

      handleCloseModal();

    } catch (err) {
      console.error('API Error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear related errors when type changes or specific fields are typed
    if (name === 'type') {
        setErrors(prev => ({ ...prev, coordinates: '', centerX: '', centerY: '', radius: '' }));
    } else if (name === 'centerX' || name === 'centerY') {
        if (errors.centerX || errors.centerY) { // Clear combined errors if either is typed
            setErrors(prev => ({ ...prev, centerX: '', centerY: '' }));
        }
    } else if (name === 'radius' && errors.radius) {
        setErrors(prev => ({ ...prev, radius: '' }));
    }
  };

  const getCoordinateDisplay = (shape) => {
    if (shape.type === 'circle') {
      return `Center: (${shape.centerX}, ${shape.centerY}), Radius: ${shape.radius}`;
    }
    return shape.coordinates;
  };

  const isOverlapping = (shapeId) => overlappingShapes && overlappingShapes.includes(shapeId);

  return (
    <>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Shape Management</h4>
              <ButtonGroup>
                <Button variant="primary" onClick={() => handleShowModal()}>
                  <i className="fas fa-plus me-1"></i>
                  Add Shape
                </Button>
                <Button variant="info" onClick={onCheckOverlaps}>
                  <i className="fas fa-search me-1"></i>
                  Check Overlaps
                </Button>
              </ButtonGroup>
            </Card.Header>
            <Card.Body>
              {shapes.length === 0 ? (
                <Alert variant="info" className="text-center">
                  <i className="fas fa-info-circle me-2"></i>
                  No shapes created yet. Click "Add Shape" to get started.
                </Alert>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Coordinates</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shapes.map(shape => (
                      <tr
                        key={shape.id}
                        className={isOverlapping(shape.id) ? 'table-warning' : ''}
                      >
                        <td>
                          <strong>{shape.name}</strong>
                          {isOverlapping(shape.id) && (
                            <Badge bg="warning" className="ms-2">
                              <i className="fas fa-exclamation-triangle me-1"></i>
                              Overlapping
                            </Badge>
                          )}
                        </td>
                        <td>
                          <Badge bg="secondary">
                            {shape.type.charAt(0).toUpperCase() + shape.type.slice(1)}
                          </Badge>
                        </td>
                        <td>
                          <small className="text-muted">
                            {getCoordinateDisplay(shape)}
                          </small>
                        </td>
                        <td>
                          {isOverlapping(shape.id) ? (
                            <Badge bg="warning">
                              <i className="fas fa-exclamation-triangle me-1"></i>
                              Overlapping
                            </Badge>
                          ) : (
                            <Badge bg="success">
                              <i className="fas fa-check me-1"></i>
                              Clear
                            </Badge>
                          )}
                        </td>
                        <td>
                          <ButtonGroup size="sm">
                            <Button
                              variant="outline-primary"
                              onClick={() => handleShowModal(shape)}
                              disabled={loading}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              onClick={() => onDeleteShape(shape.id)}
                              disabled={loading}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </ButtonGroup>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Shape Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingShape ? 'Edit Shape' : 'Add New Shape'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {apiError && <Alert variant="danger">{apiError}</Alert>}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Shape Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.name}
                    placeholder="Enter unique shape name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Shape Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    {shapeTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={formData.type === 'circle' ? 6 : 12}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {formData.type === 'circle' ? 'Center X' : 'Coordinates'}
                  </Form.Label>
                  {formData.type === 'circle' ? (
                    <Form.Control
                      type="number"
                      name="centerX"
                      value={formData.centerX}
                      onChange={handleInputChange}
                      isInvalid={!!errors.centerX}
                      placeholder="Enter center X coordinate"
                      step="0.1"
                    />
                  ) : (
                    <Form.Control
                      type="text"
                      name="coordinates"
                      value={formData.coordinates}
                      onChange={handleInputChange}
                      isInvalid={!!errors.coordinates}
                      placeholder="x1,y1;x2,y2;x3,y3... (e.g., 10,10;100,10;100,100;10,100 for rectangle)"
                    />
                  )}
                  <Form.Control.Feedback type="invalid">
                    {formData.type === 'circle' ? errors.centerX : errors.coordinates}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    {formData.type === 'circle' ?
                      'Enter the center X coordinate (must be non-negative)' :
                      `Enter coordinate pairs separated by semicolons. ${
                          formData.type === 'triangle' ? 'Requires 3 pairs.' :
                          formData.type === 'rectangle' ? 'Requires 4 pairs.' :
                          'Requires at least 3 pairs.'
                      } Coordinates must be non-negative.`
                    }
                  </Form.Text>
                </Form.Group>
              </Col>

              {formData.type === 'circle' && (
                <>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Center Y</Form.Label>
                      <Form.Control
                        type="number"
                        name="centerY"
                        value={formData.centerY}
                        onChange={handleInputChange}
                        isInvalid={!!errors.centerY}
                        placeholder="Enter center Y coordinate"
                        step="0.1"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.centerY}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Enter the center Y coordinate (must be non-negative)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Radius</Form.Label>
                      <Form.Control
                        type="number"
                        name="radius"
                        value={formData.radius}
                        onChange={handleInputChange}
                        isInvalid={!!errors.radius}
                        placeholder="Enter radius"
                        min="1"
                        step="0.1"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.radius}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Enter the radius (must be a positive number)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </>
              )}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingShape ? 'Update Shape' : 'Add Shape'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ShapeManager;