"use client";

import WidgetCard, { WidgetCardProps } from "@/components/widget-card";
import WidgetGrid from "@/components/widget-grid";
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
      {newWidgets.length > 0 && (
        <>
          <div className="mt-5">
            <Subtitle1>New Widgets</Subtitle1>
          </div>
          <WidgetGrid className="py-5">
            {newWidgets.map((item) => (
              <WidgetCard key={item.key} widget={item} />
            ))}
          </WidgetGrid>
        </>
      )}
      {trending.length > 0 && (
        <>
          <div className="mt-5">
            <Subtitle1>Trending</Subtitle1>
          </div>
          <WidgetGrid className="py-5">
            {trending.map((item) => (
              <WidgetCard key={item.key} widget={item} />
            ))}
          </WidgetGrid>
        </>
      )}
      {popular.length > 0 && (
        <>
          <div className="mt-5">
            <Subtitle1>Popular</Subtitle1>
          </div>
          <WidgetGrid className="py-5">
            {popular.map((item) => (
              <WidgetCard key={item.key} widget={item} />
            ))}
          </WidgetGrid>
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
