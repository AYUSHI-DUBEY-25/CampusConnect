import React, { useState } from "react";
import Layout from "../../components/Layouts/Layout";
import AdminMenu from "../../components/Layouts/AdminMenu";
import { useAuth } from "../../context/auth";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminProfile() {
  const { auth, setAuth } = useAuth();

  const [name, setName] = useState(auth?.user?.name);
  const [email, setEmail] = useState(auth?.user?.email);
  const [phone, setPhone] = useState(auth?.user?.phone);
  const [password, setPassword] = useState("");

  // ==================== HANDLE UPDATE ====================
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.put(
      "/api/v1/auth/profile",
      { name, email, phone, password }
    );

    if (data?.success) {
      toast.success("Profile Updated Successfully");

      // Update auth context + localStorage
      setAuth({ ...auth, user: data.updatedUser });

      let ls = localStorage.getItem("auth");
      ls = JSON.parse(ls);
      ls.user = data.updatedUser;
      localStorage.setItem("auth", JSON.stringify(ls));
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};

  return (
    <Layout>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <AdminMenu />
          </div>

          {/* Main */}
          <div className="col-md-9">

            {/* Profile Update Form */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              }}
            >
              <h4 className="mb-3">Update Profile</h4>

              <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="form-control"
                  />
                  <small className="text-muted">Email cannot be changed.</small>
                </div>

                {/* Phone */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    placeholder="Update your phone number"
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="Enter new password (optional)"
                  />
                  <small className="text-muted">Leave blank to keep existing password.</small>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100">
                  Update Profile
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
