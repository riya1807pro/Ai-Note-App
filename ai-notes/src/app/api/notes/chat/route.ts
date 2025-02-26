import Note from "@/components/note";
import { getEmbedding, notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import openai from "@/lib/validation/openai";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import OpenAI from "openai";
import { ChatCompletionMessage, ChatCompletionMessageParam, ChatCompletionSystemMessageParam } from "openai/resources/index.mjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const messages: ChatCompletionMessage[] = body.messages;

        // Truncate messages to the last 6
        const messageTruncated = messages.slice(-6);

        // Generate embedding from truncated messages
        const embedding = await getEmbedding(
            messageTruncated.map((message) => message.content).join("\n")
        );

        const { userId } = await auth();

        // Query vector database for relevant notes
        const vectorQueryResponse = await notesIndex.query({
            vector: embedding,
            topK: 1,
            filter: { userId }
        });

        // Fetch relevant notes from database
        const releventNotes = await prisma.note.findMany({
            where: {
                id: {
                    in: vectorQueryResponse.matches.map((match) => match.id)
                }
            }
        });

        console.log("Relevant notes found: ", releventNotes);

        // Construct system message (ensure content is a valid string)
        const systermMessage: ChatCompletionSystemMessageParam = {
            role: 'system',
            content:
                "You are an intelligent AI note creator. You answer the users based on their notes. " +
                "The relevant notes for this query are: \n" +
                releventNotes.map((Note) => {
                    const title = Note.title || 'Untitled'; // Ensure title is never null
                    const content = Note.content || 'No content available'; // Ensure content is never null
                    return `Title: ${title}\n\nContent: ${content}`;
                }).join("\n\n"),
        };

        // Ensure content is a string (even if it's empty)
        if (!systermMessage.content) {
            systermMessage.content = '';  // Fallback to an empty string if content is null or undefined
        }

        // Ensure messageTruncated is valid (should contain valid messages)
        const validMessages: ChatCompletionMessageParam[] = messageTruncated.map(message => {
            return {
                role: "system" , // Ensure the original role (user/assistant) is preserved
                content:"You are a very good ai integrated note taking app" // Ensure content is never null
            };
        });

        // Add systermMessage to the array and pass it to the OpenAI API
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [systermMessage, ...validMessages],  // Make sure all messages are valid
            stream: false,  // Set to false if not streaming
        });

        // Return the response from OpenAI
        return Response.json(response);



    } catch (error) {
        console.error(error);
        return Response.json({ error: "invalid input" }, { status: 400 });
    }
}
