'use client';

import * as z from 'zod';
import axios from 'axios';
import {FileText, ImageIcon, Pencil, PlusCircle, Video} from 'lucide-react'
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import  toast  from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {Chapter, MuxData} from '@prisma/client';
import {Document, Page} from 'react-pdf';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';

interface ChapterVideoFormProps{
    initialData:Chapter & {muxData?: MuxData | null};
    courseId: string;
    chapterId: string;
};

const formSchema = z.object({
        videoUrl: z.string().min(1)
});

export const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterVideoFormProps) =>{

    const [isEditing, setIsEditing] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(initialData.videoUrl || '');

    const toggleEdit = () => setIsEditing((current) => (!current));

    const router = useRouter();

    
    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success('chapter updated');
            toggleEdit();
            router.refresh();

        } catch{
            toast.error('something went wrong');
            
        }
    }
    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Attachments
                <Button onClick={toggleEdit} variant='ghost'>
                    {isEditing && (<>Cancel</>)}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2'/>
                            Add an attachment
                        </>
                    )}
                    {!isEditing && initialData.videoUrl &&(<>
                        <Pencil className='h-4 w-4 mr-2'/>
                        Edit attachment
                    </>)}
                    
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                        <Video className='h-10 w-10 text-slate-500'/>
                    </div>
                ):(
                    <div className='space-y-2'>
                        <a href={pdfUrl} ><FileText /></a>
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload 
                        endpoint='chapterAttachments'
                        onChange={(url)=>{
                            if(url){
                                onSubmit({videoUrl: url})
                                setPdfUrl(url);
                            }
                        }}  
                    />
                    <div className='text-xs text-muted-foreground mt-4'>
                       Upload this chapter&apos;s video
                    </div>
                </div>
            )}
        </div>
    )
}