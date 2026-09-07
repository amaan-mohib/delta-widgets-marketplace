"use client";

import { Widgets, WidgetVersions } from "@/lib/db";
import {
  Badge,
  Body1,
  Button,
  Divider,
  Text,
  Title1,
  tokens,
} from "@fluentui/react-components";
import Link from "next/link";
import React from "react";
import {
  ArrowDownloadRegular,
  HeartRegular,
  ShareRegular,
} from "@fluentui/react-icons";
import { getStatusText } from "@/lib/utils";

interface HeroProps {
  widget: Widgets;
  creator: string;
  likes: number;
  isAuthor: boolean;
  version: Partial<WidgetVersions>;
}

const Hero: React.FC<HeroProps> = ({
  widget,
  creator,
  likes,
  isAuthor,
  version,
}) => {
  return (
    <section className="mt-5">
      <div className="flex flex-col">
        {isAuthor && version.status && (
          <div className="mb-3">
            <Badge size="large">
              {getStatusText(version.status)} - {version.version}
            </Badge>
          </div>
        )}
        <Title1>{widget.label}</Title1>
        <Link href={`/user/${creator}`} className="w-fit">
          <Body1
            className="hover:underline"
            style={{
              color: tokens.colorBrandForegroundLink,
            }}>
            @{creator}
          </Body1>
        </Link>
      </div>
      <div className="mt-5">
        <div className="flex items-center">
          <Button
            appearance="subtle"
            size="large"
            shape="circular"
            icon={<HeartRegular />}
          />
          <Text>{likes}</Text>
          <div className="mx-3">
            <Divider vertical />
          </div>
          <ArrowDownloadRegular fontSize={24} />
          <Text className="ml-1">{widget.download_count}</Text>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-5">
        <Button
          appearance="primary"
          size="large"
          icon={<ArrowDownloadRegular />}>
          Install
        </Button>
        <Button appearance="subtle" size="large" icon={<ShareRegular />}>
          Share
        </Button>
      </div>
    </section>
  );
};

export default Hero;
