'use client';

import * as z from 'zod';
import axios from 'axios';
import {ImageIcon, Pencil, PlusCircle, Video, File, Loader2, X} from 'lucide-react'
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import  toast  from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {Chapter, MuxData,Attachment,Course} from '@prisma/client';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';


interface ChapterWithAttachments extends Chapter{
   attachments : Attachment[] 
}

interface ChapterAttachmentFormProps{
    initialData:ChapterWithAttachments & {muxData?: MuxData | null};
    courseId: string;
    chapterId: string;
};

const formSchema = z.object({
        videoUrl: z.string().min(1),
        //url: z.string().min(1)
});

export const ChapterAttachmentForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterAttachmentFormProps) =>{

    console.log('Initial Data:', initialData.attachments);

    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

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
    const onDelete = async(id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
            toast.success('Attachment deleted');
            router.refresh();
        } catch {
            toast.error('Something went wrong');
        }finally {
            setDeletingId(null);
        }
    }
    return (

        // <div className='mt-6 border bg-slate-100 rounded-md p-4'>
        //     <div className='font-medium flex items-center justify-between'>
        //         Course Attachement
        //         <Button onClick={toggleEdit} variant='ghost'>
        //             {isEditing && (<>Cancel</>)}
        //             {!isEditing && (
        //                 <>
        //                     <PlusCircle className='h-4 w-4 mr-2'/>
        //                     Add a File
        //                 </>
        //             )}
                    
        //         </Button>
        //     </div>
        //     {!isEditing && (
        //         <>
        //         {initialData.attachments && initialData.attachments.length === 0 && (
        //             <p className='text-sm mt-2 text-slate-500 italic'>
        //                 No Attachements yet
        //             </p>
        //         )}

        //         {initialData.attachments && initialData.attachments.length > 0 && (
        //             <div className='space-y-2'>
        //                 {initialData.attachments.map((attachment) => (
        //                     <div 
        //                         key ={ attachment.id}
        //                         className='flex items-center p-3 w-full bg-sky-100
        //                         border-sky-200 border text-sky-700 rounded-md'
        //                     >
        //                         <File className='h-4 w-4 mr-2 flex-shrink-0'/>
        //                         <p className='text-xs line-clamp-1'>
        //                             {attachment.name}
        //                         </p>
        //                         {deletingId === attachment.id && (
        //                             <div>
        //                                 <Loader2  className='h-4 w-4 animate-spin'/>
        //                             </div>
        //                         )}
                                
        //                         {deletingId !== attachment.id && (
        //                             <button onClick={()=> onDelete(attachment.id)}
        //                             className='ml-auto over:opacity-75 transition'>
        //                                 <X className='h-4 w-4'/>
        //                             </button>
        //                         )}
        //                     </div>
        //                 ))}
        //             </div>
        //         )}
        //         </>
                
        //     )}
        //     {isEditing && (
        //         <div>
        //             <FileUpload 
        //                 endpoint = "chapterAttachments"
        //                 onChange={(url)=>{
        //                     if(url){
        //                         onSubmit({videoUrl: url})
        //                     }
        //                 }}  
        //             />
        //             <div className='text-xs text-muted-foregroun mt-4'>
        //                Add anything students might need to compelete the course
        //             </div>
        //         </div>
        //     )}
        // </div>
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Chapter Attachment
                <Button onClick={toggleEdit} variant='ghost'>
                    {isEditing && (<>Cancel</>)}
                    {!isEditing && (!initialData.videoUrl)&& (
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
                        <File className='h-10 w-10 text-slate-500'/>
                    </div>
                ):(
                    <div className='relative aspect-video mt-2'>
                        Attachment Uploaded
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
                            }
                        }}  
                    />
                    <div className='text-xs text-muted-foreground mt-4'>
                       Upload this chapter&apos;s video
                    </div>
                </div>
            )}

            {initialData.videoUrl && !isEditing && (
                <div className='text-xs text-muted-foreground mt-4'>
                    Videos can take few minutes to process. Refresh the page if the video 
                    does not appear.
                </div>
            )}

        </div>
    )
}