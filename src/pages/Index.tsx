
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Just redirect to Dashboard
  return <Navigate to="/" replace />;
};

export default Index;
