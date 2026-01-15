import React, { useState, useEffect } from "react";
import Usermenu from "../../components/Layouts/UserMenu";
import Layout from "../../components/Layouts/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Load user values
  useEffect(() => {
    const { name, email, phone, address } = auth?.user;
    setName(name);
    setPhone(phone);
    setEmail(email);
    setAddress(address);
  }, [auth?.user]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        "http://localhost:8080/api/v1/auth/profile",
        { name, email, password, phone, address }
      );

      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });

        let ls = JSON.parse(localStorage.getItem("auth"));
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));

        toast.success("Profile Updated Successfully");
        navigate("/dashboard/user");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Your Profile">

      {/* ⭐ INLINE CSS ⭐ */}
      <style>
        {`
          .profile-page-bg {
            background: linear-gradient(to bottom right, #fafafa, #ffeef5);
            min-height: 100vh;
            padding: 30px;
          }

          .profile-card {
            background: #ffffff;
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0px 6px 20px rgba(0,0,0,0.08);
            border: 1px solid #f2f2f2;
          }

          .profile-title {
            color: #d81b60;
            font-weight: 700;
            font-size: 24px;
            margin-bottom: 20px;
          }

          .form-control {
            border-radius: 10px !important;
            border: 1px solid #e0e0e0 !important;
            padding: 10px !important;
            font-size: 15px !important;
          }

          .form-control:focus {
            border-color: #d81b60 !important;
            box-shadow: 0 0 4px rgba(216, 27, 96, 0.3) !important;
          }

          .btn-primary {
            background-color: #d81b60 !important;
            border: none !important;
            padding: 10px 16px;
            border-radius: 10px;
            font-weight: 600;
          }

          .btn-primary:hover {
            background-color: #ad1457 !important;
          }
        `}
      </style>

      <div className="profile-page-bg">
        <div className="container-fluid">
          <div className="row">

            {/* Sidebar */}
            <div className="col-md-3">
              <Usermenu />
            </div>

            {/* Profile Card */}
            <div className="col-md-8">
              <div className="profile-card">
                <h4 className="profile-title">Your Profile</h4>

                <form onSubmit={handleSubmit}>
                  
                  <div className="mb-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="email"
                      value={email}
                      className="form-control"
                      placeholder="Email"
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-control"
                      placeholder="Enter phone"
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="form-control"
                      placeholder="Enter address"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Update Profile
                  </button>

                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
