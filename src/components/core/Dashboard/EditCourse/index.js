import React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  useParams } from 'react-router-dom'
import RenderSteps from '../AddCourse/RenderSteps';
import { useEffect } from 'react';
import { getFullDetailsOfCourse } from '../../../../services/operations/courseDetailsAPI';
import { setCourse, setEditCourse } from '../../../../slices/courseSlice';


export default function EditCourse() {
    const dispatch = useDispatch();
    const {courseId} = useParams();
    const {course} = useSelector((state)=>state.course)
    const {token} = useSelector((state)=>state.auth)
    const [loading,setLoading] = useState(false);
    
    useEffect(()=>{
        const populatedCourseDetails = async() => {
            setLoading(true);
            const result = await getFullDetailsOfCourse(courseId,token);
            console.log("Full details of crs,result:",result)
            console.log("Full details of crs,result?.courseDetails:",result?.courseDetails)
            if(result?.courseDetails){
                dispatch(setEditCourse(true));
                dispatch(setCourse(result?.courseDetails))
            }
            setLoading(false);
        }
        populatedCourseDetails();
    },[])
    
    if(loading){
        return(<div className='text-white'>Loading...</div>)
    }
    return (
    <div className='text-white'>
        <h1>Edit Course</h1>

        <div className="mx-auto max-w-[600px]">
            {
                course ? 
                (<RenderSteps/>):
                (<p className="mt-14 text-center text-3xl font-semibold text-richblack-100">Course Not Found</p>)
            }
        </div>
    </div>
  )
}
