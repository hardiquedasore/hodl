'use client';
import { useAuthState } from "react-firebase-hooks/auth";
import {auth} from '@/app/firebase';
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

export default function Home() {
  const user = useAuthState(auth);
  const router = useRouter();

  if(!user[0]){
    router.push('/sign-up')
  }else{
    console.log(user)
  }

  return (
    <main className="p-8">
      
      <a
  className="rounded float-end cursor-pointer border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
  onClick={()=> signOut(auth)}
>
  Sign out
</a>
      <div className="flex flex-col p-8 z-10 w-full max-w-5xl font-mono text-sm lg:flex">
        <h1 className="text-4xl p-4 text-center">Dashboard</h1>
      </div>
    </main>
  );
}
