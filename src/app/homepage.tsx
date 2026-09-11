"use client";

import WidgetCard, { WidgetCardProps } from "@/components/widget-card";
import { Subtitle1 } from "@fluentui/react-components";

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
    </div>
  );
};

export default Homepage;
