import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { File } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";

import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";
import { any, boolean } from "zod";

const ChapterIdPage = async ({
  params
}: {
  params: { courseId: string; chapterId: string }
}) => {
  const { userId } = auth();
  
  if (!userId) {
    return redirect("/");
  } 

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
    subscribed
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });
  if (!chapter || !course) {
    return redirect("/")
  }


  let isLocked: boolean= !chapter.isFree && !purchase && !subscribed ;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;
  console.log(chapter)
  console.log("puchasse dets",purchase)
  console.log("isLocked",isLocked)
  return ( 
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="You already completed this chapter."
        />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">     
        

        {!isLocked ? (
        <iframe  src={chapter.videoUrl || undefined} width= "100%" height="500px"  />   

      ) :<></>}
             
              {/* <VideoPlayer
                chapterId={params.chapterId}
                title={chapter.title}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isLocked={isLocked}
                completeOnEnd={completeOnEnd}
                videoUrl={chapter.videoUrl}
              /> */}
          
            {/* {chapter.videoUrl === "pdf" && (
               <div>
               {!purchase && isLocked && (
                 <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                  
                   <p className="text-sm">
                     This chapter is locked
                   </p>
                 </div>
               )}
               {purchase && (<iframe  src={chapter.videoUrl || undefined} width= "100%" height="500px"  /> )}
               
             </div>
            )} */}





          {/* {
              //  <iframe  src={chapter.videoUrl || undefined} width= "100%" height="500px"  />   
           <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          /> } */}
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">
              {chapter.title}
            </h2>
            {purchase || subscribed ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
           
          </div>
         

          
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {chapter.videoUrl}
                {attachments.map((attachment) => (
                  <a 
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">
                      {attachment.name}
                    </p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
   );
}
 
export default ChapterIdPage;