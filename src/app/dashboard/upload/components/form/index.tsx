"use client";

import { IUploadManifest } from "@/lib/types/manifest";
import {
  Field,
  Input,
  MessageBar,
  MessageBarBody,
} from "@fluentui/react-components";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo } from "react";
import FormScreenshots from "./screenshots";
import UploadFormSidebar from "./sidebar";
import { IUploadState } from "@/store/store-actions";
import SimpleEditorWrapper from "@/components/tiptap-templates/simple/simple-editor-wrapper";
import { useUploadStore } from "@/store/use-upload-store";
import { getAvailableTags } from "../../actions";
import FormTags from "./tags";

interface UploadFormProps {}

type IOnChange =
  | { name: "label" | "description" | "changelog"; value: string }
  | { name: "screenshots"; value: IUploadManifest["screenshots"] };

const UploadForm: React.FC<UploadFormProps> = () => {
  const selectedWidget = useUploadStore((s) => s.selectedWidget);
  const widgetUploads = useUploadStore((s) => s.widgetUploads);
  const availableTags = useUploadStore((s) => s.availableTags);

  const {
    values,
    state = "DRAFT",
    versions = [],
    errors = [],
  } = useMemo(
    () =>
      selectedWidget
        ? (widgetUploads[selectedWidget.manifest.key] ?? {})
        : ({} as Partial<IUploadState>),
    [selectedWidget, widgetUploads],
  );

  const disabled = state === "UPLOADED" || state === "UPLOADING";

  useEffect(() => {
    if (availableTags.length > 0) return;

    getAvailableTags().then((tags) => {
      const availableTags = tags.map((t) => t.slug);
      useUploadStore.setState({ availableTags });
    });
  }, []);

  const onChange = useCallback(
    ({ name, value }: IOnChange) => {
      if (!selectedWidget) return;
      useUploadStore
        .getState()
        .setWidgetUploadValues(selectedWidget.manifest.key, { [name]: value });
    },
    [selectedWidget],
  );

  const errorByLabel = useMemo(() => {
    const res: Record<string, string> = {};
    errors.forEach(({ key, message }) => {
      res[key] = message;
    });
    return res;
  }, [errors]);

  const debouncedUpdate = useMemo(() => debounce(onChange, 300), [onChange]);

  if (!selectedWidget || !values) return null;

  return (
    <div className="flex container mx-auto px-4 sm:px-6 lg:px-8 relative">
      <UploadFormSidebar />
      <div className="flex-1">
        <div className="max-w-xl flex flex-col gap-2 p-3">
          {versions.length > 0 && (
            <MessageBar intent="info">
              <MessageBarBody>
                This widget has {versions.length} versions published.
              </MessageBarBody>
            </MessageBar>
          )}
          {errorByLabel.global && (
            <MessageBar intent="error">
              <MessageBarBody>
                Something went wrong while uploading widget. Please try again.
              </MessageBarBody>
            </MessageBar>
          )}
          {errorByLabel.asset && (
            <MessageBar intent="error">
              <MessageBarBody>
                {errorByLabel.asset ||
                  "Something went wrong while uploading widget. Please try again."}
              </MessageBarBody>
            </MessageBar>
          )}
          {(errorByLabel.label ||
            errorByLabel.description ||
            errorByLabel.changelog ||
            errorByLabel.screenshots) && (
            <MessageBar intent="error">
              <MessageBarBody>
                There are items that require your attention.
              </MessageBarBody>
            </MessageBar>
          )}
          <Field
            label="Name"
            required
            validationMessage={errorByLabel.label}
            validationState={errorByLabel.label ? "error" : "none"}>
            <Input
              key={selectedWidget.manifest.key}
              name="label"
              defaultValue={values.label}
              onChange={(_, { value }) =>
                debouncedUpdate({ name: "label", value })
              }
              disabled={disabled}
            />
          </Field>
          <Field
            label="Description"
            required
            validationMessage={errorByLabel.description}
            validationState={errorByLabel.description ? "error" : "none"}>
            {(props) => (
              <SimpleEditorWrapper
                {...props}
                error={errorByLabel.description}
                editorKey={`desc-${selectedWidget.manifest.key}`}
                content={values.description ?? ""}
                setContent={(value) =>
                  debouncedUpdate({ name: "description", value })
                }
                disabled={disabled}
                placeholder="Enter a description which best describes this widget."
              />
            )}
          </Field>
          {versions.length !== 0 && (
            <Field
              label="Changelog"
              required
              validationMessage={errorByLabel.changelog}
              validationState={errorByLabel.changelog ? "error" : "none"}>
              {(props) => (
                <SimpleEditorWrapper
                  {...props}
                  error={errorByLabel.changelog}
                  editorKey={`changelog-${selectedWidget.manifest.key}`}
                  content={values.changelog ?? ""}
                  setContent={(value) =>
                    debouncedUpdate({ name: "changelog", value })
                  }
                  disabled={disabled}
                  placeholder="Already published widgets require a changelog to make it easier to get approval."
                />
              )}
            </Field>
          )}
          <Field
            label={`Tags (${values.tags?.length ?? 0}/10)`}
            required
            validationMessage={errorByLabel.tags}
            validationState={errorByLabel.tags ? "error" : "none"}>
            {(props) => (
              <div {...props}>
                <FormTags selectedTags={values.tags ?? []} />
              </div>
            )}
          </Field>
          <Field
            label="Screenshots"
            required
            validationMessage={errorByLabel.screenshots}
            validationState={errorByLabel.screenshots ? "error" : "none"}>
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
