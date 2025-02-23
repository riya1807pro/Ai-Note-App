import prisma from "@/lib/db/prisma";
import { createNoteSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs/server";



export async function POST(req:Request) {
    try {
        const body =  await req.json();
        const parseResult =  createNoteSchema.safeParse(body);

        if(!parseResult.success){
            console.error(parseResult.error);
            return Response.json({error:"invalid input"},{status:400});
        }

        const {title,content} = parseResult.data;

      const {userId}  = await auth()

        if(!userId){
            return Response.json({error:"unauthoriszed"},{status:401});
        }


        const note = await prisma.note.create({
          data:{
            title,
            content,
            userId
          }
        })


        return Response.json({note},{status:201}); //status: success

    } catch (error) {
        console.error(error)
        return Response.json({error: "internal server error"} , {status:500});
        
    }
}