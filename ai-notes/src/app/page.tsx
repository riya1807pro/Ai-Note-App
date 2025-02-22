import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {

const { userId } = await auth();
if(userId) redirect("/notes")

  return (
   <main className="flex flex-col h-screen gap-5 items-center justify-center">
    <div className="flex items-center  gap-4">
      <Image src={"/logo.png"} alt="logo" height={100} width={100}/>
      <span className="font-extrabold tracking-tight text-4xl lg:text-5xl">FlowBrain</span>
    </div>
    <p className="text-center max-w-prose">An Intelligence note-taking app with AI integration, 
       build with openAi , Pinecone , Nextjs , Shadcn UI , clerk and many more </p>
       <Button size={'lg'} asChild>
       <Link href='@/ai-notes/src/notes'>Open</Link>
       </Button>
   </main>
  );
}
