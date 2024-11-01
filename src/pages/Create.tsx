import { Editor } from "@tinymce/tinymce-react";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  createProject,
  fetchProjectCategory,
  setProjectCreated,
} from "../reducers/projectSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

type FormCreate = {
  projectName: string;
  description: string;
  projectCategory: string;
};

function Create() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const formCreate = useForm<FormCreate>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = formCreate;

  useEffect(() => {
    dispatch(fetchProjectCategory());
  }, []);

  const projectCategories = useAppSelector(
    (store) => store.projectState.projectCategories,
  );

  const projectCreated = useAppSelector(
    (store) => store.projectState.projectCreated,
  );

  useEffect(() => {
    if (projectCreated) {
      navigate("/");
    }
    dispatch(setProjectCreated());
  }, [projectCreated]);

  const error = useAppSelector((store) => store.projectState.error);
  console.log(error);
  const loading = useAppSelector((store) => store.projectState.loading);

  const onSubmit = handleSubmit((data: FormCreate) => {
    let categoryId = 0;
    projectCategories.forEach((category) => {
      if (category.projectCategoryName === data.projectCategory)
        categoryId = category.id;
    });
    const dataSubmit: {
      projectName: string;
      description: string;
      categoryId: number;
      alias: string;
    } = {
      projectName: data.projectName,
      description: data.description,
      categoryId: categoryId,
      alias: data.projectCategory,
    };
    console.log(dataSubmit);
    dispatch(createProject(dataSubmit));
  });

  return (
    <>
      {loading && <Loader />}
      {!loading && !error && (
        <div>
          <h2 className="ml-20 mb-5">Create Project</h2>
          <form className="mx-20 flex flex-col gap-5" onSubmit={onSubmit}>
            <label
              htmlFor="name"
              className="text-gray-700 text-sm font-bold flex-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="border rounded w-full py-1 px-2 font-normal"
              {...register("projectName", {
                required: "This field is required",
              })}
            />
            {errors.projectName && (
              <span className="text-red-500">{errors.projectName.message}</span>
            )}

            <label>Description</label>
            <Controller
              control={control}
              name="description"
              rules={{ required: "This field is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Editor
                  apiKey="uth2qypdziusl6mkj9q6s7jyqc4eaqm41m5ravf5neo2w4b7"
                  initialValue=""
                  init={{
                    height: 200,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                  onEditorChange={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
            />
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}

            <label className="text-gray-700 text-sm font-bold flex-1">
              Project Category
            </label>
            <select
              className="border rounded w-full p-2 text-gray-700 font-normal"
              {...register("projectCategory", {
                required: "This field is required",
              })}
            >
              <option value="" className="text-sm font-bold">
                Choose a project
              </option>

              {projectCategories.map((project) => (
                <option value={project.projectCategoryName} key={project.id}>
                  {project.projectCategoryName}
                </option>
              ))}
            </select>

            {errors.projectCategory && (
              <span className="text-red-500">
                {errors.projectCategory.message}
              </span>
            )}
            <button type="submit">submit</button>
          </form>
        </div>
      )}
      {error && <ErrorMessage message={error.errorMessage} />}
    </>
  );
}

export default Create;
