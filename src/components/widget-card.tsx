"use client";

import {
  Body1Strong,
  Caption1,
  Card,
  CardHeader,
  CardPreview,
  Link,
} from "@fluentui/react-components";
import { IconDownload, IconHeart } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";

interface WidgetCardProps {
  widget: any;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ widget }) => {
  const router = useRouter();

  return (
    <Card
      appearance="filled-alternative"
      onClick={() => router.push(`/widget/${widget.key}`)}>
      <CardHeader
        header={<Body1Strong>{widget.label}</Body1Strong>}
        description={
          <Caption1>
            <Link
              href={`/user/@${widget.creator}`}
              onClick={(e) => e.stopPropagation()}>
              @{widget.creator}
            </Link>
          </Caption1>
        }
      />
      <CardPreview className="p-3 my-auto">
        <img src={widget.thumbnail} alt={widget.label} style={{ width: 200 }} />
      </CardPreview>
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-1">
          <IconDownload style={{ width: 18 }} />{" "}
          <Caption1>{widget.downloads}</Caption1>
        </div>
        <div className="flex items-center gap-1">
          <IconHeart style={{ width: 18 }} />{" "}
          <Caption1>{widget.downloads}</Caption1>
        </div>
      </div>
    </Card>
  );
};

export default WidgetCard;
