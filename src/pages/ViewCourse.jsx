import React from 'react'
import { useEffect } from 'react';
// import { set } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import VideoDetailsSideBar from '../components/core/ViewCourse/VideoDetailsSideBar';
import { useState } from 'react';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';



const ViewCourse = () => {

  const [reviewModal,setReviewModal] = useState(false);
  const {courseId} = useParams();
  const {token} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();

  useEffect(()=>{
  
    const setCourseSpecificDetails = async () =>{
      const courseData = await getFullDetailsOfCourse(courseId,token);
      dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
      dispatch(setEntireCourseData(courseData.courseDetails))
      dispatch(setCompletedLectures(courseData.completedVideos))
      let lectures = 0;
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length;
      }); 
      dispatch(setTotalNoOfLectures(lectures));
    }
    setCourseSpecificDetails();
  },[])

  return (
    <div className='relative flex min-h-[calc(100vh-3.5rem)]'>
        <div className='h-[calc(100vh-3.5rem)] flex-1 overflow-auto'>
            <VideoDetailsSideBar setReviewModal={setReviewModal}/>
            <div className='mx-6'>
                <Outlet/>
            </div>
        </div>
        {reviewModal && <CourseReviewModal setReviewModal={setReviewModal}/>}

    </div>
  )
}

export default ViewCourse