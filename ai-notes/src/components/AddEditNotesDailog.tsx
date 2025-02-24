import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateNoteSchema , createNoteSchema  } from "@/lib/validation/note";
import { DialogContent,DialogFooter,DialogHeader,Dialog ,DialogTitle} from "./ui/dialog";
import { Form,FormLabel, FormMessage,FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import Loadingbutton from "./ui/koading-button";
import { useRouter } from "next/navigation";
import { Note } from "@prisma/client";
import { useState } from "react";


interface AddEditNotesDailogProps{
    open : boolean,
    setOpen : (open:boolean) => void,
    noteToEdit?:Note
}

export default function AddEditNotesDailog({open , setOpen,noteToEdit} : AddEditNotesDailogProps ){
    const [deleteInProcess,setDeleteInProcess] = useState(false)
    const router = useRouter();
    const form = useForm<CreateNoteSchema>({
        resolver : zodResolver(createNoteSchema),
        defaultValues: {
            title : noteToEdit?.title || "",
            content: noteToEdit?.content||"",
        }
    })

    async function onSubmit(input:CreateNoteSchema) {
       try {
     if (noteToEdit) {
        const response  = await fetch("/api/notes",{
            body: JSON.stringify({
                id:noteToEdit.id,
                ...input
            })
        })
        if(!response.ok) throw Error("Status code: "+ response.status)
     } else {
           const response = await fetch("/api/notes", {
            method:"POST",
            body: JSON.stringify(input)
        })
            if(!response.ok) throw Error("Status code: "+ response.status)
                form.reset()   
     }
   
    router.refresh()  
    setOpen(false)

       } catch (error) {
        console.error(error);
        alert("something went wrong Please try again later")
       }
    }


     async function deleteNote() {
        if(!noteToEdit) return;
        setDeleteInProcess(true)
        try {
            const Response = await fetch("/api/notes",{
                method:"DELETE",
                body:JSON.stringify({
                    id:noteToEdit.id
                })
            })
            if(!Response.ok) throw Error("Status code: "+Response.status)
                router.refresh();
            setOpen(false)
        } catch (error) {
            console.error(error);
            alert("something went wrong Please try again later")
        } finally{
            setDeleteInProcess(false)
        }
    }

    return (
       <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{noteToEdit? "Edit note" : "Add note"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField 
                    control={form.control}
                    name="title"
                    render={({field })=>(
                        <FormItem>
                            <FormLabel>
                            Note Title
                                 </FormLabel>
                           
                            <FormControl>
                                <Input placeholder="Note title" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />

<FormField 
                    control={form.control}
                    name="title"
                    render={({field })=>(
                        <FormItem>
                            <FormLabel>
                            Note Content
                                 </FormLabel>
                           
                            <FormControl>
                                <Textarea placeholder="Note Content" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                </form>

            </Form>
        </DialogContent>
        <DialogFooter className="gap-1 sm:gap-0">
            {noteToEdit&& (
                <Loadingbutton
                variant="destructive"
                loading={deleteInProcess}
                disabled={form.formState.isSubmitting}
                onSubmit={deleteNote}
                type="button"
                >
                    Delete Note
                </Loadingbutton>
            )}
            <Loadingbutton 
            type="submit"
            loading={form.formState.isSubmitting}
            disabled={deleteInProcess}
            >
                Submit
            </Loadingbutton>
        </DialogFooter>
       </Dialog>
    )

}