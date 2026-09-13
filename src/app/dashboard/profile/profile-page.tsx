"use client";

import { authClient } from "@/lib/auth/client";
import { useAuth } from "@/store/use-auth";
import {
  Avatar,
  Body1Strong,
  Button,
  Divider,
  Field,
  Input,
  Link,
  Text,
  Title1,
  Title3,
} from "@fluentui/react-components";
import {
  AddRegular,
  CheckmarkRegular,
  DeleteRegular,
  DismissRegular,
} from "@fluentui/react-icons";
import React, { useRef, useState } from "react";
import { addDonationLink } from "./actions";

interface ProfilePageProps {}

const ProfilePage: React.FC<ProfilePageProps> = () => {
  const { user, profile } = useAuth();
  const [editName, setEditName] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState("");

  const updateName = async () => {
    if (!inputRef.current) return;
    const value = (inputRef.current.value || "").trim();
    if (!value) return;
    if (value === user?.name) {
      setEditName(false);
      return;
    }
    authClient
      .updateUser({ name: value })
      .then(() => {
        if (user && user.id) {
          useAuth.setState({
            user: {
              ...user,
              name: value,
            },
          });
        }
        setEditName(false);
      })
      .catch(console.error);
  };

  const addLink = async () => {
    try {
      if (!link.trim()) return;

      const url = new URL(link.trim());
      const set = new Set([...(profile?.donation_links || []), url.toString()]);
      const links = Array.from(set) as string[];
      await addDonationLink(links);

      setLink("");
      if (profile) {
        useAuth.setState({
          profile: {
            ...profile,
            donation_links: links,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const removeLink = async (link: string) => {
    try {
      const links = (profile?.donation_links || []).filter(
        (i) => i !== link,
      ) as string[];
      await addDonationLink(links);

      if (profile) {
        useAuth.setState({
          profile: {
            ...profile,
            donation_links: links,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <div>
        <Title1>Profile</Title1>
        <div className="flex gap-5 py-5">
          <div>
            <Avatar
              image={{ src: user.image || undefined }}
              name={user.name}
              size={128}
            />
          </div>
          <div className="pl-5 border-l flex flex-col gap-2 flex-1 max-w-lg">
            <Field label="Name">
              {editName ? (
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    style={{ width: "100%" }}
                    defaultValue={user.name}
                    autoFocus
                  />
                  <Button onClick={updateName} icon={<CheckmarkRegular />} />
                  <Button
                    onClick={() => setEditName(false)}
                    icon={<DismissRegular />}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Text>{user.name}</Text>
                  <Link as="button" onClick={() => setEditName(true)}>
                    Edit
                  </Link>
                </div>
              )}
            </Field>
            <Field label="Email">{user.email}</Field>
            {profile?.username && (
              <Field label="Username">
                <Link href={`/creator/${profile.username}`}>
                  @{profile.username}
                </Link>
              </Field>
            )}
          </div>
        </div>
        <Divider />
      </div>
      <div className="mt-5">
        <Title3>Funding</Title3>
        <div className="mt-2">
          <Body1Strong>
            Add donation links to receive tips from users who enjoy your work.
          </Body1Strong>
          <br />
          <Text>
            You can add services like Buy Me a Coffee, Ko-fi, GitHub Sponsors,
            Patreon, or other donation platforms. These links will appear under
            the <b>Tip Creator</b> button on your widget and creator page.
          </Text>
        </div>
        <div className="mt-5">
          {profile?.donation_links ? (
            <div className="flex flex-col gap-2 mb-5">
              {" "}
              {profile.donation_links.map((link) => (
                <div className="flex items-center justify-between max-w-lg gap-2">
                  <Link key={`${link}`} href={link as string} target="_blank">
                    {link}
                  </Link>
                  <Button
                    size="small"
                    icon={<DeleteRegular fontSize={16} />}
                    onClick={() => removeLink(link as string)}
                  />
                </div>
              ))}
            </div>
          ) : null}
          <div className="flex items-center gap-2 max-w-lg">
            <Input
              value={link}
              onChange={(_, { value }) => setLink(value)}
              placeholder="https://buymeacoffee.com/username"
              type="url"
              style={{ flex: 1 }}
            />
            <Button icon={<AddRegular />} onClick={addLink}>
              Add link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
