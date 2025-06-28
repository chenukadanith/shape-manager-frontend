import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Row, Col, Badge, Alert, ButtonGroup } from 'react-bootstrap';

const CanvasView = ({ shapes, overlappingShapes, onCheckOverlaps }) => {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const maxWidth = container.clientWidth - 40; 
        const maxHeight = 600;
        
        setCanvasSize({
          width: Math.min(maxWidth, 800),
          height: maxHeight
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    drawShapes();
  }, [shapes, overlappingShapes, canvasSize, scale]);

  // draw the shapes
  const drawShapes = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx);

    // Draw shapes
    shapes.forEach(shape => {
      const isOverlapping = overlappingShapes.includes(shape.id);
      drawShape(ctx, shape, isOverlapping);
    });
  };

  const drawGrid = (ctx) => {
    const gridSize = 20 * scale;
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;

    // Vertical lines
    for (let x = 0; x <= canvasSize.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasSize.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= canvasSize.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasSize.width, y);
      ctx.stroke();
    }
  };

  const drawShape = (ctx, shape, isOverlapping) => {
    ctx.save();
    
    // Set colors based on overlap status
    if (isOverlapping) {
      ctx.strokeStyle = '#dc3545'; // Red for overlapping
      ctx.fillStyle = 'rgba(220, 53, 69, 0.2)';
      ctx.lineWidth = 3;
    } else {
      ctx.strokeStyle = '#007bff'; // Blue for normal
      ctx.fillStyle = 'rgba(0, 123, 255, 0.1)';
      ctx.lineWidth = 2;
    }

    try {
      switch (shape.type) {
        case 'rectangle':
          drawRectangle(ctx, shape);
          break;
        case 'triangle':
          drawTriangle(ctx, shape);
          break;
        case 'circle':
          drawCircle(ctx, shape);
          break;
        case 'polygon':
          drawPolygon(ctx, shape);
          break;
        default:
          console.warn(`Unknown shape type: ${shape.type}`);
      }

      // Draw shape label
      drawShapeLabel(ctx, shape, isOverlapping);
    } catch (error) {
      console.error(`Error drawing shape ${shape.name}:`, error);
    }

    ctx.restore();
  };

  const parseCoordinates = (coordinateString) => {
    return coordinateString.split(';').map(pair => {
      const [x, y] = pair.trim().split(',').map(Number);
      return { x: x * scale, y: y * scale };
    });
  };

  const drawRectangle = (ctx, shape) => {
    const coords = parseCoordinates(shape.coordinates);
    if (coords.length < 4) return;

    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    for (let i = 1; i < coords.length; i++) {
      ctx.lineTo(coords[i].x, coords[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const drawTriangle = (ctx, shape) => {
    const coords = parseCoordinates(shape.coordinates);
    if (coords.length < 3) return;

    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    for (let i = 1; i < Math.min(coords.length, 3); i++) {
      ctx.lineTo(coords[i].x, coords[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const drawPolygon = (ctx, shape) => {
    const coords = parseCoordinates(shape.coordinates);
    if (coords.length < 3) return;

    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    for (let i = 1; i < coords.length; i++) {
      ctx.lineTo(coords[i].x, coords[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const drawCircle = (ctx, shape) => {
    const centerX = shape.centerX * scale;
    const centerY = shape.centerY * scale;
    const radius = shape.radius * scale;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  };

  const drawShapeLabel = (ctx, shape, isOverlapping) => {
    let labelX, labelY;

    if (shape.type === 'circle') {
      labelX = shape.centerX * scale;
      labelY = shape.centerY * scale;
    } else {
      const coords = parseCoordinates(shape.coordinates);
      labelX = coords.reduce((sum, coord) => sum + coord.x, 0) / coords.length;
      labelY = coords.reduce((sum, coord) => sum + coord.y, 0) / coords.length;
    }

    ctx.save();
    ctx.fillStyle = isOverlapping ? '#dc3545' : '#007bff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw background for text
    const textMetrics = ctx.measureText(shape.name);
    const padding = 4;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(
      labelX - textMetrics.width / 2 - padding,
      labelY - 6 - padding,
      textMetrics.width + padding * 2,
      12 + padding * 2
    );

    // Draw text
    ctx.fillStyle = isOverlapping ? '#dc3545' : '#007bff';
    ctx.fillText(shape.name, labelX, labelY);
    ctx.restore();
  };
//common functions
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid(ctx);
    }
  };

  const getOverlapInfo = () => {
    if (overlappingShapes.length === 0) return null;
    
    const overlappingShapeNames = shapes
      .filter(shape => overlappingShapes.includes(shape.id))
      .map(shape => shape.name);
    
    return overlappingShapeNames;
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">Canvas View</h4>
          <small className="text-muted">
            Scale: {Math.round(scale * 100)}% | Shapes: {shapes.length}
          </small>
        </div>
        <ButtonGroup>
          <Button variant="outline-secondary" onClick={handleZoomOut}>
            <i className="fas fa-search-minus"></i>
          </Button>
          <Button variant="outline-secondary" onClick={handleResetZoom}>
            <i className="fas fa-compress-arrows-alt"></i>
          </Button>
          <Button variant="outline-secondary" onClick={handleZoomIn}>
            <i className="fas fa-search-plus"></i>
          </Button>
          <Button variant="info" onClick={onCheckOverlaps}>
            <i className="fas fa-search me-1"></i>
            Check Overlaps
          </Button>
          <Button variant="outline-warning" onClick={clearCanvas}>
            <i className="fas fa-eraser"></i>
          </Button>
        </ButtonGroup>
      </Card.Header>
      
      <Card.Body>
        {/* Overlap Status */}
        {overlappingShapes.length > 0 && (
          <Alert variant="warning" className="mb-3">
            <div className="d-flex align-items-center">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <div>
                <strong>Overlapping Shapes Detected!</strong>
                <div className="mt-1">
                  {getOverlapInfo()?.map((name, index) => (
                    <Badge key={index} bg="warning" className="me-1">
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Alert>
        )}

        {shapes.length === 0 ? (
          <Alert variant="info" className="text-center">
            <i className="fas fa-info-circle me-2"></i>
            No shapes to display. Add some shapes in the Shape Management view to see them here.
          </Alert>
        ) : (
          <div className="text-center">
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              style={{
                border: '2px solid #dee2e6',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                maxWidth: '100%',
                height: 'auto'
              }}
            />
          </div>
        )}

        {/* Legend */}
        <Row className="mt-3">
          <Col>
            <div className="d-flex justify-content-center gap-4">
              <div className="d-flex align-items-center">
                <div 
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    border: '2px solid #007bff',
                    marginRight: '8px'
                  }}
                ></div>
                <small>Normal Shapes</small>
              </div>
              <div className="d-flex align-items-center">
                <div 
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'rgba(220, 53, 69, 0.2)',
                    border: '3px solid #dc3545',
                    marginRight: '8px'
                  }}
                ></div>
                <small>Overlapping Shapes</small>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CanvasView;