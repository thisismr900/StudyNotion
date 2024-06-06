import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';

const VideoDetails = () => {

  const {courseId, sectionId, subSectionId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const playerRef = useRef();
  const {token} = useSelector((state)=>state.auth);
  const {courseSectionData, courseEntireData, completedLectures} = useSelector((state)=>state.viewCourse);

  const [videoData, setVideoData] = useState([]);
  const [videoEnded,setVideoEnded] = useState(false);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    const setVideoSpecificDetails = async() => {
      if(!courseSectionData.length)return;

      if(!courseId && !sectionId && !subSectionId){
        navigate("/dashboard/enrolled-courses");
      }
      else{
        const filteredSection = courseSectionData.filter(
          (section)=> section._id === sectionId)
        // Note:filter returns array
        const filteredVideoData = filteredSection?.[0].filter(
          (subSection)=> subSection._id === subSectionId
        )
        setVideoData(filteredVideoData?.[0]);
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
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
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
    //once lecture/subsection is done->create entry in db(courseProgress schema)->also update in UI
    setLoading(true);
    const res = await markLectureAsComplete({courseId:courseId, subSectionId: subSectionId},token);
    //update in state
    if(res){
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false);
    
  }

  return (
    <div className='text-white'>
        videodetails
    </div>
  )
}

export default VideoDetails