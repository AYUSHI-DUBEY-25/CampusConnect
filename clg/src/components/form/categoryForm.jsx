import React from "react";

const CategoryForm=({handleSubmit, value, setValue})=>{
    return(
        <>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter Category" 
                    value={value} 
                    onChange={(e)=> setValue(e.target.value)} 
                    required 
                />
            </div>
            <div className="mb-3">
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
        </form>
        </>
    )
}
export default CategoryForm;