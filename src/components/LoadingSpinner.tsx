import { LoadingOutlined } from "@ant-design/icons";

function LoadingSpinner() {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-white bg-opacity-75 backdrop-blur-sm flex flex-col items-center justify-center">
      <LoadingOutlined className="loader" />
    </div>
  );
}

export default LoadingSpinner;
