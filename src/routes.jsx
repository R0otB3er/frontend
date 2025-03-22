import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";

import {
  Home,
  Profile,
  FeedingLogEntryForm,
  Adfeedinglog_query,
  MaintenanceEntryForm,
  Maintenance_query,
  MedicalEntryForm,
  Medical_query,
  BulkPurchaseEntryForm,
  Adbulkpurchase_query,
  EmployeeEntryForm,
  Signin_query,
  Notifications,
  TestingForm,
} from "@/pages/dashboard";

import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";

import HomePage from "@/pages/HomePage";
import AnimalsPage from "@/pages/AnimalsPage";
import TicketsPage from "@/pages/TicketsPage";
import AttractionsPage from "@/pages/AttractionsPage";
import ShopPage from "@/pages/ShopPage";

import WebsiteLayout from "@/layouts/WebsiteLayout"; // 👈 Add this

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      { icon: <HomeIcon {...icon} />, name: "dashboard", path: "/home", element: <Home /> },
      { icon: <UserCircleIcon {...icon} />, name: "profile", path: "/profile", element: <Profile /> },
      { icon: <TableCellsIcon {...icon} />, name: "Feeding Log Entry", path: "/Feeding_Log_Entry", element: <FeedingLogEntryForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Feeding Log Query", path: "/Feeding_Log_Query", element: <Adfeedinglog_query /> },
      { icon: <TableCellsIcon {...icon} />, name: "Maintenance Entry", path: "/Maintenance_Entry", element: <MaintenanceEntryForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Maintenance Query", path: "/Maintenance_Query", element: <Maintenance_query /> },
      { icon: <TableCellsIcon {...icon} />, name: "Medical Entry", path: "/Medical_Entry", element: <MedicalEntryForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Medical Query", path: "/Medical_Query", element: <Medical_query /> },
      { icon: <TableCellsIcon {...icon} />, name: "Bulk Purchase Entry", path: "/Bulk_Purchase_Entry", element: <BulkPurchaseEntryForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Bulk Purchase Query", path: "/Bulk_Purchase_Query", element: <Adbulkpurchase_query /> },
      { icon: <TableCellsIcon {...icon} />, name: "Employee Entry", path: "/Employee_Entry", element: <EmployeeEntryForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Sign-in Query", path: "/Sign_in_Query", element: <Signin_query /> },
      { icon: <InformationCircleIcon {...icon} />, name: "notifications", path: "/notifications", element: <Notifications /> },
      { icon: <InformationCircleIcon {...icon} />, name: "Testing", path: "/Testing", element: <TestingForm /> },
    ],
  },
  {
    title: "public pages",
    layout: "public",
    element: <WebsiteLayout />, // 👈 Layout wrapper
    pages: [
      { name: "Home", path: "/", element: <HomePage /> },
      { name: "Animals", path: "/animals", element: <AnimalsPage /> },
      { name: "Tickets", path: "/tickets", element: <TicketsPage /> },
      { name: "Attractions", path: "/attractions", element: <AttractionsPage /> },
      { name: "Shop", path: "/shop", element: <ShopPage /> },
    ],
  },
  {
    title: "auth",
    layout: "standalone",
    pages: [
      { icon: <ServerStackIcon {...icon} />, name: "sign in", path: "/sign-in", element: <SignIn /> },
      { icon: <RectangleStackIcon {...icon} />, name: "sign up", path: "/sign-up", element: <SignUp /> },
    ],
  },
];

export default routes;
