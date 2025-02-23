import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server"
import {Metadata} from "next"

export const metadata : Metadata = {
    title : "FlowBraim - notes"
}

export default async function notesPage() {
    const {userId} = await auth()

    if(!userId) throw Error ("userId not found ");


    const allNotes  = await prisma.note.findMany({where:{userId}})

    return <div>{JSON.stringify(allNotes)}</div>
}