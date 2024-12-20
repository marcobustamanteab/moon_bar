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
import UserProfile from "./components/users/UserProfile";
import ChangePassword from "./components/users/ChangePassword";
import UserManagement from "./components/users/UserManagement";
import CreateUser from "./components/users/CreateUser";
import UpdateUser from "./components/users/UpdateUser";
import UserActivityLog from "./components/users/LogUsers";
import GroupManagement from "./components/users/GroupManagement";
import ProductCategories from "./components/products/ProductCategories";
import CreateProduct from "./components/products/CreateProduct";
import UpdateProduct from "./components/products/UpdateProduct";
import ProductList from "./components/products/ProductList";
import CompanyManagement from "./components/companies/CompanyManagement";

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
            <Route path="users/profile" element={<UserProfile />} />
            <Route path="/users/profile/:id" element={<UserProfile />} />
            <Route path="users/change-password" element={<ChangePassword />} />
            <Route path="admin_site" element={<UserList />} />
            <Route path="users/manage" element={<UserManagement />} />
            <Route path="users/create" element={<CreateUser />} />
            <Route path="users/:id/update" element={<UpdateUser />} />
            <Route path="users/activity-log" element={<UserActivityLog />} />
            <Route path="users/groups" element={<GroupManagement />} />
            <Route path="products/categories" element={<ProductCategories />} />
            <Route path="products/create" element={<CreateProduct />} />
            <Route path="products/:id/update" element={<UpdateProduct />} />
            <Route path="products/list" element={<ProductList />} />
            <Route path="companies" element={<CompanyManagement />} />
          </Route>
        </Routes>
      </Router>
    </LoadingProvider>
  );
}

export default App;
