"use client";

import { IUploadManifest } from "@/lib/types/manifest";
import { humanStorageSize } from "@/lib/utils";
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
  Delete16Regular,
} from "@fluentui/react-icons";
import { path } from "@tauri-apps/api";
import { convertFileSrc } from "@tauri-apps/api/core";
import { message, open } from "@tauri-apps/plugin-dialog";
import { lstat } from "@tauri-apps/plugin-fs";
import { arrayMoveImmutable } from "array-move";

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

  const removeScreenshot = (ssPath: string) => {
    onChange(screenshots.filter((ss) => ss.path !== ssPath));
  };

  const moveScreenshot = (from: number, to: number) => {
    onChange(arrayMoveImmutable(screenshots, from, to));
  };

  return (
    <div className="flex flex-col gap-3">
      {screenshots.map((ss, index) => (
        <Card key={ss.path} appearance="outline" size="small">
          <CardHeader
            image={
              <img
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
    </div>
  );
};

export default FormScreenshots;
