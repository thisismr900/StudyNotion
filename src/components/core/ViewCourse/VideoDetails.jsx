import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';

import { BigPlayButton, Player } from 'video-react'
import 'video-react/dist/video-react.css';
import {AiFillPlayCircle} from "react-icons/ai"
import IconBtn from '../../common/IconBtn';

const VideoDetails = () => {

  const {courseId, sectionId, subSectionId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const playerRef = useRef(null);
  const {token} = useSelector((state)=>state.auth);
  const {courseSectionData, courseEntireData, completedLectures} = useSelector((state)=>state.viewCourse);

  const [videoData, setVideoData] = useState([]);
  const [videoEnded,setVideoEnded] = useState(false);
  const [loading,setLoading] = useState(false);
  const [previewSource, setPreviewSource] = useState("");

  useEffect(()=>{
    const setVideoSpecificDetails = async() => {
      if(!courseSectionData.length)return;

      if(!courseId && !sectionId && !subSectionId){
        navigate("/dashboard/enrolled-courses");
      }
      else{
        const filteredSection = courseSectionData.filter(
          (section)=> section._id === sectionId)
          // console.log("filteredSection:",filteredSection);
        // Note:filter returns array
        const filteredVideoData = filteredSection?.[0].subSection.filter(
          (subSection)=> subSection._id === subSectionId
        )
        // console.log("filteredVideoData",filteredVideoData)
        setVideoData(filteredVideoData?.[0]);
        setPreviewSource(courseEntireData.thumbnail)
        setVideoEnded(false);
      }
    }
    setVideoSpecificDetails();
  },[courseSectionData,courseEntireData,location.pathname])


  const isFirstVideo = () => {
    //first section ka first subsection = firstVideo
    //section[0].subSection[0]
    const currentSectionIndex = courseSectionData.findIndex(
      (sec)=>sec._id === sectionId
    )
    if(currentSectionIndex!=0)
      return false;
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (subSec)=> subSec._id ===  subSectionId
    )
    if(currentSubSectionIndex === 0)
      return true;
    else 
      return false;
  }


  const isLastVideo = () => {
    //Last section ka last subsection = lastVideo
    // section[n-1].section[n-1] = last video
    const noOfSection = courseSectionData.length;
    const currentSectionIndex = courseSectionData.findIndex(
      (sec)=>sec._id === sectionId
    )
    if(currentSectionIndex !== noOfSection-1) return false;

    const noOfSubSection = courseSectionData[currentSectionIndex].subSection.length;
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (subSec)=>subSec._id===subSectionId
    )
    if(currentSubSectionIndex === noOfSubSection-1)return true;
    return false;
  }


  const goToNextVideo = () => {
  //CASE 1: subsection exists after currentSubSection
  //CASE 2: NO subsection after currentSubSection-> navigate to first subsection of NEXT section
  //in case2,what if no next section;handle this logic elsewhere.(By not showing Next video option)
    const currentSectionIndex = courseSectionData.findIndex(
      (sec)=>sec._id === sectionId
    )
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (subSec)=> subSec._id ===  subSectionId
    )
    const noOfSection = courseSectionData.length;
    const noOfSubSection = courseSectionData[currentSectionIndex].subSection.length;
    
    //case 1:
    if(currentSubSectionIndex !== noOfSubSection-1){
      //navigate to next subsection of same section
      const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex+1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
    }

    //case 2:
    else{
      // navigate to first subsection of NEXT section
      const nextSectionId = courseSectionData[currentSectionIndex+1]._id;
      const nextSubSectionId = courseSectionData[currentSectionIndex+1].subSection[0]._id;
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
    }

  }


  const goToPrevVideo = () => {
  //CASE 1: subsection exists before currentSubSection
  //CASE 2: NO subsection before currentSubSection-> navigate to LAST subsection of prev section
  //in case2,what if no prev section;handle this logic elsewhere.(By not showing Prev video option)
    const currentSectionIndex = courseSectionData.findIndex(
      (sec)=>sec._id === sectionId
    )
    const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection?.findIndex(
      (subSec)=> subSec._id ===  subSectionId
    )
    
    //case 1:
    if(currentSubSectionIndex > 0){
      //navigate to prev subsection of same section
      const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex-1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`);
    }

    //case 2:
    else {
      // navigate to last subsection of prev section
      const prevSectionId = courseSectionData[currentSectionIndex-1]._id;
      const prevSectionLength = courseSectionData[currentSectionIndex-1].subSection.length;
      const prevSubSectionId = courseSectionData[currentSectionIndex-1].subSection[prevSectionLength-1]._id;
      navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`);
    }

  }



  const handleLectureCompletion = async() => {
    console.log("handleLectureCompletion" )
    //once lecture/subsection is done->create entry in db(courseProgress schema)->also update in UI
    setLoading(true);
    console.log("loading:",loading)


    const res = await markLectureAsComplete({courseId:courseId, subSectionId: subSectionId},token);
    console.log("api call res:",res)
    //update in state
    if(res){
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false);
    
  }

  const handleLectureRewatch = () => {
    if(playerRef?.current){
      playerRef.current?.seek(0);
      setVideoEnded(false);
      
    }
  }

  return (
    <div className='flex flex-col gap-5 text-white'>
    {
      !videoData ? (
      <img
        src={previewSource}
        alt='Preview'
        className='h-full w-full rounded-md object-cover'
      />
        )
      : (
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          onEnded={()=>setVideoEnded(true)}
          src={videoData?.videoUrl}
        >
          <BigPlayButton position="center"/>
          {
            // Renders when video ends
            videoEnded && (
              <div
              style={
                {backgroundImage:
                "linear-gradient(to top, rgb(0,0,0), rgba(0,0,0.7), rgba(0,0,0.5), rgba(0,0,0.1)"}
              }
              className='full absolute inset-0 z-[100] grid h-full place-content-center font-inter'>
                {
                  !completedLectures.includes(subSectionId) && (
                    <IconBtn 
                      disabled={loading}
                      onclick = {()=>handleLectureCompletion()}
                      text = {!loading ? "Mark as Completed" : "Loading..."}  
                      customClasses={"text-xl max-w-max px-4 mx-auto"}
                    />
                  )
                }
                <IconBtn
                      disabled={loading}
                      onclick = {()=>handleLectureRewatch()}
                      text = {"Rewatch"}
                      customClasses="text-xl max-w-max px-4 mx-auto mt-2"  
                />

                <div className='mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl'>
                  {!isFirstVideo() && (
                    <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className='blackButton'
                    >
                      Prev
                    </button>
                  )}

                  {
                    !isLastVideo() && (
                      <button
                      disabled={loading}
                      onClick={goToNextVideo}
                      className='blackButton'
                      >
                        Next
                      </button>
                    )
                  }
                </div>
              </div>
            )
          }
      </Player>
      )
    }  

    <h1 className='mt-4 text-3xl font-semibold'>{videoData?.title}</h1>
    <p className='pt-2 pb-6'>{videoData?.description}</p>

    </div>
  )
}

export default VideoDetails