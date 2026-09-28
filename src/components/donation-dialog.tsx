"use client";

import { getDonationLinks, sendMixpanelEvent } from "@/app/actions";
import { UserProfiles } from "@/lib/db";
import {
  Body1,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Link,
  Text,
} from "@fluentui/react-components";
import { OpenRegular } from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";

interface DonationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  username: string;
  links?: UserProfiles["donation_links"];
}

const DonationDialog: React.FC<DonationDialogProps> = ({
  open,
  setOpen,
  username,
  links: defaultLinks,
}) => {
  const [links, setLinks] = useState<UserProfiles["donation_links"]>(
    defaultLinks || [],
  );

  useEffect(() => {
    if (defaultLinks) return;

    getDonationLinks(username)
      .then((data) => {
        setLinks(data?.donation_links ?? []);
      })
      .catch(console.error);
  }, [username, defaultLinks]);

  return (
    <Dialog open={open} onOpenChange={(_, { open }) => setOpen(open)}>
      <DialogSurface>
        <DialogTitle>Tip @{username}</DialogTitle>
        <DialogContent>
          <div className="mt-5 flex flex-col gap-2">
            <Body1>
              Enjoying this widget? Consider leaving a tip to support the
              creator's work and future updates.
            </Body1>
            <Text>Choose a platform below to continue:</Text>
          </div>
          <div className="my-5">
            {links?.map((link) => (
              <Link
                href={link as string}
                target="_blank"
                key={`${link}`}
                onClick={() =>
                  sendMixpanelEvent("donation-clicked", { username, link })
                }>
                <div className="flex items-center justify-between gap-2">
                  <Text>{link}</Text>
                  <Button
                    icon={<OpenRegular fontSize={16} />}
                    appearance="transparent"
                    size="small"
                  />
                </div>
              </Link>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <DialogTrigger disableButtonEnhancement>
            <Button appearance="secondary">Close</Button>
          </DialogTrigger>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
};

export default DonationDialog;
