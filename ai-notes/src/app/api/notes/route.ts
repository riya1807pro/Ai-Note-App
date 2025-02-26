
import Note from "@/components/note";
import { getEmbedding, notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { createNoteSchema, deleteSchema,updatesSchema } from "@/lib/validation/note";
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

        const embedding = await getEmbeddingForNotes(title,content)

 const note  = await prisma.$transaction(async (tx)=>{
 const note = await tx.note.create({
     data:{
       title,
       content,
       userId
     }
   })

 await notesIndex.upsert([
   {
     id:  note.id,
     values: embedding,
     metadata : {userId}
   }
 ])
return Note;
        })



        return Response.json({note},{status:201}); //status: success

    } catch (error) {
        console.error(error)
        return Response.json({error: "internal server error"} , {status:500});
        
    }
}

export async function PUT(req:Request) {
    try {
      const body = await req.json   

      const parseResult =  updatesSchema.safeParse(body);

      if(!parseResult.success){
          console.error(parseResult.error);
          return Response.json({error:"invalid input"},{status:400});
      }

      const {id,title,content} = parseResult.data;

      const note = await prisma.note.findUnique({where:{id}})

      if(!note){return Response.json({error:"note not found"},{status:404})}

    const {userId}  = await auth()

      if(!userId || userId === note.userId){
          return Response.json({error:"unauthoriszed"},{status:401});
      }

      const embedding =  await getEmbeddingForNotes(title,content);

      const updatedNote = await prisma.$transaction(async (tx) => {
        const updatedNote = await prisma.note.update({
          where:{id} ,
          data:{
            title,
            content,
          }
        })
         
        await notesIndex.upsert([
          {
            id:  note.id,
            values: embedding,
            metadata : {userId}
          }
        ])
        return updatedNote;
      })


      return ( Response.json({updatedNote},{status:200}))


    } catch (error) {
      console.error(error)
      return Response.json({ error: "internal server error"},{status: 500})
    }
}

export async function DELETE(req:Request) {
  try {
    const body = await req.json   

    const parseResult =  deleteSchema.safeParse(body);

    if(!parseResult.success){
        console.error(parseResult.error);
        return Response.json({error:"invalid input"},{status:400});
    }

    const {id} = parseResult.data;

    const note = await prisma.note.findUnique({where:{id}})

    if(!note){return Response.json({error:"note not found"},{status:404})}

  const {userId}  = await auth()

    if(!userId || userId === note.userId){
        return Response.json({error:"unauthoriszed"},{status:401});
    }

    await prisma.$transaction(async (tx) => {
      await tx.note.delete({where:{id}});
      await notesIndex.deleteOne(id)
    })



    return ( Response.json({message : "note deleted"},{status:200}))


  } catch (error) {
    console.error(error)
    return Response.json({ error: "internal server error"},{status: 500})
  }
}

async function getEmbeddingForNotes(title:string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + (content?content :"") )
}