import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Adfeedinglog_query, Maintenance_query, Medical_query, Adbulkpurchase_query, Signin_query, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Feeding Log Query",
        path: "/Feeding_Log_Query",
        element: <Adfeedinglog_query />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Maintenance Query",
        path: "/Maintenance_Query",
        element: <Maintenance_query />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Medical Query",
        path: "/Medical_Query",
        element: <Medical_query />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Bulk Purchase Query",
        path: "/Bulk_Purchase_Query",
        element: <Adbulkpurchase_query />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Sign-in Query",
        path: "/Sign_in_Query",
        element: <Signin_query />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
