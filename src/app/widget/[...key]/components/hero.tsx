"use client";

import { Assets, UserProfiles, Widgets, WidgetVersions } from "@/lib/db";
import {
  Badge,
  Body1,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Divider,
  Select,
  Spinner,
  Title1,
  tokens,
  Tooltip,
} from "@fluentui/react-components";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDownloadRegular,
  HeartFilled,
  HeartRegular,
  RibbonStarRegular,
  ShareRegular,
} from "@fluentui/react-icons";
import { focusMainWindow, getStatusText, setTimeoutAsync } from "@/lib/utils";
import { useAuth } from "@/store/use-auth";
import { useDataStore } from "@/store/use-data-store";
import {
  deleteWidget,
  getIfUserLiked,
  likeAction,
  updateDownloadCount,
} from "../actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DonationDialog from "@/components/donation-dialog";
import { DEEP_LINK_BASE_URL } from "@/lib/constants";
import { commands, IDownloadWidgetParams } from "@/lib/commands";
import { path } from "@tauri-apps/api";
import { appDataDir } from "@tauri-apps/api/path";
import { exists, readDir, readTextFile } from "@tauri-apps/plugin-fs";
import { emitTo } from "@tauri-apps/api/event";
import WidgetEdit from "./edit";

const getInstalledStatus = async (key: string, version?: string | null) => {
  const widgetDir = await path.join(
    await appDataDir(),
    "widgets",
    key,
    "manifest.json",
  );
  if (await exists(widgetDir)) {
    const manifest = JSON.parse(await readTextFile(widgetDir));
    return {
      installed: true,
      needsUpdate: (manifest.version || "v1") !== version,
    };
  }
  return { installed: false, needsUpdate: false };
};

interface HeroProps {
  widget: Widgets;
  creator: Pick<UserProfiles, "username" | "donation_links">;
  likes: number;
  isAuthor: boolean;
  version: Partial<WidgetVersions>;
  versions: string[];
  tags: string[];
  assets: Assets[];
}

const Hero: React.FC<HeroProps> = ({
  widget,
  creator,
  likes,
  isAuthor,
  version,
  versions,
  tags,
  assets,
}) => {
  const [liked, setLiked] = useState(false);
  const [likesNum, setLikesNum] = useState(likes);
  const { user } = useAuth();
  const clientId = useDataStore((s) => s.clientId);
  const isInApp = useDataStore((s) => s.isInApp);
  const [visibleTooltip, setVisibleTooltip] = useState(false);
  const [open, setOpen] = useState(false);
  const [installStatus, setInstallStatus] = useState({
    installed: false,
    needsUpdate: false,
  });
  const [installing, setInstalling] = useState(false);
  const [editing, setEditing] = useState(false);
  const autoInstallStarted = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  useEffect(() => {
    if (!isInApp) return;

    const getStatus = async () => {
      try {
        setInstalling(true);
        const data = await getInstalledStatus(
          widget.key.replace(/\//g, "-"),
          version.version,
        );
        setInstallStatus(data);
        setInstalling(false);
      } catch (error) {
        console.error(error);
        setInstalling(false);
      }
    };

    getStatus();
  }, [isInApp, version]);

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

  const onInstall = useCallback(async () => {
    if (version.status !== "PUBLISHED" || installing) return;
    if (!isInApp) {
      window.open(`${DEEP_LINK_BASE_URL}install?key=${widget.key}`);
      return;
    }

    try {
      if (installStatus.installed && !installStatus.needsUpdate) {
        await focusMainWindow();
        await emitTo("main", "focus-widget", widget.key);
        return;
      }
      setInstalling(true);
      const files: IDownloadWidgetParams["files"] = {
        manifest: "",
        assets: null,
        thumb: null,
      };
      assets.forEach((item) => {
        if (item.asset_type === "MANIFEST") {
          files.manifest = item.src;
        }
        if (item.asset_type === "WIDGET_ASSET") {
          files.assets = item.src;
        }
        if (
          item.asset_type === "SCREENSHOT" &&
          item.src.endsWith("thumb.png")
        ) {
          files.thumb = item.src;
        }
      });
      await commands.downloadWidget({
        key: widget.key,
        files,
      });
      await updateDownloadCount(widget.id, widget.key, version.version);
      await setTimeoutAsync(1000);
      if (files.assets && widget.widget_type === "JSON") {
        const assetsDir = await path.join(
          await appDataDir(),
          "widgets",
          widget.key.replace(/\//g, "-"),
          "assets",
        );
        const entries = await readDir(assetsDir);
        for (const entry of entries) {
          if (entry.isFile) {
            await commands.copyCustomAssets({
              key: entry.name,
              path: await path.join(assetsDir, entry.name),
            });
          }
        }
      }
      await emitTo("main", "focus-widget", widget.key);
      setInstalling(false);
    } catch (error) {
      console.error(error);
      alert("Failed to install widget");
      setInstalling(false);
    }
  }, [
    assets,
    installStatus.installed,
    installStatus.needsUpdate,
    installing,
    isInApp,
    version.status,
    version.version,
    widget.id,
    widget.key,
  ]);

  useEffect(() => {
    if (!isInApp || installing || autoInstallStarted.current) return;

    const autoInstall = searchParams.get("install") === "true";
    if (!autoInstall) return;

    const timeout = setTimeout(() => {
      autoInstallStarted.current = true;
      onInstall();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isInApp, installing, onInstall, searchParams]);

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
        <div className="flex items-center gap-2">
          <Link href={`/creator/${creator.username}`} className="w-fit">
            <Body1
              className="hover:underline"
              style={{
                color: tokens.colorBrandForegroundLink,
              }}>
              @{creator.username}
            </Body1>
          </Link>
          {creator.donation_links?.length !== 0 && (
            <>
              <div>
                <Divider vertical />
              </div>
              <Button
                style={{ width: "fit-content" }}
                appearance="outline"
                icon={<RibbonStarRegular fontSize={16} />}
                size="small"
                onClick={() => setOpen(true)}>
                Tip Creator
              </Button>
              <DonationDialog
                username={creator.username}
                open={open}
                setOpen={setOpen}
                links={creator.donation_links}
              />
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-5">
        <Button
          disabled={version.status !== "PUBLISHED" || installing}
          appearance="primary"
          size="large"
          icon={installing ? <Spinner size="tiny" /> : <ArrowDownloadRegular />}
          onClick={onInstall}>
          <span>
            {installStatus.installed
              ? installStatus.needsUpdate
                ? "Update"
                : "Open"
              : "Install"}
          </span>
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
        {user?.role === "admin" && version.status !== "PUBLISHED" && (
          <>
            <Dialog>
              <DialogTrigger disableButtonEnhancement>
                <Button>Delete widget</Button>
              </DialogTrigger>
              <DialogSurface>
                <DialogBody>
                  <DialogTitle>Delete {version.label}</DialogTitle>
                  <DialogContent>
                    This action is permanent. Are you sure you want to continue?
                  </DialogContent>
                  <DialogActions>
                    <DialogTrigger disableButtonEnhancement>
                      <Button
                        appearance="primary"
                        onClick={async () => {
                          await deleteWidget(
                            widget.id,
                            widget.key,
                            version.version,
                          );
                          router.replace("/dashboard");
                        }}>
                        Delete widget
                      </Button>
                    </DialogTrigger>
                    <DialogTrigger disableButtonEnhancement>
                      <Button appearance="secondary">Cancel</Button>
                    </DialogTrigger>
                  </DialogActions>
                </DialogBody>
              </DialogSurface>
            </Dialog>
            <Button onClick={() => setEditing(true)}>Edit Widget</Button>
          </>
        )}
      </div>
      {tags.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 mt-5">
          {tags.map((tag) => (
            <Button
              key={tag}
              as="a"
              href={`/tags/${tag}`}
              size="small"
              shape="circular">
              #{tag}
            </Button>
          ))}
        </div>
      )}
      {editing && (
        <WidgetEdit
          widget={widget}
          version={version}
          tags={tags}
          onClose={() => setEditing(false)}
        />
      )}
    </section>
  );
};

export default Hero;
