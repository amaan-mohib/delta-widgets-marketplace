"use client";

import { Notifications as INotifications } from "@/lib/db";
import {
  Button,
  Card,
  CardHeader,
  Field,
  Input,
  Title3,
} from "@fluentui/react-components";
import React, { useEffect, useState } from "react";
import {
  getNotifications,
  removeNotification,
  sendNotification,
} from "./actions";

interface NotificationsProps {}

const Notifications: React.FC<NotificationsProps> = () => {
  const [notifications, setNotifications] = useState<INotifications[]>([]);

  useEffect(() => {
    getNotifications()
      .then((res) => {
        setNotifications(res);
      })
      .catch(console.error);
  }, []);

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const formValues = Object.fromEntries(
        formData,
      ) as unknown as INotifications;

      const res = await sendNotification(
        formValues.title,
        formValues.message,
        formValues.link,
      );
      setNotifications((prev) => [res, ...prev]);
      e.target.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const onRemove = async (id: number) => {
    try {
      await removeNotification(id);
      setNotifications((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section style={{ marginTop: 20 }}>
      <Title3>Notifications</Title3>
      <form onSubmit={onSubmit} style={{ marginTop: 20, maxWidth: 400 }}>
        <Field label={"Title"} required>
          <Input name="title" placeholder="Enter title" />
        </Field>
        <Field label={"Message"} required>
          <Input name="message" placeholder="Enter message" />
        </Field>
        <Field label={"Link"}>
          <Input name="link" placeholder="Enter notification link" type="url" />
        </Field>
        <Button type="submit" appearance="primary" style={{ marginTop: 10 }}>
          Send
        </Button>
      </form>
      <div
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
        {notifications.map((item) => (
          <Card key={item.id} appearance="outline">
            <CardHeader
              header={item.title}
              description={item.message}
              action={<Button onClick={() => onRemove(item.id)}>Remove</Button>}
            />
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Notifications;
