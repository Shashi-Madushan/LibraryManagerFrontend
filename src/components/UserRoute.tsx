import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/UseAuth';

import type { ReactNode } from 'react';

const UserRoute = ({ children }: { children: ReactNode }) => {
    const { isLoggedIn, user } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    // If user is an admin, redirect them to admin dashboard
    if (user?.role === 'admin') {
        return <Navigate to="/admin" />;
    }

    return children;
};

export default UserRoute;
