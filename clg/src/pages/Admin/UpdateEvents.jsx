import React, {useState, useEffect} from "react";
import AdminMenu from "../../components/Layouts/AdminMenu";
import Layout from "../../components/Layouts/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {Select} from "antd";

const updateEvents=()=>{
    const navigate= useNavigate();
    const params= useParams();
    const [categories, setCategories]= useState([]);
    const [name, setName]= useState("");
    const [description, setDescription]= useState("");
    const [price, setPrice]= useState("");
    const [category, setCategory]= useState("");
    const [date, setDate]= useState("");
    const [photo, setPhoto]= useState("");  
    const [id, setId]= useState("");
    // add near other states
const [ticketsAvailable, setTicketsAvailable] = useState(0);


const getSingleEvent = async () => {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/api/v1/event/get-event/${params.slug}`
    );

    const eventData = data.event;

    setId(eventData._id);
    setName(eventData.name);
    setDescription(eventData.description);
    setPrice(eventData.price);
    setCategory(eventData.category?._id || "");
    setTicketsAvailable(eventData.ticketsAvailable ?? 0); 


    let formattedDate = "";
    if (eventData.date) {
      formattedDate = new Date(eventData.date).toISOString().split("T")[0];
    }

    setDate(formattedDate);
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while fetching event details");
  }
};
 useEffect(()=>{
      getSingleEvent();
    },[]);


    //get all event categories
    const getAllCategory= async()=>{
      try{
        const {data}= await axios.get("http://localhost:8080/api/v1/category/get-category");
        if(data?.success){
          setCategories(data?.category);
        }
      }catch(error){
        console.log(error);
        toast.error("Something went wrong while fetching categories");
      }
    }
    useEffect(()=>{
      getAllCategory();
    },[]);
    //update event fn
    const handleUpdate= async(e)=>{
      e.preventDefault();
      try{
        const eventData= new FormData();
        eventData.append("name",name);
        eventData.append("description",description);
        eventData.append("date",date);
        eventData.append("price",price);
        eventData.append("category", category);
        eventData.append("ticketsAvailable", ticketsAvailable);

        if (photo) {
      eventData.append("photo", photo);
    }
        const {data}= await axios.put(`http://localhost:8080/api/v1/event/update-event/${id}`, eventData,{
          headers: {
          // Not strictly required, but explicit and safe:
          "Content-Type": "multipart/form-data",
        },
        })
        if(data?.success){
          toast.error(data?.message)
        }else{
          toast.success(data?.message)
          navigate("/dashboard/admin/events")
        }
      }catch(error){
        console.log(error)
        toast.error("error")
      }
    }
    //delete product
   const handleDelete = async () => {
  try {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    const { data } = await axios.delete(`http://localhost:8080/api/v1/event/delete-event/${id}`);
    toast.success("Event deleted successfully");
    navigate("/dashboard/admin/events");
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
}
    return(
      <Layout title={"Dashboard- Create Events"}>
        <div className="container fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <h1>Update Events</h1>
              <div className="m-1 w-75">
                <Select bordered={false} placeholder="Select category" size="large" showSearch className="form-select mb-3" onChange={(value)=>{
                  setCategory(value)
                }}
                value={category}>
                  {categories?.map((c)=>(
                    <Option key={c._id} value={c._id}>{c.name}</Option>
                  ))}
                </Select>
                <div className="mb-3">
                  <label className="btn btn-outline-secondary col-md-12">
                    {photo?photo.name:"upload photo"}
                    <input type="file" name="photo" accept="image/*" onChange={(e)=>setPhoto(e.target.files[0])} hidden/>
                  </label>
                </div>
                <div className="mb-3">
                  {photo?(
                    <div className="text-center">
                      <img src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"/>
                      </div>
                  ):(
                    <div className="text-center">
                      <img src={`http://localhost:8080/api/v1/event/event-photo/${id}`}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"/>
                      </div>
                  )}
                </div>
                <div className="mb-3">
                  <input type="text" value={name}
                  placeholder="Enter name" className="form-control" onChange={(e)=>setName(e.target.value)}/>
                </div>
                <div className="mb-3">
                  <input type="text" value={description}
                  placeholder="Enter description" className="form-control" onChange={(e)=>setDescription(e.target.value)}/>
                </div>
                <div className="mb-3">
                  <input type="number" value={price}
                  placeholder="Enter price" className="form-control" onChange={(e)=>setPrice(e.target.value)}/>
                </div>
                <div className="mb-3">
                  <input type="date" value={date}
                  placeholder="Enter date" className="form-control" onChange={(e)=>setDate(e.target.value)}/>
                </div>
                <div className="mb-3">
  <label className="form-label">Tickets available</label>
  <input
    type="number"
    min={0}
    value={ticketsAvailable}
    onChange={(e) => setTicketsAvailable(Math.max(0, Math.floor(Number(e.target.value || 0))))}
    placeholder="Enter number of tickets"
    className="form-control"
  />
</div>
              <div className="mb-3">
                <button className="btn btn-primary"onClick={handleUpdate}>Update</button>
              </div>
              <div className="mb-3">
                <button className="btn btn-danger"onClick={handleDelete}>Delete</button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
}
export default updateEvents;