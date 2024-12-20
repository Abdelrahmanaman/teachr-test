import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";

import { Product } from "../../types/Product";
import { fetch, getItemPath } from "../../utils/dataAccess";
import ReferenceLinks from "../common/ReferenceLinks";

interface Props {
  product: Product;
  text: string;
}

export const Show: FunctionComponent<Props> = ({ product, text }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!product["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await fetch(product["@id"], { method: "DELETE" });
      router.push("/products");
    } catch (error) {
      setError("Error when deleting the resource.");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <Head>
        <title>{`Show Product ${product["@id"]}`}</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Head>
      <Link
        href="/products"
        className="text-sm text-blue-500 font-bold hover:text-blue-700"
      >
        {"< Back to list"}
      </Link>
      <h1 className="text-3xl mb-2">{`Show Product ${product["@id"]}`}</h1>
      <table
        cellPadding={10}
        className="shadow-md table border-collapse min-w-full leading-normal table-auto text-left my-3"
      >
        <thead className="w-full text-xs uppercase font-light text-gray-700 bg-gray-200 py-2 px-4">
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-200">
          <tr>
            <th scope="row">name</th>
            <td>{product["name"]}</td>
          </tr>
          <tr>
            <th scope="row">description</th>
            <td>{product["description"]}</td>
          </tr>
          <tr>
            <th scope="row">price</th>
            <td>{product["price"]}</td>
          </tr>
          <tr>
            <th scope="row">category</th>
            <td>
              <ReferenceLinks
                items={{
                  href: getItemPath(product["category"], "/categories/[id]"),
                  name: product["category"],
                }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row">createdAt</th>
            <td>{product["createdAt"]?.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      {error && (
        <div
          className="border px-4 py-3 my-4 rounded text-red-700 border-red-400 bg-red-100"
          role="alert"
        >
          {error}
        </div>
      )}
      <div className="flex space-x-2 mt-4 items-center justify-end">
        <Link
          href={getItemPath(product["@id"], "/products/[id]/edit")}
          className="inline-block mt-2 border-2 border-blue-500 bg-blue-500 hover:border-blue-700 hover:bg-blue-700 text-xs text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </Link>
        <button
          className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-xs text-red-400 font-bold py-2 px-4 rounded"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
