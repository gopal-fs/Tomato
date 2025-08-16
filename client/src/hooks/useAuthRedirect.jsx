import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authContext } from '../context/useContext';

const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { user } = useContext(authContext);

  useEffect(() => {
    if (user === null) {
      toast.error("Please Sign-In First");
      navigate("/");
    }
  }, [user, navigate]);

  return user; 
};

export default useAuthRedirect;
