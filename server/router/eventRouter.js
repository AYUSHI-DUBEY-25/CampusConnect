import { brainTreePaymentController, braintreeTokenController, createEventController, deleteEventController, eventCountController, eventFiltersController, eventListController, eventPhotoController, getEventController, getSingleEventController, updateEventController } from "../controller/eventController.js";
import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import formidable from "express-formidable";
import { getAllOrdersController } from "../controller/authController.js";


const router= express.Router();
router.post("/create-event",requireSignIn,isAdmin,formidable(),createEventController);
router.get("/get-event", getEventController);
router.get("/get-event/:slug", getSingleEventController);
router.put("/update-event/:pid",requireSignIn,isAdmin,formidable(),updateEventController);
router.delete("/delete-event/:pid",requireSignIn,isAdmin,deleteEventController);
router.get("/event-photo/:pid", eventPhotoController);
router.get("/event-count", eventCountController);
router.get("/event-list/:page", eventListController);
router.post("/event-filters", eventFiltersController);

router.get("/braintree/token",braintreeTokenController);
router.post("/braintree/payment",requireSignIn,brainTreePaymentController);
router.get("/orders", requireSignIn, getAllOrdersController);


export default router;