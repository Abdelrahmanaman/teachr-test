import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Toaster } from "react-hot-toast";
import { Form } from "../../components/category/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Category</title>
      </Head>
    </div>
    <Form />
    <Toaster
      position="top-right"
      toastOptions={{
        // Default toast options
        duration: 3000,
        style: {
          background: "#363636",
          color: "#fff",
        },
        success: {
          duration: 3000,
          style: {
            background: "#059669", // green
          },
        },
        error: {
          duration: 4000,
          style: {
            background: "#DC2626", // red
          },
        },
      }}
    />
  </div>
);

export default Page;
