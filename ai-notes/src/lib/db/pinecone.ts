import {Pinecone } from "@pinecone-database/pinecone"
import openai from "../validation/openai";

const apiKey    = process.env.PINECONE_API_KEY;

if(!apiKey ) {
    throw Error ("OPENAI_API_KEY is not set")
}
 
const pinecone = new Pinecone({
    environment: "gcp-starter",
    apiKey
});

export const notedIndex = pinecone.Index("nextjs-ai-note-app")

export async function getEmbedding(text:string) {
    const response = await openai.embeddings.create({
        model:"text-embedding-ada-002",
        input: text
    })

    const embedding = response.data[0].embedding;

    if(!embedding) throw Error("error generating embedding");

    console.log(embedding);

    return embedding;
}