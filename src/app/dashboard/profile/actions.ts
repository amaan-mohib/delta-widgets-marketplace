"use server";

import { getAuthUser } from "@/app/actions";
import models from "@/lib/db/models";
import { S3, S3_BUCKET } from "@/lib/storage";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

export const getPhotoPresignedUrl = async (
  username: string,
  filename: string,
  contentType: string,
) => {
  if (!contentType.startsWith("image/")) {
    throw new Error("Only image uploads are allowed.");
  }
  const extension = filename.split(".").pop();
  const key = `uploads/${username}/${new Date().getTime()}.${extension}`;

  const url = await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 3600 },
  );

  return {
    uploadUrl: url,
    photoUrl: process.env.NEXT_PUBLIC_CF_R2_SRC_PREFIX + key,
  };
};
