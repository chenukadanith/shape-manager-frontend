import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
// Please ensure these paths are correct relative to Dashboard.jsx
import Header from '../../components/Header';
import ShapeManager from '../../components/ShapeManager';
import CanvasView from '../../components/CanvasView';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('shapes');
  const [shapes, setShapes] = useState([]);
  const [overlappingShapes, setOverlappingShapes] = useState([]);

  // Mock data for development - replace with actual API calls
  useEffect(() => {
    // Simulate loading shapes from backend
    const mockShapes = [
      {
        id: 1,
        name: 'Rectangle 1',
        type: 'rectangle',
        coordinates: '100,100;200,100;200,150;100,150'
      },
      {
        id: 2,
        name: 'Circle 1',
        type: 'circle',
        coordinates: '150,125',
        radius: 30
      }
    ];
    setShapes(mockShapes);
  }, []);

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    // Additional cleanup if needed
  };

  const addShape = (newShape) => {
    const shapeWithId = { ...newShape, id: Date.now() };
    setShapes(prev => [...prev, shapeWithId]);
  };

  const updateShape = (updatedShape) => {
    setShapes(prev => prev.map(shape =>
      shape.id === updatedShape.id ? updatedShape : shape
    ));
  };

  const deleteShape = (shapeId) => {
    setShapes(prev => prev.filter(shape => shape.id !== shapeId));
  };

  const checkOverlaps = async () => {
    // TODO: Call backend API to check for overlaps
    // For now, mock some overlapping shapes
    const mockOverlaps = [1,2]; // IDs of overlapping shapes
    setOverlappingShapes(mockOverlaps);
  };

  return (
    <div className="min-vh-100 bg-light">
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />

      <Container> {/* Using React-Bootstrap Container */}
        {activeView === 'shapes' && (
          <ShapeManager
            shapes={shapes}
            onAddShape={addShape}
            onUpdateShape={updateShape}
            onDeleteShape={deleteShape}
            overlappingShapes={overlappingShapes}
            onCheckOverlaps={checkOverlaps}
          />
        )}

        {activeView === 'canvas' && (
          <CanvasView
            shapes={shapes}
            overlappingShapes={overlappingShapes}
            onCheckOverlaps={checkOverlaps}
          />
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
