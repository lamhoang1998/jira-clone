import { useEffect } from "react";

type ToastProps = {
  message: string;
  type: string;
  onClose: () => void;
};

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(
    function () {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    },
    [onClose],
  );

  const styles =
    type === "SUCCESS"
      ? "fixed top-4 right-1 z-999 p-4 rounded-md bg-green-600 text-white max-w-md"
      : "fixed top-4 right-1 z-999 p-4 rounded-md bg-red-600 text-white max-w-md";

  return (
    <div className={styles}>
      <div className="flex justify-center items-center">
        <span className="text-lg font-semibold">{message}</span>
      </div>
    </div>
  );
}

export default Toast;
