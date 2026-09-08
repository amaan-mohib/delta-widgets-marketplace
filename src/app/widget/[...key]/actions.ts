"use server";

import models from "@/lib/db/models";

export const getIfUserLiked = async (
  widget_id: number,
  user_id?: string,
  anon_id?: string | null,
) => {
  if (!user_id && !anon_id) {
    throw new Error("Requires either one of user id or anon id");
  }
  const exists = await models
    .WidgetLikes()
    .where("widget_id", widget_id)
    .andWhere((q) => {
      if (user_id) q.orWhere("user_id", user_id);
      if (anon_id) q.orWhere("anon_user_id", anon_id);
    })
    .first();

  return !!exists;
};
