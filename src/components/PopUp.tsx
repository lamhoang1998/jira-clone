import { Modal } from "antd";
import { useAppSelector, useAppDispatch } from "../hooks";
import { setCloseModal } from "../reducers/popupSlice";
import { Editor } from "@tinymce/tinymce-react";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  fetchProject,
  ProjectDetails,
  updateProject,
} from "../reducers/projectSlice";
import ErrorMessage from "./ErrorMessage";
import { setToastMessage } from "../reducers/toastSlice";

type ProjectFormData = {
  projectId: number;
  projectName: string;
  projectCategory: string;
  description: string;
};

function PopUp() {
  const dispatch = useAppDispatch();

  const openModal = useAppSelector((store) => store.popupState.open);
  const projectDetails = useAppSelector(
    (store) => store.projectState.projectDetails,
  ) as ProjectDetails;
  const { id, projectName, categoryName, description } = projectDetails;

  const error = useAppSelector((store) => store.projectState.error);
  console.log(`error:${error?.errorMessage}`, `errorStatus: ${error?.status}`);

  const projectCategories = useAppSelector(
    (store) => store.projectState.projectCategories,
  );

  const formDetails = useForm<ProjectFormData>({});

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = formDetails;

  useEffect(
    function () {
      reset({
        projectId: id,
        projectCategory: categoryName,
        projectName: projectName,
        description: description,
      });
    },
    [projectDetails],
  );

  const onSubmit = handleSubmit(async (data: ProjectFormData) => {
    let categoryId = 0;
    projectCategories.forEach((category) => {
      if (category.projectCategoryName === data.projectCategory)
        categoryId = category.id;
    });
    const dataSubmit: {
      id: number;
      projectName: string;
      creator: number;
      description: string;
      categoryId: number;
    } = {
      id: +data.projectId,
      projectName: data.projectName,
      creator: 0,
      description: data.description,
      categoryId: categoryId,
    };

    await dispatch(updateProject(dataSubmit));
  });

  return (
    <>
      <Modal
        title={<p>Loading Modal</p>}
        open={openModal}
        onCancel={() => {
          dispatch(setCloseModal());
        }}
      >
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <h2 className="text-3xl font-bold">Create an Account</h2>
          <label className="text-gray-700 text-sm font-bold flex-1">
            Project Id
            <input
              type="number"
              min={1}
              className="border rounded w-full py-1 px-2 font-normal"
              {...register("projectId", { required: "This field is required" })}
            ></input>
            {errors.projectId && (
              <span className="text-red-500">{errors.projectId.message}</span>
            )}
          </label>
          <label className="text-gray-700 text-sm font-bold flex-1">
            Project Name
            <input
              className="border rounded w-full py-1 px-2 font-normal"
              {...register("projectName", {
                required: "This field is required",
              })}
            ></input>
            {errors.projectName && (
              <span className="text-red-500">{errors.projectName.message}</span>
            )}
          </label>
          <label className="text-gray-700 text-sm font-bold flex-1">
            Project Category
            {/* <input className="border rounded w-full py-1 px-2 font-normal"></input> */}
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
          </label>
          <label className="text-gray-700 text-sm font-bold flex-1">
            Description
            <Controller
              control={control}
              name="description"
              rules={{ required: "This field is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Editor
                  apiKey="w1t07959btha8whcoqneja1m0pxjy5k1p38pv95jt3ywz6l3"
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
          </label>
          <button type="submit">submit</button>
        </form>
      </Modal>
    </>
  );
}

export default PopUp;
