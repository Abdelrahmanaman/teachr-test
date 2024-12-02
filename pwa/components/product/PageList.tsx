import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { PagedCollection } from "../../types/collection";
import { Product } from "../../types/Product";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";
import Pagination from "../common/Pagination";
import { List } from "./List";

export const ITEMS_PER_PAGE = 10;

export const getProductsPath = (page?: string | string[] | number) => {
  const pageNumber =
    typeof page === "number"
      ? page
      : typeof page === "string"
        ? parseInt(page) || 1
        : 1;

  return `/products?page=${pageNumber}&itemsPerPage=${ITEMS_PER_PAGE}`;
};

export const getProducts = (page?: string | string[] | number) => async () => {
  const pageNumber =
    typeof page === "number"
      ? page
      : typeof page === "string"
        ? parseInt(page) || 1
        : 1;

  return await fetch<PagedCollection<Product>>(
    `/products?page=${pageNumber}&itemsPerPage=${ITEMS_PER_PAGE}`,
  );
};

export const getPagePath = (path: string) =>
  `/products/page/${parsePage("products", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const currentPage = parseInt(router.query.page as string) || 1;

  const { data, isLoading, error } = useQuery<
    FetchResponse<PagedCollection<Product>> | undefined
  >(["products", currentPage], getProducts(currentPage), {
    keepPreviousData: true,
  });

  const collection = useMercure(data?.data ?? undefined, data?.hubURL ?? null);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">
          Error loading products: {String(error)}
        </div>
      </div>
    );
  }

  const products = collection?.member || [];
  const totalItems = collection?.totalItems || 0;

  const formattedCollection = collection
    ? {
        ...collection,
        "hydra:member": collection.member,
        "hydra:view": {
          "@id": `/products?page=${currentPage}&itemsPerPage=${ITEMS_PER_PAGE}`,
          "@type": "hydra:PartialCollectionView",
          "hydra:first": "/products?page=1",
          "hydra:last": `/products?page=${Math.ceil((collection.totalItems || 0) / ITEMS_PER_PAGE)}`,
          "hydra:next":
            currentPage * ITEMS_PER_PAGE < (collection.totalItems || 0)
              ? `/products?page=${currentPage + 1}`
              : undefined,
          "hydra:previous":
            currentPage > 1 ? `/products?page=${currentPage - 1}` : undefined,
        },
      }
    : null;

  if (!formattedCollection || !formattedCollection["hydra:member"]) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">No products available</div>
      </div>
    );
  }

  if (!products) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">No products available</div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Product List</title>
      </Head>
      <List
        products={formattedCollection["hydra:member"]}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />
      <Pagination
        collection={formattedCollection}
        getPagePath={(path) => {
          const matches = path.match(/page=(\d+)/);
          return `/products/page/${matches ? matches[1] : "1"}`;
        }}
      />
    </div>
  );
};
