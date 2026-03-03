import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layouts/Layout";
import { useAuth } from "../../context/auth";
import "./Login.css";

const Login = () => {
  const { auth, setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  //login function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/login`,
        {
          email,
          password,
        }
      );

      if (data?.success) {
        toast.success(data.message);

        setAuth({
          ...auth,
          user: data.user,
          token: data.token,
        });
        axios.defaults.headers.common["Authorization"] =
  `Bearer ${data.token}`;
        localStorage.setItem("auth", JSON.stringify(data));

        navigate(location.state || "/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Login - CampusConnect">
      <div className="login-page d-flex justify-content-center align-items-center">
        <div className="login-card shadow-lg p-4">
          <h2 className="text-center mb-4 login-heading">
            Welcome Back! Please Login
          </h2>

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-center mb-3">
              <span
                onClick={() => navigate("/forget")}
                style={{
                  cursor: "pointer",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
                className="text-primary"
              >
                Forgot Password?
              </span>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;