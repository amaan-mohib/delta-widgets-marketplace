"use client";

import {
  checkUsernameAvailability,
  createUsername,
} from "@/app/dashboard/welcome/actions";
import { useDebounce } from "@/lib/utils";
import { useAuth } from "@/store/useAuth";
import {
  Button,
  Field,
  FieldProps,
  Input,
  Title1,
} from "@fluentui/react-components";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import z from "zod";

const usernameSchema = z
  .string()
  .min(3, "Username must have atleast 3 characters")
  .max(30, "Username must have maximum of 30 characters")
  .regex(
    /^[a-z0-9_]+$/,
    "Username must only contain lowercase alphabets, numbers or underscore",
  );

interface WelcomePageProps {}

const WelcomePage: React.FC<WelcomePageProps> = () => {
  const { user, profile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [validationState, setValidationState] =
    useState<FieldProps["validationState"]>("none");
  const [loading, setLoading] = useState(false);

  const debouncedUsername = useDebounce(username, 500);

  useEffect(() => {
    if (!user) return;
    if (!profile) {
      const { email } = user;
      const usernameFromEmail = email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, 30);
      setUsername(usernameFromEmail);
      return;
    }
    const redirectTo = searchParams.get("redirect");
    router.replace(redirectTo || "/dashboard");
  }, [profile, user, searchParams]);

  const validateUsername = async (username: string) => {
    if (!username || !username.trim() || loading) return;

    const validation = usernameSchema.safeParse(username);

    if (!validation.success) {
      setValidationMessage(validation.error.issues[0].message);
      setValidationState("error");
      setLoading(false);
      return;
    }
    const exists = await checkUsernameAvailability(username);
    if (exists) {
      setValidationMessage("Not available");
      setValidationState("warning");
      setLoading(false);
      return;
    }
    setValidationMessage("Available");
    setValidationState("success");
    setLoading(false);
  };

  useEffect(() => {
    validateUsername(debouncedUsername);
  }, [debouncedUsername]);

  const onSubmit = async () => {
    if (
      !username ||
      !username.trim() ||
      loading ||
      validationState !== "success"
    )
      return;

    try {
      setLoading(true);
      const profile = await createUsername(username);
      if (profile) {
        useAuth.setState({ profile });
      } else {
        setLoading(false);
      }
    } catch (error) {
      setValidationMessage("Something went wrong");
      setValidationState("error");
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <main className="flex flex-col justify-center gap-12 py-12 items-center">
      <Title1>Let's get you setup</Title1>
      <Field
        size="large"
        className="w-full max-w-2xs place-items-center gap-2"
        validationMessage={validationMessage}
        validationState={validationState}
        label={"Pick your username"}>
        <Input
          className="text-center-input"
          value={username}
          onChange={(_, { value }) => {
            setUsername(value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmit();
            }
          }}
          placeholder="username"
        />
      </Field>
      <Button
        appearance="primary"
        disabled={loading || validationState !== "success" || !username.trim()}
        onClick={onSubmit}>
        Submit
      </Button>
    </main>
  );
};

export default WelcomePage;
