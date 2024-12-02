import { ErrorMessage, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import { useMutation } from "react-query";

import toast from "react-hot-toast";
import { Category } from "../../types/Category";
import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";

interface Props {
  category?: Category;
}

interface SaveParams {
  values: Category;
}

interface DeleteParams {
  id: string;
}

const saveCategory = async ({ values }: SaveParams) =>
  await fetch<Category>(!values["@id"] ? "/categories" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteCategory = async (id: string) =>
  await fetch<Category>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ category }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Category> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveCategory(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Category> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteCategory(id));

  const handleDelete = () => {
    if (!category || !category["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    toast.promise(deleteMutation.mutateAsync({ id: category["@id"] }), {
      loading: "Deleting category...",
      success: "Category deleted successfully",
      error: (error) => `Error deleting category: ${error.message}`,
    });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/categories"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {category ? `Edit Category ${category["@id"]}` : `Create Category`}
      </h1>
      <Formik
        initialValues={
          category
            ? {
                ...category,
              }
            : new Category()
        }
        validate={() => {
          const errors = {};
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setErrors, resetForm }) => {
          const isCreation = !values["@id"];
          toast
            .promise(saveMutation.mutateAsync({ values }), {
              loading: "Saving category...",
              success: () => {
                if (isCreation) {
                  resetForm();
                }
                return `Category ${isCreation ? "created" : "updated"} successfully`;
              },
              error: (error) => {
                if ("fields" in error) {
                  setErrors(error.fields);
                }
                return `Error: ${error.message}`;
              },
            })
            .finally(() => {
              setSubmitting(false);
            });
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
                htmlFor="category_name"
              >
                name
              </label>
              <input
                name="name"
                id="category_name"
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

            <button
              type="submit"
              className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
      <div className="flex space-x-2 mt-4 justify-end">
        {category && (
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
