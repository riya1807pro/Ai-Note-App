import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";


export const metadata : Metadata = {
    title : "FlowBraim - SignUp"
}

export default function SignUpPage (){
    return(
        <div className="flex item-center justify-center h-screen">
            <SignUp appearance={{
                variables : {
                    colorPrimary: "#0F1724"
                }
            }}/>
        </div>
    )
}