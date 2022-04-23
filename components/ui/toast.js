import * as ToastPrimitive from "@radix-ui/react-toast";
import cx from "classnames";
import React, { useState } from "react";
import Button from "./shared/Button";

const Toast = (props) => {
  const { body, children } = props;
  const [open, setOpen] = useState(true);

  return (
    <ToastPrimitive.Provider>
      <Button
        onClick={() => {
          if (open) {
            setOpen(false);
            setTimeout(() => {
              setOpen(true);
            }, 400);
          } else {
            setOpen(true);
          }
        }}
      >
        {children}
      </Button>
      <ToastPrimitive.Root
        open={open}
        onOpenChange={setOpen}
        className={cx(
          "z-50 fixed bottom-4 inset-x-4 w-auto md:top-4 md:right-4 md:left-auto md:bottom-auto md:w-full md:max-w-sm shadow-lg rounded-lg",
          "bg-white ",
          "radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right",
          "radix-state-closed:animate-toast-hide",
          "radix-swipe-end:animate-toast-swipe-out",
          "radix-swipe-move:translate-x-[var(--radix-toast-swipe-move-x)]",
          "radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]",
          "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
        )}
      >
        <div className="flex">
          <div className="flex items-center flex-1 w-0 py-4 pl-5">
            <div className="w-full radix">
              <ToastPrimitive.Title className="text-sm font-medium text-gray-900 ">
                Pull Request Review
              </ToastPrimitive.Title>
              <ToastPrimitive.Description className="mt-1 text-sm text-gray-700 ">
                Someone requested your review on{" "}
                <span className="font-medium">repository/branch</span>
              </ToastPrimitive.Description>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col px-3 py-2 space-y-1">
              <div className="flex flex-1 h-0">
                <ToastPrimitive.Close className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-gray-700 border border-transparent rounded-lg hover:bg-gray-50 :bg-gray-900 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                  Dismiss
                </ToastPrimitive.Close>
              </div>
            </div>
          </div>
        </div>
      </ToastPrimitive.Root>

      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  );
};

export default Toast;
