import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
// Please ensure these paths are correct relative to Dashboard.jsx
import Header from '../../components/Header';
import ShapeManager from '../../components/ShapeManager';
import CanvasView from '../../components/CanvasView';
import { useAuth } from '../../auth/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
 // Import useAuth to potentially handle logout on error


const Dashboard = () => {
  const [activeView, setActiveView] = useState('shapes');
  const [shapes, setShapes] = useState([]);
  const [overlappingShapes, setOverlappingShapes] = useState([]);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchShapes = async () => {
      console.log("fetching shapes");
      try {
        // setLoading(true); // Start loading
        // setError(null);   // Clear previous errors

        const response = await axiosInstance.get('/shapes'); // Call your backend API
        // Assuming your backend returns an array of shape objects directly in response.data
        setShapes(response.data);

      } catch (err) {
        console.error('Error fetching shapes:', err);
        if (err.response && err.response.status === 401) {
          // If token expired or unauthorized, log out the user
          setError('Session expired or unauthorized. Please log in again.');
          // logout(); // Use the logout function from AuthContext
        } else {
          setError('Failed to load shapes. Please try again later.');
        }
      } finally {
        // setLoading(false); // End loading
        console.log("shapes fetched");
      }
    };

    fetchShapes();
  }, []);

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    // Additional cleanup if needed
  };

  const addShape = (newShape) => {
    setShapes(prev => [...prev, newShape]); // Use backend id
  };

  const updateShape = (updatedShape) => {
    setShapes(prev => prev.map(shape =>
      shape.id === updatedShape.id ? updatedShape : shape
    ));
  };

  const deleteShape = async (shapeId) => {
    try {
      // You might want to show a temporary loading state or disable buttons
      // setDeletingShapeId(shapeId); // Example for a specific loading state per shape

      // Make the API call to your backend's DELETE endpoint
      // URL: http://localhost:8080/api/shapes/{shapeId}
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


  const checkOverlaps = async () => {
    try {
      // You might want to show a loading state for this operation too
      // setLoadingOverlaps(true);
      // setErrorOverlaps(null);

      const response = await axiosInstance.get('/shapes/overlaps'); // Adjust this endpoint if needed
      // Assuming the backend returns an array of numbers directly: e.g., [1, 2, 3]
      setOverlappingShapes(response.data);
      console.log("Overlapping shapes fetched:", response.data);

    } catch (err) {
      console.error('Error checking for overlaps:', err);
      
      setOverlappingShapes([]); // Clear overlaps on error
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
