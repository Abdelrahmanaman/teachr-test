import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  getCategorys,
  getCategorysPath,
  PageList,
} from "../../../components/category/PageList";
import { Category } from "../../../types/Category";
import { PagedCollection } from "../../../types/collection";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getCategorysPath(page), getCategorys(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Category>>("/categories");
  const paths = await getCollectionPaths(
    response,
    "categories",
    "/categories/page/[page]",
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
