import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import { useAppDispatch, useAppSelector } from "../hooks";
import { NavLink } from "react-router-dom";

type SideBarLinkProps = {
  href: string;
  icon: AntdIconProps;
  label: string;
  isCollapsed: boolean;
};

function SideBarLink({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SideBarLinkProps) {
  const isSidebarCollapsed = useAppSelector(
    (store) => store.globalState.isSidebarCollapsed,
  );

  const dispatch = useAppDispatch();

  const activeClass =
    "w-ful relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 bg-gray-100 text-white";

  const normalClass =
    "w-full relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100";

  return (
    <NavLink
      to={href}
      className={({ isActive }) => (isActive ? activeClass : normalClass)}
    >
      {/* <Icon /> */}
    </NavLink>
  );
}

export default SideBarLink;
