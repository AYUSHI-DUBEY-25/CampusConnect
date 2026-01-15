// import React, {useState,useEffect} from "react";
// import Layout from "../../components/Layouts/Layout";
// import AdminMenu from "../../components/Layouts/AdminMenu";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { Select } from "antd";
// import { useNavigate } from "react-router-dom";

// const { Option } = Select;

// const CreateEvents=()=>{
//   const navigate= useNavigate();
//   const [categories,setCategories]= useState([]);
//   const [name,setName]= useState("");
//   const [description,setDescription]= useState("");
//   const [date,setDate]= useState("");
//   const [category,setCategory]= useState("");
//   const [price, setPrice] = useState("");
//   const [image,setImage]= useState(null);

//     //get all categories
//   const getAllCategories= async()=>{
//     try {
//       const {data}= await axios.get("http://localhost:8080/api/v1/category/get-category");
//       if(data?.success){
//         setCategories(data.category);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong while fetching categories");
//     }
//   };
//   useEffect(()=>{
//     getAllCategories();
//   },[]);
//   //create event function
//   const handleCreate= async(e)=>{
//     e.preventDefault();
//     try {
//       const eventData= new FormData();
//       eventData.append("name",name);
//       eventData.append("price", price);
//       eventData.append("description",description);
//       eventData.append("date",date);
//       eventData.append("category",category);
//       eventData.append("photo",image);
//       const {data}= await axios.post("http://localhost:8080/api/v1/event/create-event",eventData);
//       if(data?.success){
//         toast.success("Event Created Successfully");
//         navigate("/dashboard/admin/events");
//       } else{
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong while creating event");
//     }
//   }
//     return(
//         <Layout title={"Create Events - Admin"}>
//           <div className="container-fluid m-3 p-3">
//             <div className="row">
//               <div className="col-md-3">
//                 <AdminMenu />
//               </div>
//               <div className="col-md-9">
//                 <h1>Create Events</h1>
//                 <div className="m-1 w-75">
//                   <Select
//                     bordered={false}
//                     placeholder="Select a category"
//                     size="large"
//                     showSearch
//                     className="form-select mb-3"
//                     onChange={(value) => {
//                       setCategory(value);
//                     }}
//                   >
//                     {categories.map((c) => (
//                       <Option key={c._id} value={c._id}>
//                         {c.name}
//                       </Option>
//                     ))}
//                   </Select>
//                   <div className="mb-3">
//                     <label className="btn btn-outline-secondary col-md-12">
//                       {image ? image.name : "Upload Event Image"}
//                       <input 
//                         type="file"
//                         name="photo"
//                         accept="image/*"
//                         onChange={(e) => setImage(e.target.files[0])}
//                         hidden
//                       />
//                     </label>
//                   </div>
//                   <div className="mb-3">
//                     {image && (
//                       <div className="text-center">
//                         <img
//                           src={URL.createObjectURL(image)}
//                           alt="Event"
//                           height={"200px"}
//                           className="img img-responsive"
//                         />
//                       </div>
//                     )}
//                   </div>
//                   <div className="mb-3">
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Event Name"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                     />
//                   </div>
//                   <div className="mb-3">
//   <input
//     type="number"
//     className="form-control"
//     placeholder="Event Price"
//     value={price}
//     onChange={(e) => setPrice(e.target.value)}
//   />
// </div>

//                   <div className="mb-3">
//                     <textarea
//                       className="form-control"
//                       placeholder="Event Description"
//                       value={description}
//                       onChange={(e) => setDescription(e.target.value)}
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <input
//                       type="date"
//                       className="form-control"
//                       placeholder="Event Date"
//                       value={date}
//                       onChange={(e) => setDate(e.target.value)}
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <button className="btn btn-primary" onClick={handleCreate}>
//                       Create Event
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Layout>
//     )
// }
// export default CreateEvents;
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layouts/Layout";
import AdminMenu from "../../components/Layouts/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

const { Option } = Select;

const CreateEvents = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  // ==================== GET ALL CATEGORIES ====================
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/category/get-category`
      );

      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching categories");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  // ==================== CREATE EVENT ====================
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const eventData = new FormData();
      eventData.append("name", name);
      eventData.append("price", price);
      eventData.append("description", description);
      eventData.append("date", date);
      eventData.append("category", category);
      eventData.append("photo", image);

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/event/create-event`,
        eventData,
        {
          headers: {
            Authorization: auth?.token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.success) {
        toast.success("Event Created Successfully");
        navigate("/dashboard/admin/events");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while creating event");
    }
  };

  return (
    <Layout title={"Create Events - Admin"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>

          <div className="col-md-9">
            <h1>Create Events</h1>

            <div className="m-1 w-75">
              {/* CATEGORY */}
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => setCategory(value)}
              >
                {categories.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              {/* IMAGE */}
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {image ? image.name : "Upload Event Image"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>

              {image && (
                <div className="mb-3 text-center">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Event"
                    height="200px"
                    className="img img-responsive"
                  />
                </div>
              )}

              {/* NAME */}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Event Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* PRICE */}
              <div className="mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Event Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="mb-3">
                <textarea
                  className="form-control"
                  placeholder="Event Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* DATE */}
              <div className="mb-3">
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {/* SUBMIT */}
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleCreate}>
                  Create Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateEvents;
