import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LoadingProvider } from "./context/LoadingContext";
import MainLayout from "./components/layouts/Main";
import UserList from "./components/users/getUserList";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/global.css";
import { useAuth } from "./context/AuthContext";
import Login from "./components/auth/login";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">
        Bienvenido {user?.username} a Mi Aplicación
      </h1>
      <p className="mt-4">Esta es la página principal</p>
    </div>
  );
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <LoadingProvider>
      <Router>
        <Routes>
          {/* Ruta de login */}
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
          />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              !isAuthenticated ? <Navigate to="/login" /> : <MainLayout />
            }
          >
            <Route index element={<Home />} />
            <Route path="users" element={<UserList />} />
          </Route>
        </Routes>
      </Router>
    </LoadingProvider>
  );
}

export default App;
