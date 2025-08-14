import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Suspense } from "react";
import Loops from "./Loops";
import SkeletonLoop from "./Loops.loading";

export default async function Page() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const user = await getUser();

  if (!isUserAuthenticated || !user) {
    return (
      <p className="p-4 text-center">
        You need to be logged in to view saved loops.
      </p>
    );
  }

  return (
    <>
      <Suspense fallback={<SkeletonLoop />}>
        <Loops userId={user.id} />
      </Suspense>
    </>
  );
}
