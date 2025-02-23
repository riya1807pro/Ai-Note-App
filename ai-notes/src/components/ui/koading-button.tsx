import { Loader2 } from "lucide-react"
import { ButtonProps ,Button} from "./button"

type LoadingButtonProps = {
    loading: boolean
} & ButtonProps

export default function Loadingbutton ({
    children,
    loading,
    ...props
} : LoadingButtonProps){
    return (
        <Button {...props } disabled={props.disabled || loading } >
            {loading&& <Loader2 className="mr-2 h-4 w-4 animate-spin"/> }
            {children}
        </Button>
    )
}