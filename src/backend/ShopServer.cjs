require("dotenv").config();
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./shop.db",
});

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: false,
  }
);

const Cart = sequelize.define(
  "Cart",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    items: { type: DataTypes.JSON, allowNull: false },
  },
  {
    timestamps: false,
  }
);

sequelize.sync({ alter: true }).then(() => console.log("Database synced"));

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Unauthorized: No token provided." });

  try {
    const decoded = jwt.verify(token, "2137");
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized: Invalid token." });
  }
};

// Register
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ error: "Email and password are required." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    //create cart for new user
    await Cart.create({ userId: user.id, items: [] });

    const token = jwt.sign({ userId: user.id }, "2137", { expiresIn: "1h" });

    res.status(201).json({ token });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Email already exists." });
    }
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: "User not found." });

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid password." });
    }

    const token = jwt.sign({ userId: user.id }, "2137", {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// Get All Carts
app.get("/cart/all", authenticate, async (req, res) => {
  try {
    const carts = await Cart.findAll();
    res.status(200).json(carts);
  } catch (error) {
    console.error("Fetching carts error:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// Get User Cart
app.get("/cart", authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.userId } });
    if (!cart) return res.status(404).json({ error: "Cart not found." });

    res.status(200).json(cart.items);
  } catch (error) {
    console.error("Fetching cart error:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.post("/cart", authenticate, async (req, res) => {
  try {
    const { item } = req.body;

    let cart = await Cart.findOne({ where: { userId: req.userId } });

    if (!cart) {
      cart = await Cart.create({ userId: req.userId, items: [] });
    }

    cart.items = cart.items || [];

    const existingItemIndex = cart.items.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex === -1) {
      item.quantity = 1;
      cart.items = [...cart.items, item];
    } else {
      const existingItem = cart.items.find(
        (cartItem) => cartItem.id === item.id
      );

      cart.items = cart.items.filter((item) => item.id !== existingItem.id);

      existingItem.quantity += 1;

      cart.items = [...cart.items, existingItem];
    }

    cart.items = [...cart.items];

    await cart.save();

    res.status(201).json({ message: "Item added to cart." });
  } catch (error) {
    console.error("Adding to cart error:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// Reduce Item quantity
app.delete("/cart/reduce", authenticate, async (req, res) => {
  try {
    const { itemId } = req.body;
    const cart = await Cart.findOne({
      where: { userId: req.userId },
    });

    const item = cart.items.find((cartItem) => cartItem.id === itemId);

    cart.items = cart.items.filter((item) => item.id !== itemId);
    item.quantity -= 1;
    if (item.quantity > 0) {
      cart.items = [...cart.items, item];
    }

    await cart.save({});

    res.status(200).json({ message: "Item removed from cart." });
  } catch (error) {
    console.error("Removing from cart error:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// Remove Item from Cart
app.delete("/cart/remove", authenticate, async (req, res) => {
  try {
    const { itemId } = req.body;
    const cart = await Cart.findOne({
      where: { userId: req.userId },
    });

    cart.items = cart.items.filter((item) => item.id !== itemId);
    await cart.save({});

    res.status(200).json({ message: "Item removed from cart." });
  } catch (error) {
    console.error("Removing from cart error:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
