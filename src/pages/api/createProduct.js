import { createClient } from "@vercel/postgres";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const client = createClient();
  await client.connect();

  try {
    await client.sql`
    INSERT INTO products (name, price)
    VALUES (${name}, ${price})
    `;
    res.status(200).json({ message: "Product added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.end();
  }
}
