"use client";

import WidgetPreview from "@/components/WidgetPreview";
import { commands, IGetAllWidget } from "@/lib/commands";
import { templateWidgets } from "@/lib/constants";
import { useDataStore } from "@/store/useDataStore";
import {
  Body1Strong,
  Body2,
  Button,
  Card,
  CardHeader,
  CardPreview,
  Checkbox,
  tokens,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";

interface UploadListProps {}

const UploadList: React.FC<UploadListProps> = () => {
  const [widgets, setWidgets] = useState<IGetAllWidget[]>([]);
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);

  useEffect(() => {
    commands.getAllWidgets({ dir: "widgets" }).then((widgets) => {
      const filtered = widgets.filter(
        (item) => !(item.manifest.key in templateWidgets),
      );
      setWidgets(filtered);
    });
  }, []);

  useEffect(() => {
    useDataStore.setState({
      selectedWidgets: widgets.filter((item) =>
        selectedWidgets.includes(item.manifest.key),
      ),
    });
  }, [selectedWidgets]);

  return (
    <section>
      <div
        className="grid gap-3 container mx-auto px-4 sm:px-6 lg:px-8 py-5"
        style={{
          gridTemplateColumns: "repeat(auto-fit, 200px)",
        }}>
        {widgets.map((widget) => (
          <Card
            selected={selectedWidgets.includes(widget.manifest.key)}
            onSelectionChange={(_, { selected }) => {
              if (selected) {
                setSelectedWidgets((prev) => [...prev, widget.manifest.key]);
              } else {
                setSelectedWidgets((prev) =>
                  prev.filter((p) => p !== widget.manifest.key),
                );
              }
            }}
            floatingAction={
              <Checkbox
                aria-labelledby={`${widget.manifest.key}-id`}
                onChange={(_, { checked }) => {
                  if (checked) {
                    setSelectedWidgets((prev) => [
                      ...prev,
                      widget.manifest.key,
                    ]);
                  } else {
                    setSelectedWidgets((prev) =>
                      prev.filter((p) => p !== widget.manifest.key),
                    );
                  }
                }}
                checked={selectedWidgets.includes(widget.manifest.key)}
              />
            }
            appearance="filled-alternative"
            key={widget.manifest.key}
            className="min-h-42.5">
            <CardHeader
              header={
                <Body1Strong id={`${widget.manifest.key}-id`}>
                  {widget.manifest.label}
                </Body1Strong>
              }
            />
            <CardPreview>
              <WidgetPreview
                widget={{ ...widget.manifest, path: widget.path }}
              />
            </CardPreview>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default UploadList;
