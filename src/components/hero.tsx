"use client";

// import { handleOAuthSignIn } from "@/app/api/auth/signup/actions";
// import { authClient, handleOAuthSignIn } from "@/lib/auth/client";
import {
  Body1,
  Button,
  Tab,
  TabList,
  Title1,
} from "@fluentui/react-components";
import {
  ArrowClockwiseRegular,
  BoardRegular,
  CollectionsEmptyRegular,
  SearchRegular,
  TagRegular,
} from "@fluentui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isTauri } from "@tauri-apps/api/core";

interface HeroProps {
  tab: "discover" | "categories" | "tags";
}

const Hero: React.FC<HeroProps> = ({ tab }) => {
  const router = useRouter();

  // useEffect(() => {
  //   authClient.getSession().then(({ data }) => {
  //     console.log(data);

  //     if (data?.session) {
  //       // setUser(data.session.user);
  //     }
  //     // setLoading(false);
  //   });
  // }, []);

  useEffect(() => {
    console.log({ isTauri: isTauri() });
  }, []);

  return (
    <section>
      <div className="flex flex-col gap-2 pt-8 pb-5">
        <Title1 as="h1">Explore what people are building</Title1>
        <Body1 as="h2">
          Browse community-made widgets, discover new ideas, and find something
          to make your own.
        </Body1>
      </div>
      {/* <button onClick={() => handleOAuthSignIn("google")}>
        sign in google
      </button> */}
      <div className="flex items-center justify-between overflow-auto">
        <div>
          <TabList
            selectedValue={tab}
            onTabSelect={(_, { value }) => {
              switch (value) {
                case "discover":
                  router.push("/");
                  break;
                case "categories":
                case "tags":
                  router.push("/" + value);
                  break;
                default:
                  break;
              }
            }}>
            <Tab value="discover" icon={<BoardRegular />}>
              Discover
            </Tab>
            <Tab value="categories" icon={<CollectionsEmptyRegular />}>
              Categories
            </Tab>
            <Tab value="tags" icon={<TagRegular />}>
              Tags
            </Tab>
          </TabList>
        </div>
        <div className="flex items-center gap-2">
          <Button
            appearance="subtle"
            icon={<SearchRegular />}
            onClick={() => router.push("/search")}
          />
          <Button appearance="subtle" icon={<ArrowClockwiseRegular />} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
