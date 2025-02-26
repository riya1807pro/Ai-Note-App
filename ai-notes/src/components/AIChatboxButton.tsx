import { useState } from "react";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";
import AiChatbox from "./AiChatbox";

export default function AiChatboxButton() {
        const [chatBoxOpen,setChatBoxOpen] = useState(false);

        return <>
        <Button onClick={()=>{setChatBoxOpen(true)}}>
            <Bot className="mr-2 " size={20}/>
            Ai chat 
        </Button>
        <AiChatbox open={chatBoxOpen} onClose={()=>setChatBoxOpen(false)}/>
        </>

}