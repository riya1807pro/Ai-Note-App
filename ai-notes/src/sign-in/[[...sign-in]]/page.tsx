import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata : Metadata = {
    title : "FlowBraim - SignIn"
}

export default function SignInPage (){
    return(
        <div className="flex item-center justify-center h-screen">
            <SignIn appearance={{
                variables : {
                    colorPrimary: "#0F1724"
                }
            }}/>
        </div>
    )
}