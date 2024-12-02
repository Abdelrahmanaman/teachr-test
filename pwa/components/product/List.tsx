import Link from "next/link";
import { FC, FunctionComponent, useState } from "react";
import { useQuery } from "react-query";
import { Category } from "../../types/Category";
import { PagedCollection } from "../../types/collection";
import { Product } from "../../types/Product";
import { fetch, getItemPath } from "../../utils/dataAccess";
import { formatDate } from "../../utils/formatDate";

interface Props {
  products: Product[];
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

interface FilterOptions {
  category: string;
  priceSort: "none" | "asc" | "desc";
  dateSort: "none" | "asc" | "desc";
}

export const List: FunctionComponent<Props> = ({
  products,
  currentPage = 1,
  itemsPerPage = 10,
  onPageChange = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    category: "",
    priceSort: "none",
    dateSort: "none",
  });

  const { data: categoriesData } = useQuery(
    "categories",
    async () => {
      const response = await fetch<PagedCollection<Category>>("/categories");
      return response?.data;
    },
    {
      staleTime: 30000,
    },
  );

  const categories =
    categoriesData?.["hydra:member"] || categoriesData?.member || [];

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !filters.category || product.category === filters.category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (filters.priceSort !== "none") {
        return filters.priceSort === "asc"
          ? (a.price || 0) - (b.price || 0)
          : (b.price || 0) - (a.price || 0);
      }

      if (filters.dateSort !== "none") {
        const dateA = new Date(a.createdAt || "").getTime();
        const dateB = new Date(b.createdAt || "").getTime();
        return filters.dateSort === "asc" ? dateA - dateB : dateB - dateA;
      }

      return 0;
    });

  const displayedProducts = filteredProducts;

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

        {/* Category Filter */}
        <div className="flex gap-4">
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
            className="px-8 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Categories</option>
            {categories?.map((category: any) => (
              <option key={category["@id"]} value={category["@id"]}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Price Sort */}
          <select
            value={filters.priceSort}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                priceSort: e.target.value as "none" | "asc" | "desc",
              }))
            }
            className="px-8 py-2 border border-gray-300 rounded-lg"
          >
            <option value="none">Price: No Sort</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>

          {/* Date Sort */}
          <select
            value={filters.dateSort}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                dateSort: e.target.value as "none" | "asc" | "desc",
              }))
            }
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="none">Date: No Sort</option>
            <option value="asc">Date: Oldest First</option>
            <option value="desc">Date: Newest First</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500 mb-4">
        Showing {displayedProducts.length} products
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
          {displayedProducts.map((product) => (
            <ProductRow
              key={product["@id"]}
              product={product}
              searchTerm={searchTerm}
            />
          ))}
        </tbody>
      </table>

      {displayedProducts.length === 0 && (
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
            href={getItemPath(category["@id"], "/categories/[id]")}
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path
              fillRule="evenodd"
              d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </td>
      <td className="w-8">
        <Link
          href={getItemPath(product["@id"], "/products/[id]/edit")}
          className="text-cyan-500 hover:text-cyan700"
          title="Edit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
            <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
          </svg>
        </Link>
      </td>
    </tr>
  );
};
