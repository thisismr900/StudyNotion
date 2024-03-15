import React, { useEffect, useState } from 'react'
import { buyCourse } from '../services/operations/studentFeaturesApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI';
import ConfirmationModal from "../components/common/ConfirmationModal"
import GetAvgRating from '../utils/avgRating';
import Error from './Error';
import RatingStars from "../components/common/RatingStars"
import { formatDate } from '../services/formatDate';
import CourseDetailsCard from '../components/core/Course/CourseDetailsCard';

const CourseDetails = () => {

  const {user} = useSelector(((state)=>state.profile))
  const {token} = useSelector((state)=> state.auth)
  const {loading} = useSelector((state)=>state.profile);
  const {paymentLoading} = useSelector((state)=>state.course);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {courseId} = useParams();

  const [courseData, setCourseData] = useState(null);
  useEffect(()=>{
    const getCourseFullDetails = async () => {
      console.log("going to fetch course details.........")
      try{
        const result = await fetchCourseDetails(courseId);
        console.log("courseFullDetails...",result)
        setCourseData(result);
      }
      catch(error){
        console.log("Could not fetch course details")
      }
    }
    console.log("courseData.data->",courseData?.data)
    getCourseFullDetails();
  },[ courseId ])

  const [avgReviewCont, setAvgReviewCount] = useState(0);

  useEffect(()=>{
    const count = GetAvgRating(courseData?.data?.courseDetails?.ratingAndReviews);
    setAvgReviewCount(count);
  },[courseData])

  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);

  useEffect(()=>{
    let lectures = 0;
    courseData?.data?.courseDetails?.courseContent?.forEach((sec)=>{
      lectures += sec.subSection.length || 0;
    })
  },[courseData])


  const handleBuyCourse = () => {
    // console.log("handle buy course....")
    // console.log("[courseID]:",[courseId])
    // console.log("Token in handleBuyCourse,",token)

    if(token){
      buyCourse(token, [courseId], user, navigate,dispatch);
      return;
    }
    else{
      setConfirmationModal({
        text1 : "You are not logged in",
        text2 : "Log in to purchase the course",
        btn1Text : "Login",
        btn2Text : " Cancel",
        btn1Handler : ()=>navigate("/login"),
        btn2Handler : setConfirmationModal(null),
      })
    }
  }

  if(loading)
  {
    return(
      <div className='text-white'>Loading...</div>
    )
  }
  if(!courseData)
  {
    return(
      <div className='text-white'>CourseData not fetched yet...</div>
    )
  }

  if(!courseData.success){
    return (
      <div>
        <Error/>
      </div>
    )
  }

  const {
    // _id:course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = courseData.data?.courseDetails;

  return (
    <div className='flex items-center text-white'>
        
    <div className='relative flex-col justify-start'>
      <p>{courseName}</p>
      <p>{courseDescription}</p>
      <div>
        <span>{avgReviewCont}</span>
        <RatingStars Review_Count={avgReviewCont} Star_Size={24}/>
        <span>{`${ratingAndReviews.length} reviews`}</span>
        <span>{`${studentsEnrolled.length} students enrolled`}</span>
      </div>

      <div>
        <span>Created By {`${instructor.firstName}`}</span>
      </div>
        
      <div className='flex gap-x-3'>
        <p>
          Created At {formatDate(createdAt)}
        </p>
        <p>
        {" "} English
        </p>
      </div>

      <div>
        <CourseDetailsCard 
          course = {courseData?.data?.courseDetails}
          setConfirmationModal = {setConfirmationModal}
          handleBuyCourse={handleBuyCourse}

        
        />
      </div>


    </div>
        
        
        
        
        
        
        
        
        
        
        
        
        
      





        {
          confirmationModal &&
          <ConfirmationModal modalData={confirmationModal} />
        }
    </div>
  )
}

export default CourseDetails