import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Header from '../../components/Header';
import ShapeManager from '../../components/ShapeManager';
import CanvasView from '../../components/CanvasView';
import { useAuth } from '../../auth/AuthContext';
import axiosInstance from '../../utils/axiosInstance';


const Dashboard = () => {
  const [activeView, setActiveView] = useState('shapes');
  const [shapes, setShapes] = useState([]);
  const [overlappingShapes, setOverlappingShapes] = useState([]);
  const { logout } = useAuth();
// fetch the shapes
  useEffect(() => {
    const fetchShapes = async () => {
      console.log("fetching shapes");
      try {
        

        const response = await axiosInstance.get('/shapes'); 
        setShapes(response.data);

      } catch (err) {
        console.error('Error fetching shapes:', err);
        if (err.response && err.response.status === 401) {
          // If token expired or unauthorized, log out the user
          setError('Session expired or unauthorized. Please log in again.');
          
        } else {
          setError('Failed to load shapes. Please try again later.');
        }
      } finally {
        console.log("shapes fetched");
      }
    };

    fetchShapes();
  }, []);
// logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken');
  };
// add the shape
  const addShape = (newShape) => {
    setShapes(prev => [...prev, newShape]); 
  };
// update the shape
  const updateShape = (updatedShape) => {
    setShapes(prev => prev.map(shape =>
      shape.id === updatedShape.id ? updatedShape : shape
    ));
  };

  const deleteShape = async (shapeId) => {
    try {
      
      await axiosInstance.delete(`/shapes/${shapeId}`);

      // If the API call is successful, then update the local state
      setShapes(prevShapes => prevShapes.filter(shape => shape.id !== shapeId));
      console.log(`Shape with ID ${shapeId} deleted successfully.`);
      checkOverlaps();
     

    } catch (err) {
      console.error('Error deleting shape:', err);
      
      
    } finally {
      console.log("shape deleted");
    }
  };
// check the overlaps

  const checkOverlaps = async () => {
    try {
      

      const response = await axiosInstance.get('/shapes/overlaps'); 
      console.log("Overlapping shapes fetched:", response.data);

    } catch (err) {
      console.error('Error checking for overlaps:', err);
      
      setOverlappingShapes([]); 
    } finally {
      // setLoadingOverlaps(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />

      <Container> 
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
