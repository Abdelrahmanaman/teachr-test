import Link from "next/link";
import { FC, FunctionComponent, useState } from "react";
import { useQuery } from "react-query";
import { Category } from "../../types/Category";
import { Product } from "../../types/Product";
import { SortField, SortOrder } from "../../types/sorts";
import { fetch, getItemPath } from "../../utils/dataAccess";
import { formatDate } from "../../utils/formatDate";

interface Props {
  products: Product[];
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
}

export const List: FunctionComponent<Props> = ({
  products,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Sort and filter products
  const sortedAndFilteredProducts = products
    .filter(
      (product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.price?.toString().includes(searchTerm),
    )
    .sort((a, b) => {
      if (sortField === "price") {
        return sortOrder === "asc"
          ? (a.price || 0) - (b.price || 0)
          : (b.price || 0) - (a.price || 0);
      }
      if (sortField === "name") {
        return sortOrder === "asc"
          ? (a.name || "").localeCompare(b.name || "")
          : (b.name || "").localeCompare(a.name || "");
      }
      return 0;
    });

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl mb-2">Product List</h1>
        <Link
          href="/products/create"
          className="bg-cyan-500 hover:bg-cyan-700 text-white text-sm font-bold py-2 px-4 rounded"
        >
          Create
        </Link>
      </div>

      {/* Search and Sort Controls */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg
                className="h-5 w-5 text-gray-400 hover:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSort("name")}
            className={`px-3 py-1 rounded ${
              sortField === "name" ? "bg-cyan-500 text-white" : "bg-gray-200"
            }`}
          >
            Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("price")}
            className={`px-3 py-1 rounded ${
              sortField === "price" ? "bg-cyan-500 text-white" : "bg-gray-200"
            }`}
          >
            Price {sortField === "price" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>
      {/* Results Count */}
      <div className="text-sm text-gray-500 mb-4">
        Showing {sortedAndFilteredProducts.length} products
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      <table
        cellPadding={10}
        className="shadow-md table border-collapse min-w-full leading-normal table-auto text-left my-3"
      >
        <thead className="w-full text-xs uppercase font-light text-gray-700 bg-gray-200 py-2 px-4">
          <tr>
            <th>id</th>
            <th>name</th>
            <th>description</th>
            <th>price</th>
            <th>category</th>
            <th>createdAt</th>
            <th colSpan={2} />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedAndFilteredProducts.map((product) => (
            <ProductRow
              key={product["@id"]}
              product={product}
              searchTerm={searchTerm}
            />
          ))}
        </tbody>
      </table>

      {sortedAndFilteredProducts.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No products found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? `No results for "${searchTerm}"`
              : "Start by creating a new product"}
          </p>
        </div>
      )}
    </div>
  );
};

interface ProductRowProps {
  product: Product;
  searchTerm: string;
}

// Function to extract ID from IRI string
const getIdFromIRI = (iri: string | undefined) => {
  if (!iri) return "";
  const matches = iri.match(/\/(\d+)$/);
  return matches ? matches[1] : iri;
};

// Custom hook to fetch category details
const useCategory = (categoryIri: string | undefined) => {
  return useQuery(
    ["category", categoryIri],
    async () => {
      if (!categoryIri) return null;
      const response = await fetch<Category>(categoryIri);
      return response?.data;
    },
    {
      enabled: !!categoryIri,
      staleTime: 30000,
    },
  );
};

const ProductRow: FC<ProductRowProps> = ({ product, searchTerm }) => {
  const { data: category } = useCategory(product["category"]);

  return (
    <tr className="py-2 hover:bg-gray-50">
      <th scope="row">
        <Link
          href={getItemPath(product["@id"], "/products/[id]")}
          className="text-cyan-600 hover:text-cyan-800 font-medium"
        >
          {" "}
          #{getIdFromIRI(product["@id"])}{" "}
        </Link>
      </th>
      <td className="font-medium">{product["name"]}</td>
      <td className="max-w-xs truncate" title={product["description"]}>
        {product["description"]}
      </td>
      <td className="font-medium">${Number(product["price"]).toFixed(2)}</td>
      <td>
        {category ? (
          <Link
            href={getItemPath(category["@id"], "/categorys/[id]")}
            className="text-cyan-600 hover:text-cyan-800"
          >
            {category.name}
          </Link>
        ) : (
          <span className="text-gray-400 italic">Loading...</span>
        )}
      </td>
      <td>{formatDate(product["createdAt"]?.toString())}</td>
      <td className="w-8">
        <Link
          href={getItemPath(product["@id"], "/products/[id]")}
          className="text-cyan-500 hover:text-cyan-700"
          title="View Details"
        >
          {/* Icon for View Details */}
          {/* SVG code here */}
        </Link>
      </td>
      <td className="w-8">
        <Link
          href={getItemPath(product["@id"], "/products/[id]/edit")}
          className="text-cyan-500 hover:text-cyan700"
          title="Edit"
        >
          {/* Icon for Edit */}
          {/* SVG code here */}
        </Link>
      </td>
    </tr>
  );
};
