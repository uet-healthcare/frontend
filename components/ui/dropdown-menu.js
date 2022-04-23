import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import cx from "classnames";
import Link from "next/link";
import React from "react";
import Button from "components/ui/shared/button";

const DropdownMenu = (props) => {
  const { children, items } = props;
  return (
    <div className="relative inline-flex items-center justify-center text-left">
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger asChild>
          <Button>{children}</Button>
        </DropdownMenuPrimitive.Trigger>

        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={5}
          className={cx(
            " radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down",
            "w-192  rounded-lg px-6  py-4  shadow-md md:w-224 ",
            "bg-white"
          )}
        >
          {items.map(({ label, icon, link, onClick }, i) =>
            link ? (
              <Link key={`${label}-${i}`} href={link}>
                <a>
                  <DropdownMenuPrimitive.Item
                    key={`${label}-${i}`}
                    className={cx(
                      "flex cursor-default select-none items-center rounded-md px-8  py-8  text-xs outline-none",
                      "text-gray-400 focus:bg-gray-50"
                    )}
                  >
                    {icon}
                    <span className="flex-grow text-gray-700">{label}</span>
                  </DropdownMenuPrimitive.Item>
                </a>
              </Link>
            ) : (
              <DropdownMenuPrimitive.Item
                key={`${label}-${i}`}
                className={cx(
                  "flex cursor-default select-none items-center rounded-md px-8  py-8  text-xs outline-none",
                  "text-gray-400 focus:bg-gray-50"
                )}
                onClick={onClick}
              >
                {icon}
                <span className="flex-grow text-gray-700">{label}</span>
              </DropdownMenuPrimitive.Item>
            )
          )}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Root>
    </div>
  );
};

export default DropdownMenu;
