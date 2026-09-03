"use client";

import WidgetPreview from "@/components/WidgetPreview";
import { commands, IGetAllWidget } from "@/lib/commands";
import { templateWidgets } from "@/lib/constants";
import { useDataStore } from "@/store/useDataStore";
import {
  Body1Strong,
  Card,
  CardHeader,
  CardPreview,
  Checkbox,
  Text,
  tokens,
} from "@fluentui/react-components";
import { AppsAddInRegular } from "@fluentui/react-icons";
import { useEffect, useMemo, useState } from "react";

interface UploadListProps {}

const UploadList: React.FC<UploadListProps> = () => {
  const [widgets, setWidgets] = useState<IGetAllWidget[]>([]);
  const selectedWidgets = useDataStore((s) => s.selectedWidgets);

  const selectedWidgetKeys = useMemo(
    () => selectedWidgets.map((i) => i.manifest.key),
    [selectedWidgets],
  );

  useEffect(() => {
    commands.getAllWidgets({ dir: "widgets" }).then((widgets) => {
      const filtered = widgets.filter(
        (item) => !(item.manifest.key in templateWidgets),
      );
      setWidgets(filtered);
    });
  }, []);

  const onSelect = (widget: IGetAllWidget, checked: boolean) => {
    if (checked) {
      useDataStore.setState({ selectedWidgets: [...selectedWidgets, widget] });
    } else {
      useDataStore.setState({
        selectedWidgets: selectedWidgets.filter(
          (p) => p.manifest.key !== widget.manifest.key,
        ),
      });
    }
  };

  return (
    <section>
      <div
        className="grid gap-3 container mx-auto px-4 sm:px-6 lg:px-8 py-5"
        style={{
          gridTemplateColumns: "repeat(auto-fit, 200px)",
        }}>
        {widgets.map((widget) => (
          <Card
            key={widget.manifest.key}
            selected={selectedWidgetKeys.includes(widget.manifest.key)}
            onSelectionChange={(_, { selected }) => {
              onSelect(widget, selected);
            }}
            floatingAction={
              <Checkbox
                aria-labelledby={`${widget.manifest.key}-id`}
                onChange={(_, { checked }) => {
                  onSelect(widget, !!checked);
                }}
                checked={selectedWidgetKeys.includes(widget.manifest.key)}
              />
            }
            appearance="filled-alternative"
            className="min-h-42.5">
            <CardHeader
              header={
                <Body1Strong id={`${widget.manifest.key}-id`}>
                  {widget.manifest.label}
                </Body1Strong>
              }
            />
            <CardPreview className="h-full">
              <WidgetPreview
                widget={{ ...widget.manifest, path: widget.manifestPath }}
              />
            </CardPreview>
          </Card>
        ))}
        <Card
          appearance="filled-alternative"
          className="min-h-42.5"
          onClick={() => {}}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: "3px",
              minHeight: 150,
            }}>
            <AppsAddInRegular fontSize="32px" />
            <Text weight="semibold">Create new widget</Text>
            <Text
              align="center"
              size={200}
              style={{ marginTop: 5, color: tokens.colorNeutralForeground2 }}>
              Build a custom widget for your desktop
            </Text>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default UploadList;
