export default function handler(req, res) {
  res.setHeader("Set-Cookie", "auth=; Max-Age=0; Path=/; HttpOnly");

  res.status(200).json({ message: "Logout successful." });
}
