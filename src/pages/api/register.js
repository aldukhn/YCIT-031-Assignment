import { createClient } from "@vercel/postgres";
import { hash } from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Validate input
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const client = createClient();
  await client.connect();

  // Hash the password
  const hashedPassword = await hash(password, 10);

  try {
    await client.sql`
    INSERT INTO users (username, password, role)
    VALUES (${username}, ${hashedPassword}, ${role})
    `;
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.end();
  }
}
