"use server";

import { getAuthUser } from "@/app/actions";
import models from "@/lib/db/models";

export const addDonationLink = async (links: string[]) => {
  const user = await getAuthUser();
  if (!user || !user.profile) {
    throw new Error("Unauthorized");
  }
  await models
    .UserProfiles()
    .update({ donation_links: JSON.stringify(links) as any })
    .where("username", user.profile.username);
};
