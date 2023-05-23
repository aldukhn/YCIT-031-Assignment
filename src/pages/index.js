import { useForm } from "react-hook-form";
import Link from "next/link";
import "tailwindcss/tailwind.css";
import { createClient } from "@vercel/postgres";
import { verify } from "jsonwebtoken";
import { parse } from "cookie";
import Navbar from "../components/Navbar";
import Head from "next/head";

export async function getServerSideProps({ req }) {
  // Check if user is authenticated
  const cookies = parse(req.headers.cookie || "");
  const token = cookies["auth"];

  if (!token) {
    // Redirect to login page if not authenticated
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  let decoded;
  try {
    decoded = verify(token, "123456");
  } catch (err) {
    // Redirect to login page if token is invalid
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const client = createClient();
  await client.connect();

  const { rows } = await client.sql`
  SELECT id, name, price 
  FROM products`;

  return {
    props: {
      products: rows,
      username: decoded.username,
    },
  };
}
function HomePage({ products, username }) {
  //new product {POST}
  const { register, handleSubmit } = useForm();

  const addProduct = async (data) => {
    const response = await fetch("/api/createProduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Something went wrong while adding the product");
    }

    // Reload page to display newly added product.
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Head>
        <title>Products list</title>
      </Head>

      <Navbar username={username} />
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md mt-20">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-700">
          Products
        </h1>
        <h2 className="text-xl font-semibold mb-2 text-gray-600">
          Add New Product
        </h2>

        <form onSubmit={handleSubmit(addProduct)} className="space-y-5">
          <input
            type="text"
            placeholder="Product name"
            {...register("name", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Product price"
            {...register("price", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="submit"
            value="Add Product"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 focus:outline-none"
          />
        </form>

        <table className="table-auto w-full mt-8">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-gray-500 font-semibold">Name</th>
              <th className="px-4 py-2 text-gray-500 font-semibold">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((r) => (
              <tr key={r.id} className="text-center border-b">
                <td className="px-4 py-2">
                  <Link
                    href={`/products/${r.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {r.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-gray-800">${r.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomePage;
