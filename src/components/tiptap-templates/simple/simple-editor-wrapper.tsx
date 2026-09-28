import React, { CSSProperties } from "react";
import { SimpleEditor } from "./simple-editor";
import { FieldControlProps, tokens } from "@fluentui/react-components";
import { Editor } from "@tiptap/core";

interface SimpleEditorWrapperProps {
  controlProps?: FieldControlProps;
  error?: string;
  editorKey?: any;
  content?: string;
  setContent?: (value: string) => void;
  disabled?: boolean;
  height?: CSSProperties["height"];
  width?: CSSProperties["width"];
  placeholder?: string;
  setEditor?: (editor: Editor | null) => void;
}

const SimpleEditorWrapper: React.FC<SimpleEditorWrapperProps> = ({
  content,
  setContent,
  disabled,
  error,
  editorKey,
  controlProps = {},
  height,
  width,
  placeholder,
  setEditor,
}) => {
  return (
    <div
      {...controlProps}
      className="border rounded-sm overflow-hidden"
      style={{
        width: width ?? "100%",
        height: height ?? 300,
        ...(error
          ? { borderColor: tokens.colorPaletteRedBorder2 }
          : {
              borderColor: tokens.colorNeutralStroke1,
              borderBottomColor: tokens.colorNeutralStrokeAccessible,
            }),
      }}>
      <SimpleEditor
        key={editorKey}
        content={content}
        setContent={setContent}
        disabled={disabled}
        placeholder={placeholder}
        setEditor={setEditor}
      />
    </div>
  );
};

export default SimpleEditorWrapper;
