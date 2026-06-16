import express from "express";
import cors from "cors";
import { pool } from "./db.ts";
import bcrypt from "bcrypt";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
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
      "SELECT id, username, password FROM users WHERE username = $1",
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
       (user_id, product_name, price, picture, quantity)
       VALUES ($1, $2, $3, $4, 1)
       RETURNING *`,
      [userId, product.name, product.price, product.picture]
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

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

console.log("End of file reached");