import nodemailer from "nodemailer";
import { WEBSITE_URL } from "../constants";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "deltawidgets@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const notifyWidgetUploaded = async (
  receiver: { email: string; name: string },
  widget: { key: string; label: string; version: string },
) => {
  try {
    await transporter.sendMail({
      from: '"Delta Widgets" <deltawidgets@gmail.com>',
      to: ["amaan.mohib@gmail.com", "deltawidgets@gmail.com"],
      subject: "Widget Uploaded",
      html: `Hello,<br>A new widget has been uploaded and needs approval.<br>Check it out at ${WEBSITE_URL}/widget/${widget.key}?approval=true${widget.version ? `&version=${widget.version}` : ""}`,
    });
    await transporter.sendMail({
      from: '"Delta Widgets" <deltawidgets@gmail.com>',
      to: receiver.email,
      bcc: ["amaan.mohib@gmail.com", "deltawidgets@gmail.com"],
      subject: "Your widget has been submitted for review",
      html: `Hello ${receiver.name},<br><br>
Your widget <b>${widget.label} ${widget.version}</b> has been submitted for review.<br><br>
Our team will review the submission and notify you once a decision has been made.<br><br>
You can track the review status from your dashboard.<br><br>
Thank you for contributing to the gallery.`,
    });
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

export const notifyWidgetStatusChanged = async (
  receiver: { email: string; name: string },
  widget: { key: string; label: string; version: string },
  status: string,
  notes?: string,
) => {
  try {
    let content = "";
    let subject = "Widget Status Updated";
    if (status === "PUBLISHED") {
      subject = "Your widget is now live!";
      content = `Congratulations! <b>${widget.label} ${widget.version}</b> has been approved and published and is now visible in the Delta Widgets gallery.<br><br>
Check it out at ${WEBSITE_URL}/widget/${widget.key}<br><br>
You can share the widget page with others and monitor downloads, ratings, and feedback from your dashboard.<br><br>
Thank you for contributing to the gallery.`;
    }
    if (status === "REJECTED") {
      subject = "Your widget submission was not approved";
      content = `After review, <b>${widget.label} ${widget.version}</b> was not approved for publication.<br><br>
Reason:<br><br>
${notes}<br><br>
If applicable, you may create a new submission that addresses the issues described above.<br><br>
Thank you for your submission.<br><br>
For further clarifications, please reply to this email.`;
    }
    if (status === "SUSPENDED") {
      subject = "Your widget submission was suspended";
      content = `After review, <b>${widget.label} ${widget.version}</b> was decided to be suspended.<br><br>
Reason:<br><br>
${notes}<br><br>
If applicable, you may create a new submission that addresses the issues described above.<br><br>
Thank you for your submission.<br><br>
For further clarifications, please reply to this email.`;
    }
    if (status === "REQUESTED_CHANGE") {
      subject = `Changes requested for ${widget.label}`;
      content = `We've reviewed <b>${widget.label} ${widget.version}</b> and some changes are required before it can be approved.<br><br>
Review notes:<br><br>
${notes}<br><br>
After making the requested changes, submit a new revision for review.<br><br>
You can view the submission details and upload an updated version from your dashboard.<br><br>
For further clarifications, please reply to this email.`;
    }
    if (status === "COMMENT") {
      subject = `New review comment on ${widget.label}`;
      content = `A reviewer left a comment on <b>${widget.label} ${widget.version}</b>.<br><br>
Comment:<br><br>
${notes}<br><br>
This comment does not affect the current review status of your submission.<br><br>
You can view the full discussion from your dashboard.<br><br>
For further clarifications, please reply to this email.`;
    }
    if (!content) return;

    await transporter.sendMail({
      from: '"Delta Widgets" <deltawidgets@gmail.com>',
      to: receiver.email,
      bcc: ["amaan.mohib@gmail.com", "deltawidgets@gmail.com"],
      subject,
      html: `Hello ${receiver.name},<br><br>${content}`,
    });
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};
