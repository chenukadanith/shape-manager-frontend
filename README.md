# Shape Management System - Frontend

A modern React-based web application for managing and visualizing geometric shapes with real-time overlap detection and canvas rendering.

## 🚀 Features

- **Shape Management**: Create, edit, and delete geometric shapes (rectangles, triangles, circles, polygons)
- **Real-time Canvas View**: Visual representation of shapes with zoom and pan capabilities
- **Overlap Detection**: Automatic detection and highlighting of overlapping shapes
- **User Authentication**: Secure login and signup system
- **Responsive Design**: Modern UI built with React Bootstrap
- **API Integration**: Full CRUD operations with backend REST API

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.0
- **UI Library**: React Bootstrap 2.10.10
- **Icons**: FontAwesome 6.4.0
- **HTTP Client**: Axios 1.10.0
- **Routing**: React Router DOM 7.6.2
- **Build Tool**: Vite 7.0.0
- **Styling**: Bootstrap 5.3.7 + Custom CSS

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Backend API** running on `http://localhost:8080` (see backend documentation)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd ShapeManagementFrontEnd/ShapeFrontEnd
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=Shape Management System
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🔧 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ShapeManager.jsx # Main shape management interface
│   ├── CanvasView.jsx   # Canvas rendering component
│   └── Header.jsx       # Navigation header
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   │   ├── Login.jsx
│   │   └── SignUp.jsx
│   └── Dashboard/      # Main dashboard
│       └── Dashboard.jsx
├── auth/               # Authentication utilities
│   ├── AuthContext.jsx # React context for auth state
│   └── PrivateRoute.jsx # Protected route component
├── utils/              # Utility functions
│   ├── axiosInstance.js # Axios configuration
│   └── shapeValidators.js # Shape validation helpers
└── assets/             # Static assets
```

## 🔐 Authentication

The application uses JWT-based authentication:

- **Login**: Username/password authentication
- **Protected Routes**: Dashboard access requires valid authentication
- **Token Storage**: JWT tokens stored in localStorage
- **Auto-logout**: Automatic logout on token expiration

### Default Test Credentials

For development purposes, you can use any non-empty username and password.

## 📊 Shape Management

### Supported Shape Types

1. **Rectangle**: Requires exactly 4 coordinate pairs
   - Format: `x1,y1;x2,y2;x3,y3;x4,y4`
   - Example: `10,10;100,10;100,100;10,100`

2. **Triangle**: Requires exactly 3 coordinate pairs
   - Format: `x1,y1;x2,y2;x3,y3`
   - Example: `50,50;100,50;75,100`

3. **Circle**: Requires center coordinates and radius
   - Center X, Y: Numeric coordinates
   - Radius: Positive number

4. **Polygon**: Requires minimum 3 coordinate pairs
   - Format: `x1,y1;x2,y2;x3,y3;...`
   - Example: `10,10;50,10;50,50;10,50`

### Coordinate System

- **Origin**: Top-left corner (0,0)
- **Units**: Pixels
- **Format**: `x,y` pairs separated by semicolons
- **Validation**: All coordinates must be non-negative numbers

## 🎨 Canvas Features

- **Zoom Controls**: Zoom in/out and reset zoom
- **Grid Display**: Visual grid for coordinate reference
- **Shape Highlighting**: Overlapping shapes highlighted in red
- **Responsive Design**: Canvas adapts to container size
- **Shape Labels**: Each shape displays its name

## 🔄 API Integration

### Endpoints

- `GET /api/shapes` - Fetch all shapes
- `POST /api/shapes` - Create new shape
- `PUT /api/shapes/{id}` - Update existing shape
- `DELETE /api/shapes/{id}` - Delete shape
- `GET /api/shapes/overlaps` - Get overlapping shapes

### Request/Response Format

**Create Shape (POST):**
```json
{
  "name": "MyRectangle",
  "type": "rectangle",
  "coordinates": "10,10;100,10;100,100;10,100",
  "centerX": null,
  "centerY": null,
  "radius": null
}
```

**Update Shape (PUT):**
```json
{
  "id": 12,
  "name": "UpdatedRectangle",
  "type": "rectangle",
  "coordinates": "10,10;100,10;100,100;10,100",
  "centerX": null,
  "centerY": null,
  "radius": null
}
```

## 🧪 Testing

### Manual Testing Checklist

1. **Authentication**
   - [ ] Login with valid credentials
   - [ ] Login with invalid credentials
   - [ ] Signup new user
   - [ ] Logout functionality

2. **Shape Management**
   - [ ] Create rectangle with valid coordinates
   - [ ] Create triangle with valid coordinates
   - [ ] Create circle with valid center and radius
   - [ ] Create polygon with valid coordinates
   - [ ] Edit existing shape
   - [ ] Delete shape
   - [ ] Validation error messages

3. **Canvas View**
   - [ ] Shapes render correctly
   - [ ] Zoom in/out functionality
   - [ ] Overlap detection
   - [ ] Shape labels display
   - [ ] Responsive canvas sizing

### Run Tests

```bash
npm run test
```



### Security Assumptions

1. **Authentication**
   - JWT tokens for session management
   - Protected routes for sensitive operations
   - Automatic token refresh handling

2. **Input Validation**
   - Client-side validation for UX
   - Server-side validation for security
   - Sanitization of user inputs



## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

---

**Happy Shape Managing! 🎨**
