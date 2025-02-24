import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server"
import {Metadata} from "next"
import Note from "@/components/note"

export const metadata : Metadata = {
    title : "FlowBraim - notes"
}

export default async function NotesPage() {
    const {userId} = await auth()

    if(!userId) throw Error ("userId not found ");


    const allNotes  = await prisma.note.findMany({where:{userId}})

    return <div className="grid gap-3 sm:grid-cols-2 lg:griid-cols-3">
        {
            allNotes.map((note)=>(
                <Note note={note} key={note.id}/>
            ))
        }
        {allNotes.length === 0 && (
            <div className="col-span-full text-center">{"you don't have any note. Why don't ypu create one?  "}</div>
        ) }
        </div>
}