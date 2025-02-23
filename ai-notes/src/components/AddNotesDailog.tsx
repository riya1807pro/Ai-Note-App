import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateNoteSchema , createNoteSchema  } from "@/lib/validation/note";
import { DialogContent,DialogFooter,DialogHeader,Dialog ,DialogTitle} from "./ui/dialog";
import { Form,FormLabel, FormMessage,FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import Loadingbutton from "./ui/koading-button";
import { useRouter } from "next/navigation";

interface AddNotesDailogProps{
    open : boolean,
    setOpen : (open:boolean) => void,
}

export default function AddNotesDailog({open , setOpen} : AddNotesDailogProps ){
    const router = useRouter();
    const form = useForm<CreateNoteSchema>({
        resolver : zodResolver(createNoteSchema),
        defaultValues: {
            title : "",
            content: "",
        }
    })

    async function onSubmit(input:CreateNoteSchema) {
       try {
        const response = await fetch("/api/notes", {
            method:"POST",
            body: JSON.stringify(input)
        })
        if(!response.ok) throw Error("Status code: "+ response.status)
        form.reset()   
    router.refresh() 
    setOpen(false)

       } catch (error) {
        console.error(error);
        alert("something went wrong Please try again later")
       }
    }

    return (
       <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Note</DialogTitle>
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
        <DialogFooter>
            <Loadingbutton 
            type="submit"
            loading={form.formState.isSubmitting}
            >
                Submit
            </Loadingbutton>
        </DialogFooter>
       </Dialog>
    )

}