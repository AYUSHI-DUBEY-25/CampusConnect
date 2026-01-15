import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layouts/Layout.jsx";
import "./Register.css";


const Register=()=>{
  const [name, setName]= useState("");
  const [email, setEmail]= useState("");
  const [password, setPassword]= useState("");
  const [phone, setPhone]= useState("");
  const [address, setAddress]= useState("");
  const [answer, setAnswer]= useState("");

  const navigate= useNavigate();

  //form submit function
  const handleSubmit= async(e)=>{
    e.preventDefault();
    try{
      const res= await axios.post("http://localhost:8080/api/v1/auth/register",{
        name,
        email,
        password,
        phone,
        address,
        answer
      });
      if(res && res.data.success){
        toast.success(res.data.message);
        navigate("/login");
      }else{
        toast.error(res.data.message);
      }
    }catch(error){
      console.log(error);
      toast.error("Something went wrong");
    }
  }
  return(
    <Layout title="Register - E-commerce App">
      <div className="register-page d-flex justify-content-center align-items-center">
        <div className="register-card shadow-lg p-4">
          <h2 className="text-center mb-4 register-heading">Create an Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="exampleInputName1" className="form-label fw-semibold">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                id="exampleInputName1"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label fw-semibold">
                Email Address
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
                placeholder="Create a strong password"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputPhone1" className="form-label fw-semibold">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-control"
                id="exampleInputPhone1"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputAddress1" className="form-label fw-semibold">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-control"
                id="exampleInputAddress1"
                placeholder="Enter your address"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputAnswer1" className="form-label fw-semibold">
                Security Question (Your favorite color?)
              </label>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="form-control"
                id="exampleInputAnswer1"
                placeholder="Enter your answer"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3 register-btn">
              Register Now
            </button>

            <p className="text-center mt-3 small text-muted">
              Already have an account?{" "}
              <span
                className="text-primary fw-semibold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login here
              </span>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  )
}
export default Register;