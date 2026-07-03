import express from "express";
import cors from "cors";
import { pool } from "./db.ts";
import bcrypt from "bcrypt";
import multer from "multer";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});

app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role",
[username, hashedPassword, role || "customer"]
    );

    res.json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error: any) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Registration failed",
      error: error.message,
      code: error.code,
    });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
     "SELECT id, username, password, role FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

app.get("/shopping-list/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM shopping_items WHERE user_id = $1 ORDER BY id",
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET SHOPPING LIST ERROR:", error);
    res.status(500).json({ message: "Failed to get shopping list" });
  }
});

app.post("/shopping-list", async (req, res) => {
  const { userId, product } = req.body;

  try {
    const existingItem = await pool.query(
      `SELECT *
       FROM shopping_items
       WHERE user_id = $1 AND product_name = $2`,
      [userId, product.name]
    );

    if (existingItem.rows.length > 0) {
      const result = await pool.query(
        `UPDATE shopping_items
         SET quantity = quantity + 1
         WHERE user_id = $1 AND product_name = $2
         RETURNING *`,
        [userId, product.name]
      );

      res.json(result.rows[0]);
      return;
    }

    const result = await pool.query(
  `INSERT INTO shopping_items
   (user_id, product_name, price, picture, quantity,  seller_id)
   VALUES ($1, $2, $3, $4, 1, $5)
   RETURNING *`,
   [
    userId,
    product.name,
    product.price,
    product.photo,
    product.seller_id,
  ]
);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("ADD SHOPPING ITEM ERROR:", error);
    res.status(500).json({ message: "Failed to add item" });
  }
});

app.delete("/shopping-list/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM shopping_items WHERE id = $1", [id]);
    res.json({ message: "Item deleted" });
  } catch (error) {
    console.error("DELETE SHOPPING ITEM ERROR:", error);
    res.status(500).json({ message: "Failed to delete item" });
  }
});

app.patch("/shopping-list/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const result = await pool.query(
      `UPDATE shopping_items
       SET quantity = $1
       WHERE id = $2
       RETURNING *`,
      [quantity, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("UPDATE SHOPPING ITEM ERROR:", error);
    res.status(500).json({ message: "Failed to update item" });
  }
});

app.post("/orders", async (req, res) => {
  const { user_id, items, total_price } = req.body;

  try {
   const orderResult = await pool.query(
  `INSERT INTO orders (user_id, total_price, status)
   VALUES ($1, $2, $3)
   RETURNING id`,
  [user_id, total_price, "Ordered"]
);

    const orderId = orderResult.rows[0].id;

    for (const item of items) {
   await pool.query(
  `INSERT INTO order_items
   (order_id, product_name, price, picture, quantity, seller_id, status)
   VALUES ($1, $2, $3, $4, $5, $6, $7)`,
  [
    orderId,
    item.product_name,
    item.price,
    item.picture || item.photo,
    item.quantity,
    item.seller_id,
    "Ordered",
  ]
);

      await pool.query("DELETE FROM shopping_items WHERE id = $1", [item.id]);
    }

    res.json({
      message: "Order created successfully",
      orderId: orderId,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

app.get("/orders/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        orders.id AS order_id,
        orders.total_price,
        orders.created_at,
        order_items.status,
        order_items.id AS order_item_id,
        order_items.product_name,
        order_items.price,
        order_items.picture,
        order_items.quantity
      FROM orders
      JOIN order_items ON orders.id = order_items.order_id
      WHERE orders.user_id = $1
      ORDER BY orders.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({ message: "Failed to get orders" });
  }
});
app.get("/items", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, description, photo, price, category, seller_id FROM items ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET ITEMS ERROR:", error);
    res.status(500).json({ message: "Failed to get items" });
  }
});

app.post("/seller/items", async (req, res) => {
  const { seller_id, name, description, photo, price, category } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO items (seller_id, name, description, photo, price, category)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [seller_id, name, description, photo, price, category]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("ADD SELLER ITEM ERROR:", error);
    res.status(500).json({ message: "Failed to add seller item" });
  }
});

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "No image uploaded" });
    return;
  }

  res.json({
    imageUrl: `http://localhost:5000/uploads/${req.file.filename}`,
  });
});
//get only the seller's own products
app.get("/seller/items/:sellerId", async (req, res) => {
  const { sellerId } = req.params;

  try {
    const result = await pool.query(
      `SELECT *
       FROM items
       WHERE seller_id = $1
       ORDER BY id DESC`,
      [sellerId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET SELLER ITEMS ERROR:", error);
    res.status(500).json({
      message: "Failed to load seller products",
    });
  }
});


app.get("/seller/orders/:sellerId", async (req, res) => {
  const { sellerId } = req.params;

  try {
   const result = await pool.query(
  `SELECT
    orders.id AS order_id,
    order_items.status,
    orders.created_at,
    order_items.id AS order_item_id,
    order_items.product_name,
    order_items.price,
    order_items.picture,
    order_items.quantity,
    order_items.seller_id
  FROM order_items
  JOIN orders ON orders.id = order_items.order_id
  WHERE order_items.seller_id = $1
  ORDER BY orders.created_at DESC`,
  [sellerId]
);

    res.json(result.rows);
  } catch (error) {
    console.error("GET SELLER ORDERS ERROR:", error);
    res.status(500).json({ message: "Failed to get seller orders" });
  }
});

//This route will let the seller change an order from: Ordered ,Shipped , Delivered

app.patch("/seller/order-items/:orderItemId", async (req, res) => {
  const { orderItemId } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE order_items
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, orderItemId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("UPDATE ORDER ITEM STATUS ERROR:", error);
    res.status(500).json({
      message: "Failed to update order item status",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

console.log("End of file reached");