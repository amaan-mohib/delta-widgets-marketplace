"use client";

import {
  Body1,
  Button,
  Tab,
  TabList,
  Title1,
  Tooltip,
} from "@fluentui/react-components";
import {
  ArrowClockwiseRegular,
  BoardRegular,
  CollectionsEmptyRegular,
  SearchRegular,
  TagRegular,
} from "@fluentui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface HeroProps {
  tab: "discover" | "categories" | "tags" | "search";
}

const Hero: React.FC<HeroProps> = ({ tab }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <section>
      <div className="flex flex-col gap-2 pt-8 pb-5">
        <Title1 as="h1">Explore what people are building</Title1>
        <Body1 as="h2">
          Browse community-made widgets, discover new ideas, and find something
          to make your own.
        </Body1>
      </div>
      {tab !== "search" && (
        <div className="flex items-center overflow-auto flex-wrap">
          <div className="-ml-3">
            <TabList selectedValue={tab}>
              <Link href="/">
                <Tab value="discover" icon={<BoardRegular />}>
                  Discover
                </Tab>
              </Link>
              <Link href="/categories">
                <Tab value="categories" icon={<CollectionsEmptyRegular />}>
                  Categories
                </Tab>
              </Link>
              <Link href="/tags">
                <Tab value="tags" icon={<TagRegular />}>
                  Tags
                </Tab>
              </Link>
            </TabList>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Tooltip
              relationship="label"
              content={"Search"}
              positioning={"below"}>
              <Link href="/search">
                <Button appearance="subtle" icon={<SearchRegular />} />
              </Link>
            </Tooltip>
            <Tooltip
              relationship="label"
              content={"Refresh"}
              positioning={"below-end"}>
              <Button
                appearance="subtle"
                disabled={isPending}
                icon={<ArrowClockwiseRegular />}
                onClick={handleRefresh}
              />
            </Tooltip>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
