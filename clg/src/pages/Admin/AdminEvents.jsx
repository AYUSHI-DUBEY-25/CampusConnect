// import React, {useState, useEffect  } from "react";
// import AdminMenu from "../../components/Layouts/AdminMenu";
// import Layout from "../../components/Layouts/Layout";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { toast } from "react-hot-toast";

// const Products=()=>{
//     const [products, setProducts]= useState([]);

//     //get all products
//     const getAllProducts= async(req,res)=>{
//         try{
//             const {data}= await axios.get("http://localhost:8080/api/v1/event/get-event");
//             setProducts(data.events);
//         } catch (error) {
//             console.log(error);
//             toast.error("Something went wrong while fetching events");
//         }
//     }
//     useEffect(()=>{
//         getAllProducts();
//     }, []);
//     return(
//         <Layout>
//             <div className="row dashboard">
//                 <div className="col-md-3">
//                     <AdminMenu />
//                 </div>
//                 <div className="col-md-9">
//                     <h1 className="text-center">All Events List</h1>
//                     <div className="d-flex flex-wrap">
//                         {products?.map((p)=>(
//                             <Link
//                                 key={p._id}
//                                 to={`/dashboard/admin/event/${p.slug}`}
//                                 className="product-link"
//                             >
//                                 <div className="card m-2" style={{ width: "18rem" }}>
//                                     <img
//                                         src={`http://localhost:8080/api/v1/event/event-photo/${p._id}`}
//                                         className="card-img-top"
//                                         alt={p.name}
//                                     />
//                                     <div className="card-body">
//                                         <h5 className="card-title">{p.name}</h5>
//                                         <p className="card-text">{p.description}</p>
//                                     </div>
//                                 </div>
//                             </Link>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </Layout>
//     )
// }
// export default Products;

import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layouts/AdminMenu";
import Layout from "../../components/Layouts/Layout";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]);

  // get all events
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/event/get-event`
      );
      setProducts(data.events);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching events");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <div className="row dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Events List</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <Link
                key={p._id}
                to={`/dashboard/admin/event/${p.slug}`}
                className="product-link"
              >
                <div className="card m-2" style={{ width: "18rem" }}>
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/event/event-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
