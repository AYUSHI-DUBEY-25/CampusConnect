import usermodel from "../models/usermodel.js";
import { comparePassword, hashPassword } from "../helper/authPass.js";
import JWT from "jsonwebtoken";
import Order from "../models/ordermodel.js";
import Event from "../models/eventmodel.js"; 

export const registerController = async (req, res) => {
  const { name, email, password, phone, address, answer } = req.body;

  if (!name || !email || !password || !phone || !address || !answer) {
    return res.status(422).json({ success: false, message: "Please fill all the fields" });
  }

  try {
    const userexist = await usermodel.findOne({ email });
    if (userexist) {
      return res.status(422).json({ success: false, message: "User with this email already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const user = new usermodel({ name, email, password: hashedPassword, phone, address, answer });
    await user.save();

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email is not registered" });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid Password" });
    }

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ success: false, message: "Error in login", error: error.message });
  }
};

export const forgetPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!answer) return res.status(400).json({ message: "Security answer is required" });
    if (!newPassword) return res.status(400).json({ message: "New Password is required" });

    const user = await usermodel.findOne({ email, answer });
    if (!user) {
      return res.status(404).json({ success: false, message: "Wrong Email or Answer" });
    }

    const hashed = await hashPassword(newPassword);
    await usermodel.findByIdAndUpdate(user._id, { password: hashed });

    return res.status(200).json({ success: true, message: "Password Reset Successfully" });
  } catch (error) {
    console.error("forgetPasswordController error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await usermodel.findById(req.user._id);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (password && password.length < 6) {
      return res.status(400).json({ error: "Password must be 6 characters long" });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updatedUser = await usermodel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    return res.status(200).json({ success: true, message: "Profile Updated", updatedUser });
  } catch (error) {
    console.error("updateProfileController error:", error);
    return res.status(500).json({ success: false, message: "Error while updating profile", error: error.message });
  }
};

export const createOrderController = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { cart, paymentResult } = req.body; 

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }
    const ids = cart.map((c) => c.eventId ?? c.id ?? c._id).filter(Boolean);
    const events = await Event.find({ _id: { $in: ids } }).lean();
    const map = new Map(events.map((e) => [String(e._id), e]));

    const items = cart.map((c) => {
      const id = String(c.eventId ?? c.id ?? c._id);
      const evt = map.get(id);
      return {
        event: evt?._id ?? id,
        name: evt?.name ?? c.name ?? "Untitled Event",
        date: evt?.date ?? c.date ?? null,
        price: Number(evt?.price ?? c.price ?? 0),
        qty: Number(c.qty ?? c.quantity ?? 1),
      };
    });

    const totalAmount = items.reduce((s, it) => s + it.price * it.qty, 0);

    const order = await Order.create({
      items,
      payment: paymentResult ?? {},
      buyer: userId,
      totalAmount,
      status: "Confirmed",
    });

    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("createOrderController error:", error);
    return res.status(500).json({ success: false, message: "Order creation failed", error: error.message });
  }
};

export const getOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("getOrdersController error:", error);
    return res.status(500).json({ success: false, message: "error in getting the order", error: error.message });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({})
      .select("-__v")
      .populate({ path: "buyer", select: "name email" })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("getAllOrdersController error:", error);
    return res.status(500).json({ success: false, message: "error in getting all the orders", error: error.message });
  }
};

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true }).lean();
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("orderStatusController error:", error);
    return res.status(500).json({ success: false, message: "error while updating", error: error.message });
  }
};

export const getMyOrdersController = getOrdersController;