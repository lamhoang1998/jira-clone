import { Button, Modal } from "antd";
import { useAppSelector, useAppDispatch } from "../hooks";
import { setCloseModal } from "../reducers/popupSlice";
import { Editor } from "@tinymce/tinymce-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { ProjectDetails, updateProject } from "../reducers/projectSlice";

type ProjectFormData = {
  projectId: number;
  projectName: string;
  projectCategory: string;
  description: string;
};

function PopUp() {
  const dispatch = useAppDispatch();

  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string).token
    : "";

  console.log(localStorage.getItem("user"));
  console.log(token);

  const openModal = useAppSelector((store) => store.popupState.open);
  let projectDetails = useAppSelector(
    (store) => store.projectState.projectDetails,
  ) as ProjectDetails;
  let { id, projectName, categoryName, description } = projectDetails;

  const formDetails = useForm<ProjectFormData>({});

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
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

  const handleChange = (content: any, editor: any) => {
    console.log(content);
    projectDetails = { ...projectDetails, description: content };
    console.log(projectDetails);
  };

  const onSubmit = handleSubmit((data: ProjectFormData) => {
    console.log(data);
    const dataSubmit: {
      id: number;
      projectName: string;
      creator: number;
      description: string;
      categoryId: string;
    } = {
      id: data.projectId,
      projectName: data.projectName,
      creator: 0,
      description: data.description,
      categoryId: data.projectCategory,
    };
    dispatch(updateProject(dataSubmit));
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
              {["Dự án phần mềm", "Dự án web", "Dự án di động"].map(
                (project) => (
                  <option value={project}>{project}</option>
                ),
              )}
            </select>
            {errors.projectCategory && (
              <span className="text-red-500">
                {errors.projectCategory.message}
              </span>
            )}
          </label>
          <label className="text-gray-700 text-sm font-bold flex-1">
            Description
            <Editor
              apiKey="w1t07959btha8whcoqneja1m0pxjy5k1p38pv95jt3ywz6l3"
              initialValue={description}
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
              onEditorChange={handleChange}
            />
          </label>
          <button type="submit">submit</button>
        </form>
      </Modal>
    </>
  );
}

export default PopUp;
