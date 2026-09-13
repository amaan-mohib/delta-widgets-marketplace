import { Header } from "@/components/header";
import DashboardSidebar from "../components/sidebar";
import ProfilePage from "./profile-page";

export const instant = false;

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
  return (
    <>
      <Header isDashboard />
      <main className="container flex mx-auto px-4 sm:px-6 lg:px-8 relative">
        <DashboardSidebar activeTab="profile" />
        <div className="flex-1 p-3">
          <ProfilePage />
        </div>
      </main>
    </>
  );
};

export default Profile;
