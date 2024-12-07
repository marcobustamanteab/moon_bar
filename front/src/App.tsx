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
import { Home } from "./pages/Home/Home";


function App() {
  const { isAuthenticated } = useAuth();

  return (
    <LoadingProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
          />
          <Route
            path="/"
            element={
              !isAuthenticated ? <Navigate to="/login" /> : <MainLayout />
            }
          >
            <Route index element={<Home />} />
            <Route path="users" element={<UserList />} />
            <Route path="admin_site" element={<UserList />} />
          </Route>
        </Routes>
      </Router>
    </LoadingProvider>
  );
}

export default App;
