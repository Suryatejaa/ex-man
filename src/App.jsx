import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import LoadingIndicator from './components/LoadingIndicator';
import Cookies from "js-cookie";
import apiClient from "./utilis/apiClient";

import './App.css';

const Home = lazy(() => import('./pages/home'));
const Login = lazy(() => import('./pages/login'));
const SignUp = lazy(() => import('./pages/signup'));
const Dashboard = lazy(() => import('./pages/dashboard'));

function App() {


  const refreshTokenOnLoad = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      if (refreshToken) {
        const response = await apiClient.post("/users/refreshtoken", { refreshToken });
        const newToken = response.data.token;
        Cookies.set("token", newToken);
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      }
    } catch (error) {
      console.error("Error refreshing token on load:", error);
    }
  };

  refreshTokenOnLoad();

  return (

    <Router>
      <Suspense fallback={<div><LoadingIndicator /></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </Router>

  );

}

export default App;





