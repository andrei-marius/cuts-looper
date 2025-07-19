// import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
// import { redirect } from 'next/navigation';
import YouTubeEmbed from '@/components/YoutubeEmbed';
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// interface iAppProps {
//   userImage: string | null;
// }

export default function Home() {
  // const { isAuthenticated, getUser } = getKindeServerSession();
  // const { getUser } = getKindeServerSession()
  // const user = await getUser()

  // if (!(await isAuthenticated())) {
  //   // Redirect unauthenticated users to login
  //   redirect('/api/auth/login');
  // }

  // const user = await getUser();

  return (
    <>
      <main className="p-4 max-w-xl mx-auto">
        <YouTubeEmbed />
      </main>
    </>
  );
}
