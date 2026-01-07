import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// =======================
// POSTGRESQL CONNECTION
// =======================
const db = new Pool({
  host: "ep-purple-thunder-ad990ow8-pooler.c-2.us-east-1.aws.neon.tech",
  user: "neondb_owner",         // change if needed
  password: "npg_jZUzJPvSW30f",             // change if needed
  database: "neondb",
  port: 5432,
  // ssl: { rejectUnauthorized: false }, // enable if using hosted PG
});

db.connect()
  .then((client) => {
    client.release();
    console.log("Connected to PostgreSQL database");
  })
  .catch((err) => {
    console.error("PostgreSQL connection failed:", err);
  });

// =======================
// LOGIN
// =======================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const q = `
    SELECT id, email, role
    FROM users
    WHERE email = $1 AND password = $2
    LIMIT 1
  `;

  try {
    const { rows } = await db.query(q, [email, password]);
    if (rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ message: "DB error", error: err.message });
  }
});

// =======================
// CREATE ORDER
// =======================
app.post("/orders", async (req, res) => {
  const { user_id, items, total } = req.body;

  // Use a transaction so we don't create an order without its items
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const q1 = `
      INSERT INTO orders (user_id, total, status)
      VALUES ($1, $2, 'Pending')
      RETURNING id
    `;
    const orderRes = await client.query(q1, [user_id, total]);
    const orderId = orderRes.rows[0].id;

    // Bulk insert order_items
    // We build: VALUES ($1,$2,$3,$4), ($5,$6,$7,$8), ...
    const values = [];
    const placeholders = items
      .map((item, idx) => {
        const base = idx * 4;
        values.push(orderId, item.name, item.price, item.quantity);
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
      })
      .join(", ");

    const q2 = `
      INSERT INTO order_items (order_id, item_name, price, quantity)
      VALUES ${placeholders}
    `;
    await client.query(q2, values);

    await client.query("COMMIT");
    return res.json({ message: "Order created successfully", orderId });
  } catch (err) {
    await client.query("ROLLBACK");
    return res.status(500).json({ message: "DB error", error: err.message });
  } finally {
    client.release();
  }
});

// =======================
// GET ALL ORDERS
// =======================
app.get("/orders", async (req, res) => {
  const q1 = `
    SELECT o.id, o.status, o.total, o.created_at,
           u.email AS customer
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;

  try {
    const { rows: orders } = await db.query(q1);
    if (orders.length === 0) return res.json([]);

    const orderIds = orders.map((o) => o.id);

    const q2 = `
      SELECT *
      FROM order_items
      WHERE order_id = ANY($1::int[])
    `;
    const { rows: items } = await db.query(q2, [orderIds]);

    const result = orders.map((order) => ({
      ...order,
      items: items.filter((i) => i.order_id === order.id),
    }));

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: "DB error", error: err.message });
  }
});

// =======================
// UPDATE ORDER
// =======================
app.put("/orders/:id", async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const q = "UPDATE orders SET status = $1 WHERE id = $2";

  try {
    await db.query(q, [status, id]);
    return res.json({ message: "Order updated" });
  } catch (err) {
    return res.status(500).json({ message: "DB error", error: err.message });
  }
});

// =======================
// DELETE ORDER
// =======================
app.delete("/orders/:id", async (req, res) => {
  const { id } = req.params;

  // If you don't have ON DELETE CASCADE on order_items.order_id,
  // you should delete items first.
  const client = await db.connect();

  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM order_items WHERE order_id = $1", [id]);
    await client.query("DELETE FROM orders WHERE id = $1", [id]);
    await client.query("COMMIT");

    return res.json({ message: "Order deleted" });
  } catch (err) {
    await client.query("ROLLBACK");
    return res.status(500).json({ message: "DB error", error: err.message });
  } finally {
    client.release();
  }
});

// =======================
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
