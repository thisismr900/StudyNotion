import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI'
import IconBtn from '../../common/IconBtn'
import CourseTable from './InstructorCourses/CourseTable'
import { useEffect } from 'react'
import { useState } from 'react'
const MyCourses = () => {

    const {token} = useSelector((state)=>state.auth)
    const navigate = useNavigate();

    const [myCourses,setMyCourses] = useState([]);

    useEffect(()=>{
        const fetchCourses = async()=> {
          console.log("All courses going to fetch:.......",myCourses);
            const result = await fetchInstructorCourses(token)
            if(result){
              setMyCourses(result);
            }
        }
        fetchCourses();
        console.log("All courses fetched:.......",myCourses);
    },[])




  return (
    <div className='text-white'>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">
          My Courses
        </h1>
        <IconBtn 
        text={"Add Course"}
        onclick={()=> navigate("/dashboard/add-course")}
        />
      </div>
      {
        myCourses && <CourseTable myCourses = {myCourses} setMyCourses = {setMyCourses}/>
      }
    </div>
  )
}

export default MyCourses