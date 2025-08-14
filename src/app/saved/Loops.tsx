import { db } from "@/app/lib/db";
import Saved from "@/pages/Saved"; 

interface Props {
  userId: string;
}

export default async function Loops({ userId }: Props) {
  const { data: loops } = await db
    .from("loop")
    .select("id, name, share_url, cuts, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return <Saved data={loops ?? []} />;
}
