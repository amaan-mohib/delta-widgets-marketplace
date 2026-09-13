"use server";

import { getAuthUser } from "@/app/actions";
import models from "@/lib/db/models";

export const createUsername = async (username: string) => {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const exists = await models.UserProfiles().where("user_id", user.id).first();
  if (exists) {
    throw new Error("Username cannot be updated");
  }

  const [profile] = await models
    .UserProfiles()
    .insert({
      user_id: user.id,
      username,
    })
    .returning(["username", "created_at", "donation_links"]);

  return profile;
};

export const checkUsernameAvailability = async (username: string) => {
  const exists = await models
    .UserProfiles()
    .where("username", username)
    .first();
  return !!exists;
};
