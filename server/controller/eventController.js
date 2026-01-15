import fs from "fs";
import slugify from "slugify";
import eventmodel from "../models/eventmodel.js";
import braintree from "braintree"
import dotenv from "dotenv"
import ordermodel from "../models/ordermodel.js"

dotenv.config({path:`./config.env`});
dotenv.config();

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createEventController= async(req,res)=>{
    try{
        const {name,description,category,price,date,ticketsAvailable }=req.fields;
        const {photo}=req.files;

        switch(true){
            case !name:
                return res.status(500).send({error:"Name is required"});
            case !description:
                return res.status(500).send({error:"Description is required"});
            case !category:
                return res.status(500).send({error:"Category is required"});
            case !price:
                return res.status(500).send({error:"Price is required"});
            case !date:
                return res.status(500).send({error:"Date is required"});
            case photo && photo.size>1000000:
                return res.status(500).send({error:"Photo is required and should be less than 1MB"});
        }
        const events= new eventmodel({...req.fields,slug:slugify(name)});
        if(photo){
            events.photo.data= fs.readFileSync(photo.path);
            events.photo.contentType=photo.type;
        }
        await events.save();
        res.status(201).send({
            success:true,
            message:"Event Created Successfully",
            events,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in creating event",
            error,
        });
    }
}
//get all events
export const getEventController= async(req,res)=>{
    try{
        const events= await eventmodel.find({}).populate("category").select("-photo").limit(12).sort({createdAt:-1});
        res.status(200).send({
            success:true,
            countTotal:events.length,
            message:"All Events",
            events,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting events",
            error,
        });
    }
}
//get single event
export const getSingleEventController= async(req,res)=>{
    try{
        const event= await eventmodel.findOne({slug:req.params.slug}).select("-photo").populate("category");
        res.status(200).send({
            success:true,
            message:"Single Event Fetched",
            event,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting single event",
            error,
        });
    }
}
//get event photo
export const eventPhotoController= async(req,res)=>{
    try{
        const event= await eventmodel.findById(req.params.pid).select("photo");
        if(event.photo.data){
            res.set("Content-Type",event.photo.contentType);
            return res.status(200).send(event.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting event photo",
            error,
        });
    }
}
//delete event
export const deleteEventController= async(req,res)=>{
    try{
        await eventmodel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success:true,
            message:"Event Deleted Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in deleting event",
            error,
        });
    }
}
//update event
export const updateEventController = async (req, res) => {
  try {
    // destructure incoming fields (we'll normalize isHighlight & ticketsAvailable below)
    const { name, description, category, price, date } = req.fields;
    const { photo } = req.files || {};

    // existing validations
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is required" });
      case !description:
        return res.status(400).send({ error: "Description is required" });
      case !category:
        return res.status(400).send({ error: "Category is required" });
      case !price:
        return res.status(400).send({ error: "Price is required" });
      case !date:
        return res.status(400).send({ error: "Date is required" });
      case photo && photo.size > 1000000:
        return res.status(400).send({ error: "Photo should be less than 1MB" });
    }

    // normalize boolean flag sent from form: "true"/"false" or boolean
    const isHighlightFlag =
      req.fields.isHighlight === "true" || req.fields.isHighlight === true;

    // normalize ticketsAvailable
    let ticketsAvailable = undefined;
    if (typeof req.fields.ticketsAvailable !== "undefined") {
      const parsed = Number(req.fields.ticketsAvailable);
      if (Number.isNaN(parsed) || parsed < 0) {
        return res
          .status(400)
          .send({ error: "ticketsAvailable must be a non-negative number" });
      }
      ticketsAvailable = Math.floor(parsed);
    }

    // build update object carefully so we don't accidentally overwrite fields with undefined
    const updateObj = {
      ...req.fields, // keep other fields
      slug: slugify(name),
      isHighlight: isHighlightFlag,
    };

    if (typeof ticketsAvailable !== "undefined") {
      updateObj.ticketsAvailable = ticketsAvailable;
    }

    // update document
    const events = await eventmodel.findByIdAndUpdate(req.params.pid, updateObj, {
      new: true,
    });

    if (!events) {
      return res.status(404).send({ success: false, message: "Event not found" });
    }

    // handle photo separately (only if provided)
    if (photo) {
      events.photo.data = fs.readFileSync(photo.path);
      events.photo.contentType = photo.type;
      await events.save();
    }

    // respond
    res.status(200).send({
      success: true,
      message: "Event Updated Successfully",
      events,
    });
  } catch (error) {
    console.error("Error in updateEventController:", error);
    res.status(500).send({
      success: false,
      message: "Error in updating event",
      error,
    });
  }
};

//filters
export const eventFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};

    if (checked.length > 0) args.category = checked;

    if (radio.length) {
      args.price = { $gte: radio[0], $lte: radio[1] };
    }

    const events = await eventmodel.find(args).select("-photo");

    res.status(200).send({
      success: true,
      event: events,   // FIXED (was "events")
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while filtering events",
      error,
    });
  }
};

//event count
export const eventCountController= async(req,res)=>{
    try{
        const total= await eventmodel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success:true,
            total
        })
    }catch(error){
        res.status(400).send({
            message:"error in event count",
            error,
            success:false
        })
    }
}
//event list per page
export const eventListController= async(req,res)=>{
    try{
        const perPage=6;
        const page= req.params.page? req.params.page:1;

        const event=  await eventmodel
        .find({})
        .select("-photo")
        .skip((page-1)*perPage)
        .limit(perPage)
        .sort({createdAt:-1})
        res.status(200).send({
            success:true,
            event,
        })
    }catch(error){
        res.status(500).send({
            success:false,
            message:"Error in per page ctrl",
            error
        })
    }
}

//token gen
export const braintreeTokenController= async(req,res)=>{
    try{
        gateway.clientToken.generate({}, function(err,response){
            if(err){
                res.status(500).send(err)
            }else{
                res.send({ clientToken: response.clientToken });
            }
        })
    }catch(error){
        console.log(error)
    }
}
//payment
  export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).send({ success: false, message: "Cart is empty" });
    }

    // 1) compute total using quantity
    let total = 0;
    cart.forEach((i) => {
      const qty = i.quantity ? Number(i.quantity) : 1;
      const price = Number(i.price) || 0;
      total += price * qty;
    });

    // 2) validate availability BEFORE charging
    const insufficient = [];
    for (const item of cart) {
      const qty = item.quantity ? Number(item.quantity) : 1;
      const eventId = item._id || item._id || item.productId || item.product?._id;
      if (!eventId) {
        insufficient.push({ id: null, reason: "Missing event id in cart item" });
        continue;
      }
      const ev = await eventmodel.findById(eventId).select("name ticketsAvailable");
      const available = ev ? Number(ev.ticketsAvailable || 0) : 0;
      if (!ev) {
        insufficient.push({ id: eventId, name: "Unknown", available: 0 });
      } else if (available < qty) {
        insufficient.push({ id: eventId, name: ev.name, available });
      }
    }

    if (insufficient.length > 0) {
      return res.status(400).send({
        success: false,
        message: "Some events do not have enough tickets",
        insufficient,
      });
    }

    console.log("🧾 Payment Attempt:", { total, items: cart.length });

    // Helper to wrap braintree sale into a Promise
    const salePromise = (transaction) =>
      new Promise((resolve, reject) => {
        gateway.transaction.sale(transaction, (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        });
      });

    // 3) Perform the transaction
    const saleRequest = {
      amount: total.toFixed(2), // string, 2 decimals
      paymentMethodNonce: nonce,
      options: { submitForSettlement: true },
    };

    let result;
    try {
      result = await salePromise(saleRequest);
    } catch (err) {
      console.error("Braintree Error:", err);
      return res.status(500).send({
        success: false,
        message: "Braintree transaction failed",
        error: err.message || err,
      });
    }

    if (!result?.success) {
      console.error("Payment not approved:", result);
      return res.status(400).send({
        success: false,
        message: "Payment not approved",
        result,
      });
    }

    // 4) Atomically decrement tickets for each event (guarded)
    const updateResults = [];
    try {
      for (const item of cart) {
        const qty = item.quantity ? Number(item.quantity) : 1;
        const eventId = item._id || item.productId || item.product?._id;
        const updated = await eventmodel.findOneAndUpdate(
          { _id: eventId, ticketsAvailable: { $gte: qty } },
          { $inc: { ticketsAvailable: -qty } },
          { new: true }
        );
        if (!updated) {
          // This indicates a race condition (rare). Throw to trigger rollback logic below.
          throw new Error(`Insufficient tickets for event ${eventId}`);
        }
        updateResults.push({ eventId, remaining: updated.ticketsAvailable });
      }
    } catch (invErr) {
      console.error("Inventory decrement failed after payment:", invErr);

      // Attempt to void the transaction (best-effort). If void fails, you may need to refund.
      try {
        const txId = result.transaction && result.transaction.id;
        if (txId) {
          await new Promise((resolve, reject) => {
            gateway.transaction.void(txId, (e, voidResult) => {
              if (e) return reject(e);
              return resolve(voidResult);
            });
          });
          console.log("Transaction voided due to inventory failure:", result.transaction.id);
        }
      } catch (voidErr) {
        console.error("Failed to void transaction after inventory failure:", voidErr);
        // At this point you might want to alert ops and attempt refund programmatically.
      }

      return res.status(500).send({
        success: false,
        message:
          "Inventory update failed after payment. Transaction has been voided if possible. Contact support.",
        error: invErr.message || invErr,
      });
    }

    // 5) Save order
    const orderDoc = await new ordermodel({
      products: cart,
      payment: result,
      buyer: req.user._id,
    }).save();

    // 6) Clear server-side cart if you have one (optional)
    try {
      if (typeof cartModel !== "undefined" && cartModel) {
        await cartModel.deleteMany({ buyer: req.user._id });
      }
    } catch (cartClearErr) {
      console.error("Failed to clear server-side cart:", cartClearErr);
      // not fatal — continue
    }

    // 7) Respond with success and inventory updates
    console.log("✅ Payment Success:", result.transaction.id);
    return res.status(200).send({
      success: true,
      message: "Payment successful and tickets reserved",
      transactionId: result.transaction.id,
      orderId: orderDoc._id,
      inventory: updateResults,
    });
  } catch (error) {
    console.error("Payment Controller Error:", error);
    return res.status(500).send({
      success: false,
      message: "Server error while processing payment",
      error: error.message || error,
    });
  }
};