import { Navigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard/dashboard';


const PrivateRoute = (Component) => {
    const auth = localStorage.getItem('_token');
    return auth ? <Dashboard /> : <Navigate to="/auth" />
}
export default PrivateRoute