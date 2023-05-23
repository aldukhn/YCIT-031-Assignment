import { createClient } from "@vercel/postgres";
import { compare } from "bcryptjs";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;

  const client = createClient();
  await client.connect();

  try {
    const { rows } = await client.sql`
      SELECT *
      FROM users
      WHERE username = ${username}
    `;

    if (rows.length > 0) {
      const user = rows[0];

      const passwordMatch = await compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const claims = { sub: user.id, username: user.username };
      const jwt = sign(claims, "123456", { expiresIn: "1h" });

      const cookie = serialize("auth", jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      });

      res.setHeader("Set-Cookie", cookie);

      res.status(200).json({ message: "Logged in" });
    } else {
      res.status(401).json({ message: "Invalid username" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.end();
  }
}
