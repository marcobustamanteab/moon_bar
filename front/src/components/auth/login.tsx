import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AxiosError } from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';
import '../../assets/styles/components/login.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login({ username, password });
      navigate('/');
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.detail || 'Error al iniciar sesión');
      } else {
        setError('Error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img 
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                style={{width: '185px'}} 
                alt="logo" 
              />
              <h4 className="mt-1 mb-5 pb-1">We are The Lotus Team</h4>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <MDBInput 
                wrapperClass='mb-4' 
                label='Usuario'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
              
              <MDBInput 
                wrapperClass='mb-4' 
                label='Contraseña'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />

              <div className="text-center pt-1 mb-5 pb-1">
                <MDBBtn 
                  className="mb-4 w-100 gradient-custom-2" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </MDBBtn>
                <a className="text-muted" href="#!">¿Olvidaste tu contraseña?</a>
              </div>
            </form>
          </div>
        </MDBCol>

        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4">
            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
              <h4 className="mb-4">Somos más que una compañía</h4>
              <p className="small mb-0">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;