"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { getChapter } from "@/actions/get-chapter";

interface VideoPlayerProps {
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
  videoUrl: string;
}

export const VideoPlayer = ({
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
  videoUrl
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        });

        toast.success("Progress updated");
        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">
            This chapter is locked
          </p>
        </div>
      )}
      {!isLocked && (
        <div>
          <h1>{videoUrl || undefined}</h1>
          {/* <iframe src={videoUrl || undefined} width= "100%" height="500px"  /> */}
        </div>
      )}
    </div>
  )
}


















// import axios from "axios";
// //import MuxPlayer from "@mux/mux-player-react";
// import { useState } from "react";
// import { toast } from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { Loader2, Lock } from "lucide-react";

// import { cn } from "@/lib/utils";
// //import { useConfettiStore } from "@/hooks/use-confetti-store";

// interface VideoPlayerProps {
//   playbackId: string;
//   courseId: string;
//   chapterId: string;
//   nextChapterId?: string;
//   isLocked: boolean;
//   completeOnEnd: boolean;
//   title: string;
//   pdfUrl: string;
// };

// export const VideoPlayer = ({
//   playbackId,
//   courseId,
//   chapterId,
//   nextChapterId,
//   isLocked,
//   completeOnEnd,
//   title,
//   pdfUrl
// }: VideoPlayerProps) => {
//   const [isReady, setIsReady] = useState(false);
//   const router = useRouter();
//   //const confetti = useConfettiStore();

//   const onEnd = async () => {
//     try {
//       if (completeOnEnd) {
//         await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
//           isCompleted: true,
//         });

//         // if (!nextChapterId) {
//         //   confetti.onOpen();
//         // }

//         toast.success("Progress updated");
//         router.refresh();

//         if (nextChapterId) {
//           router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
//         }
//       }
//     } catch {
//       toast.error("Something went wrong");
//     }
//   }

//   return (
//     <div className="relative aspect-video">
//       {!isReady && !isLocked && (
//         <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
//           <Loader2 className="h-8 w-8 animate-spin text-secondary" />
//         </div>
//       )}
//       {isLocked && (
//         <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
//           <Lock className="h-8 w-8" />
//           <p className="text-sm">
//             This chapter is locked
//           </p>
//         </div>
//       )}
//        {!isLocked && (
//         <div>
//           <embed src={pdfUrl} type="application/pdf" width="100%" height="500px"/>
//         </div>
        
      
//       )} 
//     </div>
//   )
// }

  // <MuxPlayer
        //   title={title}
        //   className={cn(
        //     !isReady && "hidden"
        //   )}
        //   onCanPlay={() => setIsReady(true)}
        //   onEnded={onEnd}
        //   autoPlay
        //   playbackId={playbackId}
        // />