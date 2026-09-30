"use client";

import { commands } from "@/lib/commands";
import { IUploadManifest } from "@/lib/types/manifest";
import {
  closeWidgetWindow,
  createWidgetWindow,
  humanStorageSize,
  setTimeoutAsync,
} from "@/lib/utils";
import { getWidgetScreenshots } from "@/store/store-actions";
import { useUploadStore } from "@/store/use-upload-store";
import {
  Body1Strong,
  Button,
  Caption1,
  Card,
  CardFooter,
  CardHeader,
} from "@fluentui/react-components";
import {
  AddRegular,
  ArrowDown16Regular,
  ArrowUp16Regular,
  CameraRegular,
  Delete16Regular,
} from "@fluentui/react-icons";
import { path } from "@tauri-apps/api";
import { convertFileSrc } from "@tauri-apps/api/core";
import { message, open } from "@tauri-apps/plugin-dialog";
import { lstat } from "@tauri-apps/plugin-fs";
import { arrayMoveImmutable } from "array-move";
import { useState } from "react";

interface FormScreenshotsProps {
  screenshots: IUploadManifest["screenshots"];
  onChange: (value: IUploadManifest["screenshots"]) => void;
  disabled: boolean;
}

const FormScreenshots: React.FC<FormScreenshotsProps> = ({
  screenshots = [],
  onChange,
  disabled,
}) => {
  const selectedWidget = useUploadStore((s) => s.selectedWidget);
  const [captureLoading, setCaptureLoading] = useState(false);

  const addScreenshot = async () => {
    try {
      const ssPaths = await open({
        multiple: true,
        filters: [
          { extensions: ["png", "jpg", "webp", "jpeg"], name: "Images" },
        ],
      });
      const newScreenshots: IUploadManifest["screenshots"] = [];
      for (const p of ssPaths || []) {
        if (screenshots.map((s) => s.path).includes(p)) {
          continue;
        }
        const [info, fileName] = await Promise.all([
          lstat(p),
          path.basename(p),
        ]);
        newScreenshots.push({
          fileName,
          path: p,
          fileSize: info.size,
        });
      }
      onChange([...screenshots, ...newScreenshots]);
    } catch (error) {
      message("Something went wrong while selecting screenshots", {
        kind: "error",
      }).catch(console.error);
    }
  };

  const captureScreenshot = async () => {
    if (!selectedWidget) return;
    try {
      setCaptureLoading(true);
      const label = `widget-${selectedWidget.manifest.key}`;
      const visible = selectedWidget.manifest.visible || false;
      if (!visible) {
        await createWidgetWindow(selectedWidget.manifestPath);
      }
      await setTimeoutAsync(2000);
      const customName = `capture-${new Date().getTime()}.png`;
      const imgPath = await commands.captureWidgetScreenshot({
        label,
        manifestPath: selectedWidget.manifestPath,
        refresh: true,
        customName,
      });
      if (!visible) {
        await closeWidgetWindow(label);
      }
      const info = await lstat(imgPath);
      onChange([
        ...screenshots,
        {
          fileName: customName,
          path: imgPath,
          fileSize: info.size,
        },
      ]);
      setCaptureLoading(false);
    } catch (error) {
      setCaptureLoading(false);
      message("Something went wrong while capturing screenshot", {
        kind: "error",
      }).catch(console.error);
    }
  };

  const removeScreenshot = (ssPath: string) => {
    onChange(screenshots.filter((ss) => ss.path !== ssPath));
  };

  const moveScreenshot = (from: number, to: number) => {
    onChange(arrayMoveImmutable(screenshots, from, to));
  };

  return (
    <div className="flex flex-col gap-3">
      {screenshots.map((ss, index) => (
        <Card
          key={`${ss.path}+${ss.fileName}`}
          appearance="outline"
          size="small">
          <CardHeader
            image={
              <img
                className="object-scale-down"
                src={
                  ss.path.startsWith("http") ? ss.path : convertFileSrc(ss.path)
                }
                style={{ width: 150, maxWidth: 150 }}
                alt={ss.fileName}
              />
            }
            header={
              <div className="flex flex-col gap-1">
                <Body1Strong>{ss.fileName}</Body1Strong>
                <Caption1>{humanStorageSize(ss.fileSize ?? 0, true)}</Caption1>
              </div>
            }
          />
          <CardFooter className="justify-end" style={{ gap: 4 }}>
            {index > 0 && (
              <Button
                appearance="subtle"
                disabled={disabled}
                icon={<ArrowUp16Regular />}
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  moveScreenshot(index, index - 1);
                }}>
                Move up
              </Button>
            )}
            {index !== screenshots.length - 1 && (
              <Button
                appearance="subtle"
                disabled={disabled}
                icon={<ArrowDown16Regular />}
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  moveScreenshot(index, index + 1);
                }}>
                Move down
              </Button>
            )}
            {screenshots.length > 1 && (
              <Button
                appearance="subtle"
                disabled={disabled}
                icon={<Delete16Regular />}
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  removeScreenshot(ss.path);
                }}>
                Remove
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
      <div className="flex items-center gap-2">
        <Button
          icon={<AddRegular />}
          appearance="secondary"
          disabled={disabled}
          onClick={(e) => {
            e.preventDefault();
            addScreenshot();
          }}>
          Add screenshots
        </Button>
        <Button
          icon={<CameraRegular />}
          appearance="secondary"
          disabled={disabled || captureLoading}
          onClick={(e) => {
            e.preventDefault();
            captureScreenshot();
          }}>
          Capture screenshot
        </Button>
      </div>
    </div>
  );
};

export default FormScreenshots;
