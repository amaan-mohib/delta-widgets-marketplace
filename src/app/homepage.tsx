"use client";

import WidgetCard, { WidgetCardProps } from "@/components/widget-card";
import { Button, Subtitle1 } from "@fluentui/react-components";
import { ArrowRightRegular } from "@fluentui/react-icons";
import Link from "next/link";

interface HomepageProps {
  trending: WidgetCardProps["widget"][];
  newWidgets: WidgetCardProps["widget"][];
  popular: WidgetCardProps["widget"][];
}

const Homepage: React.FC<HomepageProps> = ({
  trending,
  newWidgets,
  popular,
}) => {
  return (
    <div>
      <div className="mt-5">
        <Subtitle1>Trending</Subtitle1>
      </div>
      <div
        className="grid py-5 gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fit, 200px)" }}>
        {trending.map((item) => (
          <WidgetCard key={item.key} widget={item} />
        ))}
      </div>
      {newWidgets.length > 0 && (
        <>
          <div className="mt-5">
            <Subtitle1>New Widgets</Subtitle1>
          </div>
          <div
            className="grid py-5 gap-3"
            style={{ gridTemplateColumns: "repeat(auto-fit, 200px)" }}>
            {newWidgets.map((item) => (
              <WidgetCard key={item.key} widget={item} />
            ))}
          </div>
        </>
      )}
      {popular.length > 0 && (
        <>
          <div className="mt-5">
            <Subtitle1>Popular</Subtitle1>
          </div>
          <div
            className="grid py-5 gap-3"
            style={{ gridTemplateColumns: "repeat(auto-fit, 200px)" }}>
            {popular.map((item) => (
              <WidgetCard key={item.key} widget={item} />
            ))}
          </div>
        </>
      )}
      <div className="py-5 grid place-items-center">
        <Link href={"/search"}>
          <Button
            size="large"
            appearance="primary"
            shape="circular"
            icon={<ArrowRightRegular />}
            iconPosition="after">
            Browse more
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
