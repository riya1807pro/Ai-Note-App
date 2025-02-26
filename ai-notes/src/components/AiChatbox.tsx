import { cn } from '@/lib/utils';
import { useChat } from '@ai-sdk/react'
import { XCircle } from 'lucide-react';
import { Button } from './ui/button';

interface AiChatboxProps {
    open: boolean,
    onClose : () => void
}

export default function AiChatbox({open,onClose}:AiChatboxProps) {
    const {
        messages, 
        input,
        handleInputChange,
        setMessages,
        handleSubmit,
        isLoading,
        error
    } = useChat(); //api/chat

    return <div className={cn('bottom-0 right-0 z-10 w-full max-w-[500px] xl: right-36 p-1',open?"fixed":"hidden")}>
        <button className='mb-1 ms-auto block' onClick={onClose}>
            <XCircle size={30}  />
        </button>
        <div className='flex flex-col h-[480px]  rounded border bg-background shadow-xl'>
            <div className='h-full'> Messages</div>
            <form onSubmit={handleSubmit}>
                <input value={input}
                onChange={handleInputChange}
                placeholder='say something....'
                />
                <Button type='submit' > Send </Button>
            </form>
        </div>
    </div>

}