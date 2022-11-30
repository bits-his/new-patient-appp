import React from "react";
import HorizontalMenu from "../comp/components/horizontal-menu/HorizontalMenu";
import HorizontalMenuItem from "../comp/components/horizontal-menu/HorizontalMenuItem";
import { MdDashboard } from "react-icons/md";
// import { IoIosList } from "react-icons/io";
import { FiSettings, FiShoppingCart } from "react-icons/fi";
import { FaClipboardList, FaList, FaReply } from "react-icons/fa";
import { AiOutlineFileDone } from "react-icons/ai";
import { BiTransfer } from "react-icons/bi";

function PharmacyMenu() {
  // const accessTo = useSelector((state) => state.auth.user.accessTo);
  // const _accessTo = accessTo.lenght ? accessTo.split(",") : [];
  const menu = [
    {
      label: "Main Dashboard",
      path: "/me/pharmacy/main-dashboard",
      icon: <MdDashboard size={20} style={{ marginRight: 5 }} />,
    },
    {
      label: "Dashboard",
      path: "/me/pharmacy/dashboard",
      icon: <MdDashboard size={20} style={{ marginRight: 5 }} />,
    },
    {
      label: "Manage Store",
      path: "/me/pharmacy/manage-store",
      icon: <FiSettings size={20} style={{ marginRight: 5 }} />,
    },
    {
      label: "Manage Suppliers",
      path: "/me/pharmacy/manage-suppliers",
      icon: <FiSettings size={20} style={{ marginRight: 5 }} />,
    },
    {
      label: "Inventory",
      path: "/me/pharmacy/drug-purchase?type=with-alert",
      icon: <AiOutlineFileDone size={20} style={{ marginRight: 5 }} />,
    },
    // { label: "Client Registration", path: "manage-customer" },
    {
      label: "Drug Sales",
      path: "/me/pharmacy/drug-sales?type=sales",
      icon: <FiShoppingCart size={20} style={{ marginRight: 5 }} />,
    },
    {
      label: "Returned Drugs",
      path: "/me/pharmacy/returned-drugs?type=return",
      icon: <FaClipboardList size={20} style={{ marginRight: 5 }} />,
    },
    {
      label: "Transfer",
      path: "/me/pharmacy/transfer",
      icon: <BiTransfer size={20} style={{ marginRight: 5 }} />,
    },
    {
      label: "Drug List",
      path: "/me/pharmacy/drug-list",
      icon: <FaList size={20} style={{ marginRight: 5 }} />,
    },
    {
      label: "Reprint",
      path: "/me/pharmacy/reprint",
      icon: <FaReply size={20} style={{ marginRight: 5 }} />,
    },
    // { label: "Description", path: "description" },
  ];
  return (
    <HorizontalMenu>
      {menu.map((item, index) => (
        <HorizontalMenuItem key={index} route={item.path}>
          {item.icon} {item.label}
        </HorizontalMenuItem>
      ))}
    </HorizontalMenu>
  );
}

export default PharmacyMenu;
