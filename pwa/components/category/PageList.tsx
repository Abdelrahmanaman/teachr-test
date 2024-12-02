import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { Category } from "../../types/Category";
import { PagedCollection } from "../../types/collection";
import { fetch, parsePage } from "../../utils/dataAccess";
import Pagination from "../common/Pagination";
import { List } from "./List";

export const getCategorysPath = (page?: string | string[] | undefined) =>
  `/categories${typeof page === "string" ? `?page=${page}` : ""}`;
export const getCategorys =
  (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<Category>>(getCategorysPath(page));
const getPagePath = (path: string) =>
  `/categorys/page/${parsePage("categories", path)}`;
export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
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
  console.log(categories);

  return (
    <div>
      <div>
        <Head>
          <title>Category List</title>
        </Head>
      </div>
      <List categories={categories} />
      {categoriesData && (
        <Pagination collection={categoriesData} getPagePath={getPagePath} />
      )}
    </div>
  );
};
