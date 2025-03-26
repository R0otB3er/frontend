import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";

// Admin Pages
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
  TestingForm,
} from "@/pages/dashboard";

// Caretaker Pages
import {
  Cthome,
  Ctprofile,
  CtFeedingLogEntryForm,
  Ctfeedinglog_query,
  CtMedicalEntryForm,
  CtMedical_query,
} from "@/pages/Ctdashboard";

// Maintenance Pages
import {
  Mthome,
  Mtprofile,
  MtMaintenance_query,
  MtMaintenanceEntryForm,
} from "@/pages/Mtdashboard";

// Public Pages
import HomePage from "@/pages/HomePage";
import AnimalsPage from "@/pages/AnimalsPage";
import TicketsPage from "@/pages/TicketsPage";
import AttractionsPage from "@/pages/AttractionsPage";
import ShopPage from "@/pages/ShopPage";

// Auth Pages
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";

// Layouts
import WebsiteLayout from "@/layouts/WebsiteLayout";
import Dashboard from "@/layouts/dashboard";
import CaretakerDashboard from "@/layouts/CaretakerDashboard";
import MaintenanceDashboard from "@/layouts/MaintenanceDashboard";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    element: <Dashboard />,
    pages: [
      { icon: <HomeIcon {...icon} />, name: "dashboard", path: "/dashboard", element: <Home /> },
      { icon: <UserCircleIcon {...icon} />, name: "profile", path: "/dashboard/profile", element: <Profile /> },
      { icon: <TableCellsIcon {...icon} />, name: "Feeding Log Entry", path: "/dashboard/Feeding_Log_Entry", element: <FeedingLogEntryForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Feeding Log Query", path: "/dashboard/Feeding_Log_Query", element: <Adfeedinglog_query /> },
      { icon: <TableCellsIcon {...icon} />, name: "Maintenance Entry", path: "/dashboard/Maintenance_Entry", element: <MaintenanceEntryForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Maintenance Query", path: "/dashboard/Maintenance_Query", element: <Maintenance_query /> },
      { icon: <TableCellsIcon {...icon} />, name: "Medical Entry", path: "/dashboard/Medical_Entry", element: <MedicalEntryForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Medical Query", path: "/dashboard/Medical_Query", element: <Medical_query /> },
      { icon: <TableCellsIcon {...icon} />, name: "Bulk Purchase Entry", path: "/dashboard/Bulk_Purchase_Entry", element: <BulkPurchaseEntryForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Bulk Purchase Query", path: "/dashboard/Bulk_Purchase_Query", element: <Adbulkpurchase_query /> },
      { icon: <TableCellsIcon {...icon} />, name: "Employee Entry", path: "/dashboard/Employee_Entry", element: <EmployeeEntryForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Sign-in Query", path: "/dashboard/Sign_in_Query", element: <Signin_query /> },
      { icon: <InformationCircleIcon {...icon} />, name: "Testing", path: "/dashboard/Testing", element: <TestingForm /> },
    ],
  },
  {
    layout: "caretaker",
    element: <CaretakerDashboard />,
    pages: [
      { icon: <HomeIcon {...icon} />, name: "Caretaker Home", path: "/caretaker", element: <Cthome /> },
      { icon: <UserCircleIcon {...icon} />, name: "Profile", path: "/caretaker/profile", element: <Ctprofile /> },
      { icon: <TableCellsIcon {...icon} />, name: "Feeding Log Entry", path: "/caretaker/Feeding_Log_Entry", element: <CtFeedingLogEntryForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Feeding Log Query", path: "/caretaker/Feeding_Log_Query", element: <Ctfeedinglog_query /> },
      { icon: <TableCellsIcon {...icon} />, name: "Medical Entry", path: "/caretaker/Medical_Entry", element: <CtMedicalEntryForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Medical Query", path: "/caretaker/Medical_Query", element: <CtMedical_query /> },
    ],
  },
  {
    layout: "maintenance",
    element: <MaintenanceDashboard />,
    pages: [
      { icon: <HomeIcon {...icon} />, name: "Maintenance Home", path: "/maintenance", element: <Mthome /> },
      { icon: <UserCircleIcon {...icon} />, name: "Profile", path: "/maintenance/profile", element: <Mtprofile /> },
      { icon: <TableCellsIcon {...icon} />, name: "Maintenance Entry", path: "/maintenance/Maintenance_Entry", element: <MtMaintenanceEntryForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Maintenance Query", path: "/maintenance/Maintenance_Query", element: <MtMaintenance_query /> },
    ],
  },
  {
    title: "public pages",
    layout: "public",
    element: <WebsiteLayout />,
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


