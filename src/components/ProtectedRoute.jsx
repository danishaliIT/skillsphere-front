import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>; // Auth check hone tak ruka rahe

    if (!user) {
        // Agar user login nahi hai, toh login page par bhejo
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;