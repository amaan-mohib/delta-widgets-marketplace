"use client";

import { Widgets, WidgetVersions } from "@/lib/db";
import { Button, Field, Input, Textarea } from "@fluentui/react-components";
import React, { useEffect, useState } from "react";
import { updateWidget } from "../actions";

interface WidgetEditProps {
  widget: Widgets;
  version: Partial<WidgetVersions>;
  tags: string[];
  onClose(): void;
}

const WidgetEdit: React.FC<WidgetEditProps> = ({
  widget,
  version,
  tags,
  onClose,
}) => {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [previewDesc, setPreviewDesc] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLabel(version.label || "");
    setDescription(version.description || "");
    setTagsStr(tags.join(","));
  }, [version, tags]);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await updateWidget(
        version.id!,
        { label, description, tagsStr },
        widget.key,
      );
      setLoading(false);
      onClose();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (!version.id) return null;

  return (
    <div className="my-5">
      <Field label={"Name"}>
        <Input value={label} onChange={(_, { value }) => setLabel(value)} />
      </Field>
      <Field label={"Description"}>
        <Textarea
          value={description}
          onChange={(_, { value }) => setDescription(value)}
        />
        <div className="my-2">
          {previewDesc && (
            <div
              className="md-body"
              dangerouslySetInnerHTML={{ __html: description }}></div>
          )}
          <Button size="small" onClick={() => setPreviewDesc((prev) => !prev)}>
            {previewDesc ? "Close " : ""} Preview
          </Button>
        </div>
      </Field>
      <Field label={"Tags"}>
        <Input value={tagsStr} onChange={(_, { value }) => setTagsStr(value)} />
      </Field>
      <div className="mt-5 flex items-center gap-2">
        <Button appearance="primary" onClick={onSubmit} disabled={loading}>
          Update
        </Button>
        <Button onClick={onClose} disabled={loading}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default WidgetEdit;
