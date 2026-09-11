"use client";

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
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeroProps {
  tab: "discover" | "categories" | "tags";
}

const Hero: React.FC<HeroProps> = ({ tab }) => {
  const router = useRouter();
  return (
    <section>
      <div className="flex flex-col gap-2 pt-8 pb-5">
        <Title1 as="h1">Explore what people are building</Title1>
        <Body1 as="h2">
          Browse community-made widgets, discover new ideas, and find something
          to make your own.
        </Body1>
      </div>
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
        <div className="flex items-center gap-2 ml-13">
          <Link href="/search">
            <Button appearance="subtle" icon={<SearchRegular />} />
          </Link>
          <Button
            appearance="subtle"
            icon={<ArrowClockwiseRegular />}
            onClick={() => router.refresh()}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
