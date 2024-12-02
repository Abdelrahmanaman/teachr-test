import { GetStaticProps } from "next";
import Head from "next/head";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { List } from "../../components/product/List";
import { getProducts, getProductsPath } from "../../components/product/PageList";
import { PagedCollection } from "../../types/collection";
import { Product } from "../../types/Product";
import { FetchResponse } from "../../utils/dataAccess";

const ProductsPage = () => {
  const { data, isLoading, error } = useQuery<FetchResponse<PagedCollection<Product>> | undefined>(
    getProductsPath(),
    () => getProducts()()
  );

  console.log('Products data:', data);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading products: {String(error)}
        </div>
      </div>
    );
  }

  // Check for both hydra:member and member
  const products = data?.data?.['hydra:member'] || data?.data?.member;

  return (
    <>
      <Head>
        <title>Products - API Platform</title>
      </Head>
      <div className="container mx-auto px-4">
        {products ? (
          <List products={products} />
        ) : (
          <div className="text-center py-8">No products found</div>
        )}
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery(getProductsPath(), () => getProducts()());
  } catch (error) {
    console.error("Error prefetching products:", error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export default ProductsPage;
