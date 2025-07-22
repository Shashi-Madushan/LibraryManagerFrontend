import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/UseAuth';

import type { ReactNode } from 'react';

const AdminRoute = ({ children }: { children: ReactNode }) => {
    const { isLoggedIn, user } = useAuth();

    // Check if user is authenticated and has an admin role
    if (!isLoggedIn || user?.role !== 'admin') {
        return <Navigate to="/admin/login" />;
    }

    return children;
};

export default AdminRoute;