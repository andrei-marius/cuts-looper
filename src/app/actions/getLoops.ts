'use server'

import db from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function getLoops() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const user = await getUser();

  if (!isUserAuthenticated || !user) {
    throw new Error("You need to be logged in to view saved loops.");
  }

  // TODO: SS pagination
  const { data: loops, error } = await db
    .from("loop")
    .select("id, name, share_url, cuts, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error('Internal Error');

  return loops;
}
