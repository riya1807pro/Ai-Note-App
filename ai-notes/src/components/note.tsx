'use client'

import { Note as NoteModel } from "@prisma/client"; // Correct import for Prisma model
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import AddEditNotesDailog from "./AddEditNotesDailog";

interface NoteProps {
  note: NoteModel; // Use the correct Prisma model type
}

export default function Note({ note }: NoteProps) {
const [showEditDialog,setShowEditDialog] = useState(false)

  // Check if the note was updated (compare timestamps)
  const wasUpdated = note.updatedAt > note.createdAt;

  // Determine which timestamp to use for the display
  const createdUpdatedAtTimeStamp = (
    wasUpdated ? note.updatedAt : note.createdAt
  ).toDateString();

  return (
    <>
    <Card className="cursor-pointer transition-shadow shadow-lg"
    onClick={()=>{setShowEditDialog(true)}}
    >
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
        <CardDescription>
          {createdUpdatedAtTimeStamp}
          {wasUpdated && " updated"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{note.content}</p>
      </CardContent>
    </Card>
    <AddEditNotesDailog
    open={showEditDialog}
    setOpen={setShowEditDialog}
    noteToEdit={note}
    />
    </>
  );
}
