import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// =======================
// MYSQL CONNECTION
// =======================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "restaurant_db",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// =======================
// LOGIN
// =======================
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const q = "SELECT id, email, role FROM users WHERE email = ? AND password = ?";
  
  db.query(q, [email, password], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(401).json({ message: "Invalid credentials" });
    return res.json(data[0]);
  });
});

// =======================
// CREATE ORDER
// =======================
app.post("/orders", (req, res) => {
  const { user_id, items, total } = req.body;

  const q1 = "INSERT INTO orders (user_id, total, status) VALUES (?, ?, 'Pending')";
  db.query(q1, [user_id, total], (err, result) => {
    if (err) return res.status(500).json(err);

    const orderId = result.insertId;
    const values = items.map(item => [orderId, item.name, item.price, item.quantity]);
    const q2 = "INSERT INTO order_items (order_id, item_name, price, quantity) VALUES ?";

    db.query(q2, [values], (err2) => {
      if (err2) return res.status(500).json(err2);
      return res.json({ message: "Order created successfully" });
    });
  });
});

// =======================
// GET ALL ORDERS
// =======================
app.get("/orders", (req, res) => {
  const q1 = `
    SELECT o.id, o.status, o.total, o.created_at,
           u.email AS customer
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;

  db.query(q1, (err, orders) => {
    if (err) return res.status(500).json(err);

    const orderIds = orders.map(o => o.id);
    if (orderIds.length === 0) return res.json([]);

    const q2 = "SELECT * FROM order_items WHERE order_id IN (?)";
    db.query(q2, [orderIds], (err2, items) => {
      if (err2) return res.status(500).json(err2);

      const result = orders.map(order => ({
        ...order,
        items: items.filter(i => i.order_id === order.id)
      }));

      return res.json(result);
    });
  });
});

// =======================
// UPDATE ORDER
// =======================
app.put("/orders/:id", (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const q = "UPDATE orders SET status = ? WHERE id = ?";
  db.query(q, [status, id], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Order updated" });
  });
});

// =======================
// DELETE ORDER
// =======================
app.delete("/orders/:id", (req, res) => {
  const { id } = req.params;

  const q = "DELETE FROM orders WHERE id = ?";
  db.query(q, [id], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Order deleted" });
  });
});

// =======================
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});