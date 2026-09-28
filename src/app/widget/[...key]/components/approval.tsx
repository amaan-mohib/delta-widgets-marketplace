"use client";

import { WidgetAudits, WidgetVersions } from "@/lib/db";
import React, { useEffect, useState } from "react";
import { auditAction, getAuditHistory } from "../actions";
import {
  Body1Strong,
  Button,
  Caption1,
  Divider,
  Field,
  Select,
  Text,
} from "@fluentui/react-components";
import SimpleEditorWrapper from "@/components/tiptap-templates/simple/simple-editor-wrapper";
import { Editor } from "@tiptap/core";

interface ApprovalProps {
  widgetVersion: WidgetVersions;
  isAdmin: boolean;
  fromApproval: boolean;
  widgetKey: string;
}

const Approval: React.FC<ApprovalProps> = ({
  widgetVersion,
  isAdmin,
  fromApproval,
  widgetKey,
}) => {
  const [audits, setAudits] = useState<
    Omit<WidgetAudits, "auditor_id" | "updated_at">[]
  >([]);
  const [action, setAction] = useState("PUBLISHED");
  const [loading, setLoading] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);

  const getHistory = async () => {
    try {
      const data = await getAuditHistory(widgetVersion.id);
      setAudits(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async () => {
    if (
      ["PUBLISHED", "REJECTED", "SUSPENDED"].includes(action) &&
      audits.length > 0 &&
      action === audits[0].action
    ) {
      alert(`Widget is already ${action.toLowerCase()}`);
      return;
    }

    try {
      setLoading(true);
      const notesText = editor?.getText() ?? "";
      await auditAction(
        action,
        notesText ? (editor?.getHTML() ?? "") : "",
        widgetVersion.id,
        widgetKey,
      );
      await getHistory();
      editor && editor.commands.setContent("");
      setLoading(false);
      if (action !== "COMMENT") {
        window.location.reload();
      }
    } catch (error: any) {
      alert(error.message || error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getHistory();
  }, [widgetVersion.id]);

  return (
    <div className="border-l h-full px-2.5 w-xs">
      {isAdmin && fromApproval && (
        <div className="flex flex-col">
          <Field orientation="horizontal" label={"Action"}>
            <Select
              value={action}
              onChange={(_, { value }) => {
                setAction(value);
              }}>
              <option value="PUBLISHED">Publish</option>
              <option value="REJECTED">Reject</option>
              <option value="SUSPENDED">Suspend</option>
              <option value="REQUESTED_CHANGE">Request Change</option>
              <option value="COMMENT">Comment</option>
            </Select>
          </Field>
          <Field label="Notes">
            {(props) => (
              <SimpleEditorWrapper
                {...props}
                editorKey={`notes-${widgetVersion.version}`}
                placeholder="Add notes if required."
                setEditor={(editor) => setEditor(editor)}
              />
            )}
          </Field>
          <div className="mt-2">
            <Button appearance="primary" disabled={loading} onClick={onSubmit}>
              Submit
            </Button>
          </div>
          <div className="my-5">
            <Divider />
          </div>
        </div>
      )}
      <div className="flex flex-col">
        <Body1Strong className="mb-3">Audit History</Body1Strong>
        {audits.map((item, index) => (
          <div key={item.id} className="flex flex-col">
            {index !== 0 && (
              <div className="my-2">
                <Divider />
              </div>
            )}
            <Text className="capitalize" weight="bold">
              {item.action.replace(/_/g, " ").toLowerCase()}
            </Text>
            {item.notes && (
              <div className="my-1">
                <Caption1>Notes:</Caption1>
                <div
                  dangerouslySetInnerHTML={{
                    __html: item.notes,
                  }}></div>
              </div>
            )}
            <Caption1 className="italic">
              {item.created_at.toLocaleString()}
            </Caption1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Approval;
