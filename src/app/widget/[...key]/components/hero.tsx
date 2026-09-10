"use client";

import { Widgets, WidgetVersions } from "@/lib/db";
import {
  Badge,
  Body1,
  Button,
  Divider,
  Select,
  Text,
  Title1,
  tokens,
  Tooltip,
} from "@fluentui/react-components";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  ArrowDownloadRegular,
  HeartFilled,
  HeartRegular,
  ShareRegular,
} from "@fluentui/react-icons";
import { getStatusText } from "@/lib/utils";
import { useAuth } from "@/store/use-auth";
import { useDataStore } from "@/store/use-data-store";
import { getIfUserLiked, likeAction } from "../actions";
import { usePathname, useRouter } from "next/navigation";

interface HeroProps {
  widget: Widgets;
  creator: string;
  likes: number;
  isAuthor: boolean;
  version: Partial<WidgetVersions>;
  versions: string[];
  tags: string[];
}

const Hero: React.FC<HeroProps> = ({
  widget,
  creator,
  likes,
  isAuthor,
  version,
  versions,
  tags,
}) => {
  const [liked, setLiked] = useState(false);
  const [likesNum, setLikesNum] = useState(likes);
  const { user } = useAuth();
  const clientId = useDataStore((s) => s.clientId);
  const [visibleTooltip, setVisibleTooltip] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user && !clientId) return;

    getIfUserLiked({
      widget_id: widget.id,
      user_id: user?.id,
      anon_id: clientId,
    }).then((liked) => {
      setLiked(liked);
    });
  }, [user, clientId]);

  const onLike = async () => {
    if (!user && !clientId) return;

    setLiked((prev) => !prev);
    setLikesNum((prev) => prev + (liked ? -1 : 1));

    await likeAction({
      liked,
      widget_id: widget.id,
      anon_id: clientId,
      user_id: user?.id,
    });
  };

  return (
    <section className="mt-5">
      <div className="flex flex-col">
        {isAuthor && version.status && (
          <div className="flex items-center mb-3 gap-2">
            <Badge size="large">
              {getStatusText(version.status)} - {version.version}
            </Badge>
            <div>
              <Divider vertical />
            </div>
            <label htmlFor={"versions"}>Versions: </label>
            <Select
              id="versions"
              defaultValue={version.version}
              size="small"
              onChange={(_, { value }) => {
                router.push(pathname + `?version=${value}`);
              }}>
              {versions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>
          </div>
        )}
        <Title1>{version.label}</Title1>
        <Link href={`/creator/${creator}`} className="w-fit">
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
          disabled={version.status !== "PUBLISHED"}
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
        <Tooltip
          content={"Login or use the app to like"}
          relationship="description"
          visible={visibleTooltip && !user && !clientId}
          onVisibleChange={(_, data) => setVisibleTooltip(data.visible)}>
          <Button
            appearance="subtle"
            size="large"
            disabled={version.status !== "PUBLISHED"}
            icon={liked ? <HeartFilled /> : <HeartRegular />}
            onClick={onLike}>
            <span>{liked ? "Liked" : "Like"}</span>
            {likesNum > 0 && (
              <>
                <Divider vertical className="mx-2" />
                <span>{likesNum || "0"}</span>
              </>
            )}
          </Button>
        </Tooltip>
        <Button
          appearance="subtle"
          size="large"
          disabled={version.status !== "PUBLISHED"}
          icon={<ShareRegular />}
          onClick={async () => {
            if (navigator.share) {
              try {
                await navigator.share({
                  title: `Check out ${version.label} on Delta Widgets!`,
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
      {tags.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 mt-5">
          {tags.map((tag) => (
            <Button
              key={tag}
              as="a"
              href={`/tag/${tag}`}
              size="small"
              shape="circular">
              #{tag}
            </Button>
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
