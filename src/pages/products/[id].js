import Link from "next/link";
import "tailwindcss/tailwind.css";
import { createClient } from "@vercel/postgres";
import { useState } from "react";
import Head from "next/head";

export async function getServerSideProps(context) {
  //CHECK
  const cookies = parse(context.req.headers.cookie || "");
  const token = cookies["auth"];

  if (!token) {
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
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  
  const client = createClient();
  await client.connect();

  const { id } = context.params;

  const { rows: productRows } = await client.query(
    `
    SELECT * 
    FROM products 
    WHERE id = $1
    `,
    [id]
  );

  if (productRows.length === 0) {
    return {
      props: {
        error: `Product with id ${id} does not exist`,
      },
    };
  }

  const { rows: transactionRows } = await client.query(
    `
    SELECT t.id, t.quantity, t.total_price,t.transaction_date, u.username, u.role
    FROM transactions t
    INNER JOIN users u ON t.user_id = u.id
    WHERE t.product_id = $1
    `,
    [id]
  );

  await client.end();

  const transactionRowsModified = transactionRows.map((transaction) => ({
    ...transaction,
    transaction_date: transaction.transaction_date.toISOString(),
  }));

  return {
    props: {
      product: productRows[0],
      transactions: transactionRowsModified,
    },
  };
}

function ProductPage({ product, transactions, error }) {
  // transaction
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product.id,
        quantity,
      }),
    });

    if (res.ok) {
      // Refresh
      location.reload();
    } else {
      alert("Failed to create transaction");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Head>
        <title>Product details </title>
      </Head>

      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md mt-20">
        <Link
          href="/"
          className="mx-auto w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 focus:outline-none "
        >
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-4 text-center text-gray-700">
          {product.name}
        </h1>
        <h1 className="text-2xl font-bold mb-4 text-center text-green-700">
          {" "}
          Price: ${product.price}
        </h1>

        <h2 className="text-3xl font-bold mb-4 text-center text-gray-700">
          Transactions:
        </h2>
        {transactions.length > 0 ? (
          <table className="table-auto w-full mt-8">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-gray-500 font-semibold">User</th>
                <th className="px-4 py-2 text-gray-500 font-semibold">
                  Quantity
                </th>
                <th className="px-4 py-2 text-gray-500 font-semibold">
                  Total Price
                </th>
                <th className="px-4 py-2 text-gray-500 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-4 py-2 text-gray-800">
                    {transaction.username}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {transaction.quantity}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    ${transaction.total_price}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {transaction.transaction_date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions found for this product.</p>
        )}
        <div>
          <form onSubmit={handleSubmit} className="my-8">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 rounded-md"
              required
            />
            <button
              type="submit"
              className="mt-4 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500"
            >
              NEW TRANSACTION
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
