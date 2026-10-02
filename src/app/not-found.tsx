"use client";

import RootLayout from "@/components/root-layout";
import { Body1, Divider, Title3 } from "@fluentui/react-components";

interface NotFoundProps {}

const NotFound: React.FC<NotFoundProps> = () => {
  return (
    <RootLayout>
      <main className="flex w-full items-center justify-center">
        <section className="flex flex-1 items-center justify-center h-full">
          <Title3>404</Title3>
          <div className="mx-5">
            <Divider vertical />
          </div>
          <Body1>This page could not be found.</Body1>
        </section>
      </main>
    </RootLayout>
  );
};

export default NotFound;
