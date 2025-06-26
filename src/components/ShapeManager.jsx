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
    radius: ''
  });
  const [errors, setErrors] = useState({});

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
      radius: ''
    });
    setErrors({});
    setEditingShape(null);
  };

  const handleShowModal = (shape = null) => {
    if (shape) {
      setEditingShape(shape);
      setFormData({
        name: shape.name,
        type: shape.type,
        coordinates: shape.coordinates || '',
        radius: shape.radius || ''
      });
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
      newErrors.name = 'Shape name is required';
    } else if (shapes.some(s => s.name.toLowerCase() === formData.name.toLowerCase() && 
                           (!editingShape || s.id !== editingShape.id))) {
      newErrors.name = 'Shape name must be unique';
    }

    // Validate coordinates based on shape type
    if (formData.type === 'circle') {
      if (!formData.coordinates.trim()) {
        newErrors.coordinates = 'Center coordinates are required for circles';
      } else if (!/^\d+,\d+$/.test(formData.coordinates.trim())) {
        newErrors.coordinates = 'Circle coordinates must be in format: x,y';
      }
      
      if (!formData.radius || formData.radius <= 0) {
        newErrors.radius = 'Radius must be a positive number';
      }
    } else {
      if (!formData.coordinates.trim()) {
        newErrors.coordinates = 'Coordinates are required';
      } else {
        const coordPairs = formData.coordinates.split(';');
        const minPoints = formData.type === 'triangle' ? 3 : 
                         formData.type === 'rectangle' ? 4 : 3;
        
        if (coordPairs.length < minPoints) {
          newErrors.coordinates = `${formData.type} requires at least ${minPoints} coordinate pairs`;
        }
        
        // Validate coordinate format
        const invalidCoord = coordPairs.find(pair => !/^\d+,\d+$/.test(pair.trim()));
        if (invalidCoord) {
          newErrors.coordinates = 'Coordinates must be in format: x1,y1;x2,y2;x3,y3...';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const shapeData = {
      name: formData.name.trim(),
      type: formData.type,
      coordinates: formData.coordinates.trim(),
      ...(formData.type === 'circle' && { radius: parseFloat(formData.radius) })
    };

    if (editingShape) {
      onUpdateShape({ ...shapeData, id: editingShape.id });
    } else {
      onAddShape(shapeData);
    }

    handleCloseModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getCoordinateDisplay = (shape) => {
    if (shape.type === 'circle') {
      return `Center: ${shape.coordinates}, Radius: ${shape.radius}`;
    }
    return shape.coordinates;
  };

  const isOverlapping = (shapeId) => overlappingShapes.includes(shapeId);

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
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              onClick={() => onDeleteShape(shape.id)}
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
              <Col md={formData.type === 'circle' ? 8 : 12}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {formData.type === 'circle' ? 'Center Coordinates' : 'Coordinates'}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="coordinates"
                    value={formData.coordinates}
                    onChange={handleInputChange}
                    isInvalid={!!errors.coordinates}
                    placeholder={formData.type === 'circle' ? 
                      'x,y (e.g., 100,100)' : 
                      'x1,y1;x2,y2;x3,y3... (e.g., 10,10;100,10;100,100;10,100)'
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.coordinates}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    {formData.type === 'circle' ? 
                      'Enter the center point coordinates' : 
                      'Enter coordinate pairs separated by semicolons'
                    }
                  </Form.Text>
                </Form.Group>
              </Col>
              
              {formData.type === 'circle' && (
                <Col md={4}>
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
                  </Form.Group>
                </Col>
              )}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingShape ? 'Update Shape' : 'Add Shape'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ShapeManager;