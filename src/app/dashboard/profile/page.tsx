import { Header } from "@/components/header";
import DashboardSidebar from "../components/sidebar";

export const instant = false;

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
  return (
    <>
      <Header isDashboard />
      <main className="container flex mx-auto px-4 sm:px-6 lg:px-8 relative">
        <DashboardSidebar activeTab="profile" />
      </main>
    </>
  );
};

export default Profile;
