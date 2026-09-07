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
import React, { useState } from "react";
import {
  ArrowDownloadRegular,
  HeartFilled,
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
  const [liked, setLiked] = useState(false);
  const [likesNum, setLikesNum] = useState(likes);

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
      <div className="flex items-center gap-2 mt-5">
        <Button
          appearance="primary"
          size="large"
          icon={<ArrowDownloadRegular />}>
          <span>Install</span>
          {Number(widget.download_count ?? 0) > 0 && (
            <>
              <Divider vertical className="mx-2" appearance="brand" />
              <span>{widget.download_count}</span>
            </>
          )}
        </Button>
        <Button
          appearance="subtle"
          size="large"
          icon={liked ? <HeartFilled /> : <HeartRegular />}
          onClick={() => {
            if (liked) {
              setLiked(false);
              setLikesNum((prev) => prev - 1);
            } else {
              setLiked(true);
              setLikesNum((prev) => prev + 1);
            }
          }}>
          <span>Like</span>
          {likesNum > 0 && (
            <>
              <Divider vertical className="mx-2" />
              <span>{likesNum || "0"}</span>
            </>
          )}
        </Button>
        <Button
          appearance="subtle"
          size="large"
          icon={<ShareRegular />}
          onClick={async () => {
            if (navigator.share) {
              try {
                await navigator.share({
                  title: `Check out ${widget.label} on Delta Widgets!`,
                  url: window.location.href,
                });
              } catch (err) {
                console.error(err);
              }
            }
          }}>
          Share
        </Button>
      </div>
    </section>
  );
};

export default Hero;
