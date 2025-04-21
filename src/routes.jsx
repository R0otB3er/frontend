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
  HabitatView,
  MaintenanceHistory,
  MaintenanceEntryForm,
  Maintenance_query,
  MedicalEntryForm,
  Medical_query,
  BulkPurchaseEntryForm,
  Adbulkpurchase_query,
  EmployeeEntryForm,
  Signin_query,
  TestingForm,
  FeedingLogSearch,
  TicketSalesSearch,
  VendorReport,
  MaintenanceReport,
  MaintenanceRequestForm,
  MaintenanceEditForm,
  FeedingLogHistory,
  FeedingLogEditForm,
  MerchStockView,
  LocationView,
  EmployeeEditForm,
  BulkPurchaseHistory,
  AnimalEdit,
  ClosureHistory,
  EditClosure,
  AddMerch,
  MerchEdit,
  MedicalHistory,
  MedicalEditForm
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
import TicketsOrders from "@/pages/TicketsOrders";
import TicketsPayments from "@/pages/TicketsPayments";
import CartPage from "@/pages/CartPage";
import ShopPayments from "@/pages/ShopPayments";
import OrderHistory from "@/pages/OrderHistory";

// Auth Pages
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import RequireVisitorAuth from "@/pages/auth/RequireVisitorAuth";

// Layouts
import { 
  Admin,
  WebsiteLayout,
  CaretakerDashboard,
  MaintenanceDashboard,
  Manager,
  VisitorLayout,
  ServiceDashboard, 
} from "./layouts";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "admin",
    element: <Admin />,
    pages: [
      { icon: <HomeIcon {...icon} />, name: "dashboard", path: "dashboard", element: <Home /> },
      //{ icon: <UserCircleIcon {...icon} />, name: "profile", path: "profile", element: <Profile /> },
      //{ icon: <TableCellsIcon {...icon} />, name: "Feeding Log Entry", path: "Feeding_Log_Entry", element: <FeedingLogEntryForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Feeding Log Search", path: "Feeding_Log_Search", element: <FeedingLogSearch /> },
      { icon: <TableCellsIcon {...icon} />, name: "Vendor Report", path: "Vendor_Sales", element: <VendorReport /> },
      { icon: <TableCellsIcon {...icon} />, name: "Merchandise Stock", path: "Merch_Stock", element: <MerchStockView /> },
      { icon: <TableCellsIcon {...icon} />, name: "Bulk Purchase History", path: "Bulk_History", element: <BulkPurchaseHistory /> },
      //{ icon: <TableCellsIcon {...icon} />, name: "Feeding Log Query", path: "Feeding_Log_Query", element: <Adfeedinglog_query /> },
      //{ icon: <TableCellsIcon {...icon} />, name: "Maintenance Entry", path: "Maintenance_Entry", element: <MaintenanceEntryForm /> },
     // { icon: <TableCellsIcon {...icon} />, name: "Maintenance Query", path: "Maintenance_Query", element: <Maintenance_query /> },
      //{ icon: <TableCellsIcon {...icon} />, name: "Medical Entry", path: "Medical_Entry", element: <MedicalEntryForm /> },
     // { icon: <TableCellsIcon {...icon} />, name: "Medical Query", path: "Medical_Query", element: <Medical_query /> },
      { icon: <TableCellsIcon {...icon} />, name: "Bulk Purchase Entry", path: "Bulk_Purchase_Entry", element: <BulkPurchaseEntryForm /> },
      //{ icon: <TableCellsIcon {...icon} />, name: "Location View", path: "Location_View", element: <LocationView /> },
     // { icon: <TableCellsIcon {...icon} />, name: "Bulk Purchase Query", path: "Bulk_Purchase_Query", element: <Adbulkpurchase_query /> },
      { icon: <TableCellsIcon {...icon} />, name: "Ticket Sales Search", path: "Ticket_Sales_Search", element: <TicketSalesSearch />,},
      { icon: <TableCellsIcon {...icon} />, name: "Maintenance Report", path: "Maintenance_Log", element: <MaintenanceReport /> },
      { icon: <TableCellsIcon {...icon} />, name: "Employee Entry", path: "Employee_Entry", element: <EmployeeEntryForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Create Merchandise", path: "create_Merch", element: <AddMerch /> },
      //{ icon: <TableCellsIcon {...icon} />, name: "Sign-in Query", path: "Sign_in_Query", element: <Signin_query /> },
      { name: "Employee Edit", path: "Employee_Edit/:employeeId", element: <EmployeeEditForm />, hidden: true },
      { name: "Merchandise Edit", path: "Merchandise_Edit/:Merchandise_ID", element: <MerchEdit />, hidden: true },
      //{ icon: <InformationCircleIcon {...icon} />, name: "Testing", path: "Testing", element: <TestingForm /> },
    ],
  },
  {
    layout: "manager",
    element: <Manager />,
    pages: [
      { icon: <TableCellsIcon {...icon} />, name: "Feeding Log Search", path: "Feeding_Log_Search", element: <FeedingLogSearch /> },
      { icon: <TableCellsIcon {...icon} />, name: "Vendor Report", path: "Vendor_Sales", element: <VendorReport /> },
      { icon: <TableCellsIcon {...icon} />, name: "Merchandise Stock", path: "Merch_Stock", element: <MerchStockView /> },
      { icon: <TableCellsIcon {...icon} />, name: "Bulk Purchase History", path: "Bulk_History", element: <BulkPurchaseHistory /> },
      { icon: <TableCellsIcon {...icon} />, name: "Bulk Purchase Entry", path: "Bulk_Purchase_Entry", element: <BulkPurchaseEntryForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Location View", path: "Location_View", element: <LocationView /> },
      { icon: <TableCellsIcon {...icon} />, name: "Ticket Sales Search", path: "Ticket_Sales_Search", element: <TicketSalesSearch />,},
      { icon: <TableCellsIcon {...icon} />, name: "Maintenance Report", path: "Maintenance_Log", element: <MaintenanceReport /> },
    ],
  },
  {
    layout: "caretaker",
    element: <CaretakerDashboard />,
    pages: [
      { icon: <HomeIcon {...icon} />, name: "dashboard", path: "dashboard", element: <Home /> },
      { icon: <TableCellsIcon {...icon} />, name: "Feeding Log Entry", path: "Feeding_Log_Entry", element: <HabitatView /> },
      { icon: <TableCellsIcon {...icon} />, name: "Feeding Log Search", path: "Feeding_Log_Search", element: <FeedingLogSearch /> },
      { icon: <TableCellsIcon {...icon} />, name: "Feeding Log History", path: "Feeding_Log_History", element: <FeedingLogHistory /> },
      { icon: <TableCellsIcon {...icon} />, name: "Habitats", path: "Habitat_View", element: <HabitatView /> },
      { name: "Feeding Log Edit", path: "FeedingLog_Edit/:feedingId", element: <FeedingLogEditForm />, hidden: true },
      { name: "Medical Log Edit", path: "Medical_Edit/:recordId", element: <MedicalEditForm />, hidden: true },
      { name: "Animal Info Edit", path: "animal_edit/:Animal_ID", element: <AnimalEdit />, hidden: true },
      //{ icon: <TableCellsIcon {...icon} />, name: "Feeding Log Query", path: "Feeding_Log_Query", element: <MaintenanceHistory /> },
      { icon: <TableCellsIcon {...icon} />, name: "Medical Entry", path: "Medical_Entry", element: <MedicalEntryForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Medical History", path: "Medical_History", element: <MedicalHistory /> },
    ],
  },
  {
    layout: "maintenance",
    element: <MaintenanceDashboard />,
    pages: [
      { icon: <HomeIcon {...icon} />, name: "Maintenance Home", path: "dashboard", element: <Mthome /> },
      //{ icon: <TableCellsIcon {...icon} />, name: "Maintenance Entry", path: "Maintenance_Entry", element: <MtMaintenanceEntryForm /> },
      { icon: <TableCellsIcon {...icon} />, name: "Maintenance Request", path: "Maintenance_Request", element: <MaintenanceRequestForm /> },
      //{ icon: <TableCellsIcon {...icon} />, name: "Maintenance Query", path: "Maintenance_Query", element: <MtMaintenance_query /> },
      { icon: <TableCellsIcon {...icon} />, name: "Maintenance History", path: "Maintenance_History", element: <MaintenanceHistory /> },
      { icon: <TableCellsIcon {...icon} />, name: "Closure History", path: "Closure_History", element: <ClosureHistory /> },
      { name: "Maintenance Edit", path: "Maintenance_Edit/:requestId", element: <MaintenanceEditForm />, hidden: true },
      { name: "Closure Edit", path: "Closure_Edit/:closureId", element: <EditClosure />, hidden: true },
    ],
  },
  {
    layout: "service",
    element: <ServiceDashboard />,
    pages: [
      { icon: <HomeIcon {...icon} />, name: "Maintenance Home", path: "dashboard", element: <Mthome /> },
      { icon: <TableCellsIcon {...icon} />, name: "Maintenance Request", path: "Maintenance_Request", element: <MaintenanceRequestForm /> },
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
      { name: "Ticekts Orders", path: "/ticketsorders", element: <TicketsOrders /> },
      { name: "Tickets Payments", path: "/ticketspayments", element: <TicketsPayments />,},
      { name: "Cart", path: "/cart", element: <CartPage /> },
      { name: "Shop Payments", path: "/ShopPayments", element: <ShopPayments /> }
    ],
  },

  {
    layout: "visitor",
    element: (
      <RequireVisitorAuth>
        <VisitorLayout />
      </RequireVisitorAuth>
    ),
    pages: [
      { name: "Home", path: "/visitor/dashboard", element: <HomePage /> },
      { name: "Animals", path: "/visitor/animals", element: <AnimalsPage /> },
      { name: "Tickets", path: "/visitor/tickets", element: <TicketsPage /> },
      { name: "Attractions", path: "/visitor/attractions", element: <AttractionsPage /> },
      { name: "Shop", path: "/visitor/shop", element: <ShopPage /> },
      { name: "Tickets Orders", path: "/visitor/ticketsorders", element: <TicketsOrders /> },
      { name: "Tickets Payments", path: "/visitor/ticketspayments", element: <TicketsPayments /> },
      { name: "Cart", path: "/visitor/cart", element: <CartPage /> },
      { name: "Shop Payments", path: "/visitor/shoppayments", element: <ShopPayments /> },
      { name: "Order History", path: "/visitor/order-history", element: <OrderHistory /> }, 
    ]
  }
  
  ,
  
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