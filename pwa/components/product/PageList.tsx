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

export const getProductsPath = (page?: string | string[] | undefined) =>
  `/products${typeof page === "string" ? `?page=${page}` : ""}`;

export const getProducts = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Product>>(getProductsPath(page));

const getPagePath = (path: string) =>
  `/products/page/${parsePage("products", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();

  const { data, isLoading, error } = useQuery<
    FetchResponse<PagedCollection<Product>> | undefined
  >(getProductsPath(page), () => getProducts(page)());

  // Fix the type error by providing default values
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

  // Check for both hydra:member and member
  const products = collection?.["hydra:member"] || collection?.member;

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
      <List products={products} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
