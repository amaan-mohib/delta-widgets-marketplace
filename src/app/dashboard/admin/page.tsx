import { Metadata } from "next";
import AdminPage from "./audit-page";
import Notifications from "./notifications";

export const instant = false;

export const metadata: Metadata = {
  title: "Admin",
};

const Admin = () => {
  return (
    <div>
      <AdminPage />
      <Notifications />
    </div>
  );
};

export default Admin;
