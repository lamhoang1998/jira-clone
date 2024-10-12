import { Button, Modal } from "antd";
import { useAppSelector, useAppDispatch } from "../hooks";
import { setCloseModal } from "../reducers/popupSlice";
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

function PopUp() {
  const dispatch = useAppDispatch();

  const openModal = useAppSelector((store) => store.popupState.open);

  const handleChange = (content: any, editor: any) => {
    console.log(content);
  };

  return (
    <>
      <Modal
        title={<p>Loading Modal</p>}
        open={openModal}
        onCancel={() => {
          dispatch(setCloseModal());
        }}
      >
        <form className="flex flex-col gap-5">
          <h2 className="text-3xl font-bold">Create an Account</h2>
          <label className="text-gray-700 text-sm font-bold flex-1">
            Project Id
            <input className="border rounded w-full py-1 px-2 font-normal"></input>
          </label>
          <label className="text-gray-700 text-sm font-bold flex-1">
            Project Name
            <input className="border rounded w-full py-1 px-2 font-normal"></input>
          </label>
          <label className="text-gray-700 text-sm font-bold flex-1">
            Project Category
            <input className="border rounded w-full py-1 px-2 font-normal"></input>
          </label>
          <label className="text-gray-700 text-sm font-bold flex-1">
            Description
            <Editor
              apiKey="w1t07959btha8whcoqneja1m0pxjy5k1p38pv95jt3ywz6l3"
              initialValue="<p>This is the initial content of the editor.</p>"
              init={{
                height: 500,
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
          <button type="submit"> submit</button>
        </form>
      </Modal>
    </>
  );
}

export default PopUp;
