"use client";

import { useUploadStore } from "@/store/use-upload-store";
import { Button, Input } from "@fluentui/react-components";
import { AddRegular } from "@fluentui/react-icons";
import React, { useMemo, useState } from "react";

interface FormTagsProps {
  selectedTags: string[];
}

function normalizeTag(tag: string) {
  if (!tag) return "";

  const t = tag
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (t === "all") return "";
  return t;
}

const FormTags: React.FC<FormTagsProps> = ({ selectedTags }) => {
  const availableTags = useUploadStore((s) => s.availableTags);
  const selectedWidget = useUploadStore((s) => s.selectedWidget);
  const [input, setInput] = useState("");

  const allTags = useMemo(() => {
    return Array.from(new Set([...selectedTags, ...availableTags]));
  }, [availableTags, selectedTags]);

  const addTag = (tag: string) => {
    if (!selectedWidget) return;
    if (selectedTags.length >= 10) return;

    const newTags = Array.from(new Set([...selectedTags, tag]));
    useUploadStore
      .getState()
      .setWidgetUploadValues(selectedWidget.manifest.key, {
        tags: newTags,
      });
  };

  const removeTag = (tag: string) => {
    if (!selectedWidget) return;
    useUploadStore
      .getState()
      .setWidgetUploadValues(selectedWidget.manifest.key, {
        tags: selectedTags.filter((t) => t !== tag),
      });
  };

  if (!selectedWidget) return null;

  return (
    <div>
      <div className="flex items-center gap-2">
        <Input
          size="small"
          placeholder="Add new tag"
          value={input}
          onChange={(_, { value }) => setInput(value)}
        />
        <Button
          size="small"
          icon={<AddRegular />}
          onClick={() => {
            const tag = normalizeTag(input);
            if (!tag) return;
            addTag(tag);
            setInput("");
          }}>
          Add
        </Button>
      </div>
      <div className="flex items-center flex-wrap gap-2 mt-2">
        {allTags.map((tag) => (
          <Button
            key={tag}
            size="small"
            shape="circular"
            appearance={selectedTags.includes(tag) ? "primary" : "secondary"}
            onClick={() => {
              if (selectedTags.includes(tag)) {
                removeTag(tag);
              } else {
                addTag(tag);
              }
            }}>
            {tag}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FormTags;
