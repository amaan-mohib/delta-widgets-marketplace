import { commands } from "@/lib/commands";
import { IUploadManifest, IWidget } from "@/lib/types/manifest";

export interface IFormError {
  key: string;
  message: string;
}

export const validateForm = async (
  values: IUploadManifest,
  hasVersions: boolean,
  assetPath?: string,
) => {
  const errors: IFormError[] = [];
  let { label, description, changelog, widget_type, screenshots = [] } = values;
  label = label.trim();
  if (!label) {
    errors.push({
      key: "label",
      message: "Name cannot be empty",
    });
  }
  if (label.length > 50) {
    errors.push({
      key: "label",
      message: "Name must have less than 50 characters",
    });
  }

  const el = document.createElement("div");
  el.innerHTML = description ?? "";
  description = el.innerText.replace(/\\n|\\r\\n/, "").trim();
  if (!description) {
    errors.push({
      key: "description",
      message: "Description cannot be empty",
    });
  }

  if (hasVersions) {
    const el = document.createElement("div");
    el.innerHTML = changelog ?? "";
    changelog = el.innerText.replace(/\\n|\\r\\n/, "").trim();
    if (!changelog) {
      errors.push({
        key: "changelog",
        message: "Changelog cannot be empty",
      });
    }
  }

  if (widget_type === "HTML" && assetPath) {
    try {
      await commands.validateWidgetAsset({ assetPath });
    } catch (error) {
      errors.push({
        key: "asset",
        message: error as string,
      });
    }
  }

  if (screenshots.length === 0) {
    errors.push({
      key: "screenshots",
      message: "Add atleast one screenshot",
    });
  }

  return errors;
};
