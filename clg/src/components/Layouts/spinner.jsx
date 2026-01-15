import React, {useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner=({path="login"})=>{
    const [count, setCount]= useState(3);
    const navigate= useNavigate();
    const location= useLocation();

    useEffect(()=>{
        const interval= setInterval(()=>{
            setCount((prevValue)=> --prevValue);
        }, 1000);
        count === 0 && navigate(`/${path}`, {state: location.state});
        return ()=> clearInterval(interval);
    }, [count, navigate, location, path]);

    return(
        <div className="d-flex flex-column justify-content-center align-items-center" style={{height: "70vh"}}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Redirecting you in {count} seconds</p>
        </div>
    );
}
export default Spinner;