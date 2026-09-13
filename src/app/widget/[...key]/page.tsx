import RootLayout from "@/components/root-layout";
import { Suspense } from "react";
import WidgetPage from "./widget-page";
import Loader from "../../../components/loader";

const Widget = async (props: PageProps<"/widget/[...key]">) => {
  return (
    <RootLayout>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<Loader />}>
          <WidgetPage {...props} />
        </Suspense>
      </main>
    </RootLayout>
  );
};

export default Widget;
