import { Metadata } from "next";
import AdminPage from "./audit-page";

export const instant = false;

export const metadata: Metadata = {
  title: "Admin",
};

const Admin = () => {
  return <AdminPage />;
};

export default Admin;
