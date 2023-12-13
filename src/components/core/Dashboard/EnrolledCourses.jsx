import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI';
import ProgressBar from '@ramonak/react-progress-bar';
import toast from 'react-hot-toast';


const EnrolledCourses = () => {

    const {token} = useSelector((state)=> state.auth);
    const [enrolledCourses, setEnrolledCourses] = useState(null);

    const getEnrolledCourses = async() => {
        try{    
            const response = await getUserEnrolledCourses(token)
            setEnrolledCourses(response)
            console.log("setEnrolledCourse Response....",response);
            // toast.success("Entrolled courses fetched from getEnrolledCourese")

        }catch(error){
            console.log("Unable to fetch Entrolled courses")
            toast.error("Unable to fetch Entrolled courses from getEnrolledCoureses")
        }
    }
    useEffect(()=>{
        getEnrolledCourses();
    },[])





  return (
    <div className='text-white'>
        <div>Enrolled Courses</div>
        {
            !enrolledCourses ? (<div>Loading your enrolled courses...</div>)
            :
                !enrolledCourses.length>0 ? (
                    <p>You have not enrolled in any course yet</p>
                )
                :(
                    <div>
                        <div>
                            <p> Course Name </p>
                            <p> Duration </p>
                            <p> Progress</p>
                        </div>
                        {/* Cards */}
                        {
                            enrolledCourses.map( (course,index) =>{
                                return (
                                    <div key={index}>
                                        <div>
                                            <img src={course.thumbnail}/>
                                            <div>
                                                <p>{course.courseName}</p>
                                                <p>{course.courseDescription}</p>
                                            </div>
                                        </div>

                                        <div>
                                            {course?.totalDuration}
                                        </div>

                                        <div>
                                            <p>Progress : {course.progressPercentage || 0}%</p>
                                            <ProgressBar 
                                                completed = {course.progressPercentage || 0}
                                                height = '8px'
                                                isLabelVisible = {false}
                                            />

                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            
        }
    </div>
  )
}

export default EnrolledCourses