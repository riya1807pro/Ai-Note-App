import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


export default function Navbar() {
        return <div>
                <div className="flex gap=3 justify-center items-center  flex-wrap shadow max-w-7 m-auto">
                        <Link className="flex gap-1 items-center"
                        href={'/notes'}
                        ><Image src={'/logo.png'} alt="logo" width={40} height={40}/>
                        <span className="font-bold">flowbrain</span>
                        </Link>
              <div className="flex items-center gap-2">
                <UserButton
                afterSignOutUrl="/"
                appearance={{
                        elements : { avatarBox :{
                                width: "2.5rem" , height: "2.5rem"
                        } }
                }}
                />
        <Button>
                <Plus className="mr-2" size={20}/>
                Add Note
        </Button>
              </div>
                </div>
        </div>
}