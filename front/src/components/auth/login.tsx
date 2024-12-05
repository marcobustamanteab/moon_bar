import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AxiosError } from 'axios';
import { Moon } from 'lucide-react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';
import { useLoading } from '../../context/LoadingContext';
import '../../assets/styles/components/login.css';

interface FormEvent extends React.FormEvent<HTMLFormElement> {
  preventDefault(): void;
}

interface InputEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setLoading } = useLoading();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    setLoading(true); // Activar el loading global

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
      setIsSubmitting(false);
      setLoading(false); // Desactivar el loading global
    }
  };

  const handleUsernameChange = (e: InputEvent) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: InputEvent) => {
    setPassword(e.target.value);
  };

  return (
    <MDBContainer fluid className="gradient-form">
      <div className="login-container">
        <MDBRow className="h-100">
          <MDBCol col='6'>
            <div className="login-form-container">
              <div className="text-center">
                <div className="logo-container">
                  <Moon size={30} color="white" />
                </div>
                <h2 className="form-heading">Moon Bar</h2>
                <p className="form-subheading">Tu espacio bajo la luz de la luna</p>
              </div>

              <form onSubmit={handleSubmit} className="form-content">
                <div className="error-container">
                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}
                </div>

                <div className="inputs-container">
                  <MDBInput
                    wrapperClass='mb-4'
                    label='Usuario'
                    value={username}
                    onChange={handleUsernameChange}
                    disabled={isSubmitting}
                    required
                    className="input-field"
                    contrast
                  />

                  <MDBInput
                    wrapperClass='mb-4'
                    label='Contraseña'
                    type='password'
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={isSubmitting}
                    required
                    className="input-field"
                    contrast
                  />
                </div>

                <div className="button-container">
                  <MDBBtn
                    className="login-button"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Iniciando sesión...' : 'Ingresar'}
                  </MDBBtn>
                  <a className="forgot-password" href="#!">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </form>
            </div>
          </MDBCol>

          <MDBCol col='6'>
            <div className="side-content">
              <h4 className="mb-4">Bienvenido a Moon Bar</h4>
              <p className="small mb-0">
                Descubre un espacio único bajo la luz de la luna. Donde cada noche 
                es una experiencia memorable y cada momento cuenta una historia.
              </p>
            </div>
          </MDBCol>
        </MDBRow>
      </div>
    </MDBContainer>
  );
};

export default Login;