"use client";

import { getStatusText } from "@/lib/utils";
import {
  Badge,
  Body1Strong,
  Caption1,
  Card,
  CardHeader,
  CardPreview,
  tokens,
} from "@fluentui/react-components";
import { IconDownload, IconHeart } from "@tabler/icons-react";

export interface WidgetCardProps {
  widget: {
    id: number;
    key: string;
    label: string;
    creator: string;
    screenshot_src: string;
    download_count: string | number | null;
    status?: string;
    likes?: string | null | number;
  };
  showStatus?: boolean;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ widget, showStatus }) => {
  return (
    <a href={`/widget/${widget.key}`}>
      <Card
        size="small"
        appearance="filled-alternative"
        onClick={() => {}}
        className="h-full min-h-42.5">
        <CardHeader
          header={<Body1Strong>{widget.label}</Body1Strong>}
          description={
            <Caption1 style={{ color: tokens.colorBrandForegroundLink }}>
              @{widget.creator}
            </Caption1>
          }
        />
        <CardPreview className="p-3 my-auto h-full">
          <img
            className="object-scale-down"
            src={widget.screenshot_src}
            alt={widget.label}
            style={{ maxHeight: 150 }}
          />
        </CardPreview>
        <div className="flex items-center justify-center gap-3">
          {showStatus && widget.status && (
            <Badge className="mr-auto">{getStatusText(widget.status)}</Badge>
          )}
          <div className="flex items-center gap-1">
            <IconDownload style={{ width: 18 }} />{" "}
            <Caption1>{widget.download_count || 0}</Caption1>
          </div>
          <div className="flex items-center gap-1">
            <IconHeart style={{ width: 18 }} />{" "}
            <Caption1>{widget.likes ?? 0}</Caption1>
          </div>
        </div>
      </Card>
    </a>
  );
};

export default WidgetCard;
