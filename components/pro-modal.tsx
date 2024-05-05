"use client";

import axios from "axios";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useProModal } from "@/hooks/use-pro-modal";
import {Card} from '@/components/ui/card'
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";


const lists = [
    {
        label: "All courses",
        color: "text-black-500",
        bgColor: "bg-white-500/10"
    },
    {
        label: "All source codes",
        color: "text-black-500",
        bgColor: "bg-white-500/10"
    },
    {
        label: "Code problems",
        color: "text-black-500",
        bgColor: "bg-white-500/10"
    },
    {
        label: "Private community",
        color: "text-black-500",
        bgColor: "bg-white-500/10"
    },
    {
        label:"Weekly workshops",
        color: "text-black-500",
        bgColor: "bg-white-500/10"
    },
]

export const ProModal = () => {
    
    const proModal = useProModal();
    const [loading, setLoading] = useState(false)
    const isSub= true;
    const onSubscribe = async () => {

        try {
            setLoading(true);
            const response = await axios.post(`/api/stripe`)
            window.location.href = response.data.url;

        } catch (error) {
            console.log(error, 'STRIPE_CLIENT_ERROR')
        } finally{
            setLoading(false);
        }
    }
    
    return (

        <Dialog open = {proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>               
                    <DialogHeader>
                        <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                            <div className="flex items-center gap-x-2 font-bold py-1">
                            Upgrade to Pro
                            <Badge className='uppercase text-sm py-1'>
                                Pro
                            </Badge>
                            </div>                          
                        </DialogTitle>
                        <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
                            {lists.map((list) => (
                                <Card 
                                    key={list.label}
                                    className="p-3 border-black/5 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-x-4">
                                        <div className='font-semibold text-sm'>
                                            {list.label}
                                        </div>
                                    </div>
                                    <Check className="text-primary w-5 h-5"/>
                                </Card>
                            ))}
                        </DialogDescription>
                    </DialogHeader> 
                <DialogFooter>
                    <Button onClick={onSubscribe} size ='lg' className="w-full">
                            Upgrade
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}