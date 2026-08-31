"use client";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { IUploadManifest } from "@/lib/types/manifest";
import { useDataStore } from "@/store/useDataStore";
import { Field, Input } from "@fluentui/react-components";
import debounce from "lodash.debounce";
import { useCallback, useMemo } from "react";
import FormScreenshots from "./screenshots";
import UploadFormSidebar from "./sidebar";

interface UploadFormProps {}

type IOnChange =
  | { name: "label" | "description"; value: string }
  | { name: "screenshots"; value: IUploadManifest["screenshots"] };

const UploadForm: React.FC<UploadFormProps> = () => {
  const selectedWidgetKey = useDataStore((s) => s.selectedWidgetKey);
  const values = useDataStore((s) =>
    s.selectedWidgetKey
      ? (s.widgetUploads[s.selectedWidgetKey]?.values ?? null)
      : null,
  );
  const state = useDataStore((s) =>
    s.selectedWidgetKey
      ? (s.widgetUploads[s.selectedWidgetKey]?.state ?? null)
      : null,
  );
  const disabled = state !== "DRAFT";

  const onChange = useCallback(
    ({ name, value }: IOnChange) => {
      if (!selectedWidgetKey) return;
      useDataStore
        .getState()
        .setWidgetUploadValues(selectedWidgetKey, { [name]: value });
    },
    [selectedWidgetKey],
  );

  const debouncedUpdate = useMemo(
    () =>
      debounce((name: "label" | "description", value: string) => {
        onChange({
          name,
          value,
        });
      }, 300),
    [onChange],
  );

  if (!selectedWidgetKey || !values) return null;

  return (
    <div className="flex container mx-auto px-4 sm:px-6 lg:px-8 relative">
      <UploadFormSidebar />
      <div className="flex-1">
        <div className="max-w-xl flex flex-col gap-2 p-3">
          <Field label="Name" required>
            <Input
              key={selectedWidgetKey}
              name="label"
              defaultValue={values.label}
              onChange={(_, { value }) => debouncedUpdate("label", value)}
              disabled={disabled}
            />
          </Field>
          <Field label="Description" required>
            {(props) => (
              <div
                {...props}
                className="border"
                style={{ width: "100%", height: 300 }}>
                <SimpleEditor
                  key={selectedWidgetKey}
                  content={values.description}
                  setContent={(value) => debouncedUpdate("description", value)}
                  disabled={disabled}
                />
              </div>
            )}
          </Field>
          <Field label="Screenshots" required>
            {(props) => (
              <div {...props}>
                <FormScreenshots
                  screenshots={values.screenshots || []}
                  onChange={(value) => onChange({ name: "screenshots", value })}
                  disabled={disabled}
                />
              </div>
            )}
          </Field>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
