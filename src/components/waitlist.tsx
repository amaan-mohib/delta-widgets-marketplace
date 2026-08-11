"use client";

import { submitWaitlist } from "@/app/waitlist/actions";
import {
  Body2,
  Button,
  Caption1,
  Divider,
  Field,
  FieldProps,
  Input,
  Spinner,
  Title2,
  Title3,
  tokens,
} from "@fluentui/react-components";
import { CheckmarkFilled } from "@fluentui/react-icons";
import { useState } from "react";
import z from "zod";

interface WaitlistPageProps {}

const WaitlistPage: React.FC<WaitlistPageProps> = () => {
  const [email, setEmail] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [validationState, setValidationState] =
    useState<FieldProps["validationState"]>("none");
  const [loading, setLoading] = useState(false);
  const [loadingIcon, setLoadingIcon] = useState<any>(null);

  const onSubmit = async () => {
    if (!email || !email.trim() || loading) return;

    try {
      // validate here itself to avoid server action call
      const validation = z.email().safeParse(email);
      if (!validation.success) {
        setValidationMessage("Please enter a valid email");
        setValidationState("error");
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadingIcon(<Spinner size="tiny" />);

      const { message, state } = await submitWaitlist(email);

      setValidationMessage(message);
      setValidationState(state);
      setLoadingIcon(state === "success" ? <CheckmarkFilled /> : null);
      setLoading(false);
    } catch (error) {
      setValidationMessage("Something went wrong");
      setValidationState("error");
      setLoadingIcon(null);
      setLoading(false);
    }
  };

  return (
    <div className="py-12 flex flex-col gap-2">
      <Title2 as="h1">Delta Widgets Gallery</Title2>
      <Body2 as="p" className="mt-3">
        A growing collection of widgets made by the Delta Widgets community.
      </Body2>
      <Body2 as="p">
        Discover new ways to customize your desktop, find inspiration, and share
        widgets you've created with others.
      </Body2>
      <Body2 as="p" className="mt-3">
        Join the waitlist to get early access when the Community Gallery opens.
      </Body2>

      <div className="flex gap-2 mt-3 flex-wrap">
        <Field
          className="w-full max-w-2xs"
          validationMessage={validationMessage}
          validationState={validationState}>
          <Input
            value={email}
            onChange={(_, { value }) => {
              if (validationMessage) {
                setValidationMessage("");
                setValidationState("none");
                setLoadingIcon(null);
              }
              setEmail(value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSubmit();
              }
            }}
            type="email"
            placeholder="abc@example.com"
          />
        </Field>
        <div>
          <Button
            disabled={loading}
            appearance="primary"
            onClick={onSubmit}
            icon={loadingIcon}>
            Get notified
          </Button>
        </div>
      </div>
      <Caption1 as="p" style={{ color: tokens.colorNeutralForeground3 }}>
        No spam. Just updates about the Community Gallery.
      </Caption1>

      <Divider className="my-8" />

      <Title3 as="h2">Discover something new</Title3>
      <Body2 as="p" className="mt-1">
        Browse widgets created by the community and find new ways to make your
        desktop your own.
      </Body2>
      <Title3 as="h2" className="mt-2">
        Create & share
      </Title3>
      <Body2 as="p" className="mt-1">
        Built something you're proud of? Submit your widget and share it with
        other Delta Widgets users.
      </Body2>
      <Title3 as="h2" className="mt-2">
        Curated by the community
      </Title3>
      <Body2 as="p" className="mt-1">
        Every submission will be reviewed before appearing in the gallery,
        keeping the collection useful and high quality.
      </Body2>

      <Divider className="my-8" />

      <Title3 as="h2">Starting free</Title3>
      <Body2 as="p" className="mt-1">
        We're starting with a free community gallery rather than a full paid
        marketplace.
      </Body2>
      <Body2 as="p">
        This lets us focus on building a great place to discover and share
        widgets first.
        <br />
        As the community grows, we'll explore more ways to support widget
        creators.
      </Body2>
      <Body2 as="p">Be among the first to explore the Community Gallery.</Body2>
    </div>
  );
};

export default WaitlistPage;
