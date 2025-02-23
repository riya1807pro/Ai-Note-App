import {useForm} from "react-hook-from "
import { zodResolver } from "@hook=form/resolvers/zod";
import { CreateNoteSchema , createNoteSchema  } from "@/lib/vadilation/note";
import { Input } from "./ui/input";

interface AddNotesDailogProps{
    open : boolean,
    setOpen : (open,boolean) => void,
}

export default function AddNotesDailog({open , setOpen} : AddNotesDailogProps ){
    const Form = useForm<CreateNoteSchema>({
        resolver : zodResolver(createNoteSchema)
    })

    async function onSubmit(inputs:CreateNoteSchema) {
        alert(inputs)
    }

}