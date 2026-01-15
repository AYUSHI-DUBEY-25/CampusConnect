import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layouts/Layout";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";
import "./Login.css";


const Login=()=>{
  const {auth, setAuth}= useAuth();
  const [email, setEmail]= useState("");
  const [password, setPassword]= useState("");

  const navigate= useNavigate();
  const location= useLocation();

  //form submit function
  const handleSubmit= async(e)=>{
    e.preventDefault();
    try{
      const res= await axios.post("http://localhost:8080/api/v1/auth/login",{
        email,
        password
      });
      if(res && res.data.success){
        toast.success(res.data && res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      }else{
        toast.error(res.data.message);
      }
    }catch(error){
      console.log(error);
      toast.error("Something went wrong");
    }
  }
  return(
    <Layout title="Login - E-commerce App">
      <div className="login-page d-flex justify-content-center align-items-center">
        <div className="login-card shadow-lg p-4">
          <h2 className="text-center mb-4 login-heading">Welcome Back! Please Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label fw-semibold">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                id="exampleInputEmail1"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="text-center mb-3 ">
  <a
    href="/forget"
    style={{ textDecoration: "none", fontSize: "0.9rem" }}
  >
    Forgot Password?
  </a>
</div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
export default Login;