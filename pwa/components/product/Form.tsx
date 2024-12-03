import { ErrorMessage, Formik } from "formik";
import Link from "next/link";
import { FunctionComponent, useState } from "react";
import { useMutation, useQuery } from "react-query";

import toast from "react-hot-toast";
import { Category } from "../../types/Category";
import { PagedCollection } from "../../types/collection";
import { Product } from "../../types/Product";
import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";

interface Props {
  product?: Product;
}

interface SaveParams {
  values: Product;
}

interface DeleteParams {
  id: string;
}

const saveProduct = async ({ values }: SaveParams) =>
  await fetch<Product>(!values["@id"] ? "/products" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteProduct = async (id: string) =>
  await fetch<Product>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ product }) => {
  const [, setError] = useState<string | null>(null);

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

  const saveMutation = useMutation<
    FetchResponse<Product> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveProduct(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Product> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteProduct(id), {
    onSuccess: () => {
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting product: ${error.message}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!product || !product["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: product["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/products"
        className="text-sm text-blue-500 font-bold hover:text-blue-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {product ? `Edit Product ${product["@id"]}` : `Create Product`}
      </h1>
      <Formik
        initialValues={
          product
            ? {
                ...product,
              }
            : new Product()
        }
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                toast.success(
                  `Product ${isCreation ? "created" : "updated"} successfully`,
                );
              },
              onError: (error) => {
                toast.error(`Error: ${error.message}`);
                if ("fields" in error) {
                  setErrors(error.fields);
                }
              },
              onSettled: () => {
                setSubmitting(false);
              },
            },
          );
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="shadow-md p-4" onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="product_name"
              >
                name
              </label>
              <input
                name="name"
                id="product_name"
                value={values.name ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.name && touched.name ? "border-red-500" : ""
                }`}
                aria-invalid={errors.name && touched.name ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="name"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="product_description"
              >
                description
              </label>
              <input
                name="description"
                id="product_description"
                value={values.description ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.description && touched.description
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.description && touched.description ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="description"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="product_price"
              >
                price
              </label>
              <input
                name="price"
                id="product_price"
                value={values.price ?? ""}
                type="number"
                step="0.1"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.price && touched.price ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.price && touched.price ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="price"
              />
            </div>

            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="product_category"
              >
                category
              </label>
              <select
                name="category"
                id="product_category"
                value={values.category ?? ""}
                className={`mt-1 block w-full ${
                  errors.category && touched.category ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.category && touched.category ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
                required
              >
                <option value="">Select a category</option>
                {categories?.map((category: Category) => (
                  <option key={category["@id"]} value={category["@id"]}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="category"
              />
            </div>
            <div className="mb-2 hidden">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="product_createdAt"
              >
                createdAt
              </label>
              <input
                name="createdAt"
                id="product_createdAt"
                value={values.createdAt?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.createdAt && touched.createdAt ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.createdAt && touched.createdAt ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="createdAt"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
      <div className="flex space-x-2 mt-4 justify-end">
        {product && (
          <button
            className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
