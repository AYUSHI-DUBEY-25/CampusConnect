// import React, {useState} from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import Layout from "../../components/Layouts/Layout.jsx";

// const Forget=()=>{
//   const [email, setEmail]= useState("");
//   const [answer, setAnswer]= useState("");
//   const [newPassword, setNewPassword]= useState("");
//   const navigate= useNavigate();

//   //form submit function
//   const handleSubmit= async(e)=>{
//     e.preventDefault();
//     try{
//       const res= await axios.post("http://localhost:8080/api/v1/auth/forget",{
//         email,
//         answer,
//         newPassword,
//       });
//       if(res && res.data.success){
//         toast.success(res.data.message);
//         navigate("/login");
//       }else{
//         toast.error(res.data.message);
//       }
//     }catch(error){
//       console.log(error);
//       toast.error("Something went wrong");
//     }
//   }
//   return(
//     <Layout title="Forgot Password - E-commerce App">
//       <div className="forget-page d-flex justify-content-center align-items-center">
//         <div className="forget-card shadow-lg p-4">
//           <h2 className="text-center mb-3 forget-heading">🔑 Reset Your Password</h2>
//           <p className="text-center text-muted mb-4">
//             Enter your registered email, security answer, and new password.
//           </p>

//           <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label htmlFor="exampleInputEmail1" className="form-label fw-semibold">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="form-control"
//                 id="exampleInputEmail1"
//                 placeholder="Enter your registered email"
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="exampleInputAnswer1" className="form-label fw-semibold">
//                 Security Answer
//               </label>
//               <input
//                 type="text"
//                 value={answer}
//                 onChange={(e) => setAnswer(e.target.value)}
//                 className="form-control"
//                 id="exampleInputAnswer1"
//                 placeholder="Enter your security answer"
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">
//                 New Password
//               </label>
//               <input
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="form-control"
//                 id="exampleInputPassword1"
//                 placeholder="Enter your new password"
//                 required
//               />
//             </div>

//             <button type="submit" className="btn btn-primary w-100 mt-2 forget-btn">
//               Reset Password
//             </button>

//             <p className="text-center mt-3 small text-muted">
//               Remember your password?{" "}
//               <span
//                 className="text-primary fw-semibold"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => navigate("/login")}
//               >
//                 Login here
//               </span>
//             </p>
//           </form>
//         </div>
//       </div>
//     </Layout>
//   )
// }
// export default Forget;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layouts/Layout.jsx";

const Forget = () => {
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  // ==================== FORM SUBMIT ====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/forget`,
        {
          email,
          answer,
          newPassword,
        }
      );

      if (data?.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Forgot Password - CampusConnect">
      <div className="forget-page d-flex justify-content-center align-items-center">
        <div className="forget-card shadow-lg p-4">
          <h2 className="text-center mb-3 forget-heading">
            🔑 Reset Your Password
          </h2>
          <p className="text-center text-muted mb-4">
            Enter your registered email, security answer, and new password.
          </p>

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Enter your registered email"
                required
              />
            </div>

            {/* SECURITY ANSWER */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Security Answer
              </label>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="form-control"
                placeholder="Enter your security answer"
                required
              />
            </div>

            {/* NEW PASSWORD */}
            <div className="mb-3">
              <label className="form-label fw-semibold">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-control"
                placeholder="Enter your new password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mt-2 forget-btn"
            >
              Reset Password
            </button>

            <p className="text-center mt-3 small text-muted">
              Remember your password?{" "}
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
  );
};

export default Forget;
