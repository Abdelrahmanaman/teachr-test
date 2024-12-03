import type { AppProps } from "next/app";
import type { DehydratedState } from "react-query";
import Layout from "../components/common/Layout";
import Header from "../components/Header";
import "../styles/globals.css";

function MyApp({
  Component,
  pageProps,
}: AppProps<{ dehydratedState: DehydratedState }>) {
  return (
    <Layout dehydratedState={pageProps.dehydratedState}>
      <Header />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
