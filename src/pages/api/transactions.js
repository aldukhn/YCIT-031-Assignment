import { createClient } from "@vercel/postgres";
import { verify } from "jsonwebtoken";

export default async function handler(req, res) {
  const client = createClient();
  await client.connect();

  const token = req.cookies.auth;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  let userId;
  try {
    const decoded = verify(token, "123456");
    userId = decoded.sub;
  } catch (e) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { productId, quantity } = req.body;

  const { rows: productRows } = await client.query(
    `
    SELECT price 
    FROM products 
    WHERE id = $1
    `,
    [productId]
  );

  if (productRows.length === 0) {
    res
      .status(400)
      .json({ error: `Product with id ${productId} does not exist` });
    return;
  }

  const price = productRows[0].price;
  const totalPrice = price * quantity;

  // Add the transaction
  await client.query(
    `
    INSERT INTO transactions (user_id, product_id, quantity, total_price)
    VALUES ($1, $2, $3, $4)
    `,
    [userId, productId, quantity, totalPrice]
  );

  await client.end();

  res.status(200).json({ message: "Transaction created" });
}
