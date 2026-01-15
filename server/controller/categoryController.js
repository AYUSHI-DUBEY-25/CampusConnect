import categorymodel from "../models/categorymodel.js";
import slugify from "slugify";

// Create Category Controller
export const createCategoryController= async(req,res)=>{
    try{
        const {name}= req.body;
        if(!name){
            return res.status(401).send({message:"Name is required"});
        }
        const existigCategory= await categorymodel.findOne({name});
        if(existigCategory){
            return res.status(200).send({
                success:true,
                message:"Category already exists"
            });
        }
        const category= await new categorymodel({name, slug:slugify(name)}).save();
        res.status(201).send({
            success:true,
            message:"New Category created",
            category,
        });
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error in Category",
            error,
        });
    }
}
//get all categories controller
export const categoryController= async(req,res)=>{
    try{
        const category= await categorymodel.find({});
        res.status(200).send({
            success:true,
            message:"All Categories List",
            category,
        });
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error in Category",
            error,
        });
    }
}
//get single category controller
export const singleCategoryController= async(req,res)=>{
    try{
        const category = await categorymodel.findOne({slug:req.params.slug});
        res.status(200).send({
            success:true,
            message:"Get Single Category Successfully",
            category,
        });
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error in Category",
            error,
        });
    }
}
//delete category controller
export const deleteCategoryController= async(req,res)=>{
    try{
        const {id}= req.params;
        await categorymodel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:"Category Deleted Successfully",
        });
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error in Category",
            error,
        });
    }
}
//update category controller
export const updateCategoryController= async(req,res)=>{
    try{
        const {name}= req.body;
        const {id}= req.params;
        const category= await categorymodel.findByIdAndUpdate(id,{name, slug:slugify(name)},{new:true});
        res.status(200).send({
            success:true,
            message:"Category Updated Successfully",
            category,
        });
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error in Category",
            error,
        });
    }
}