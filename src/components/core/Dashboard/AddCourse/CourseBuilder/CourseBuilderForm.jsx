import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn';
import {GrAddCircle} from 'react-icons/gr'
import {BiRightArrow} from "react-icons/bi"
import { useDispatch, useSelector } from 'react-redux';
import { setEditCourse, setStep } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI';
import NestedView from './NestedView';
import { setCourse } from '../../../../../slices/courseSlice';

const CourseBuilderForm = () => {

  const {
    register, 
    handleSubmit,
    setValue,
    formState:{errors}
  } = useForm();

  const [editSectionName, setEditSectionName] = useState(false);
  const dispatch = useDispatch();
  const {course} = useSelector((state)=>state.course)
  const [loading,setLoading]= useState(false)
  const {token} = useSelector((state)=>state.auth)

  const cancelEdit = () => {
    setEditSectionName(false);
    setValue("sectionName","");
  }

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  }

  const goToNext = () => {
    if(course.courseContent.length === 0){
      toast.error("Please add atleast 1 Section")
      return;
    }
    if(course.courseContent.some((section)=>section.subSection.length === 0)){
      toast.error("Please add atleast one lecture in each section")
      return;
    }
    dispatch(setStep(3));
    
  }

  const onSubmit =async (data) => {
    setLoading(true);
    let result ;

    if(editSectionName){
      //editing section name
      result = await updateSection({
        sectionName: data.sectionName,
        sectionId: editSectionName,
        courseId: course._id,
      },token)
    }
    else{
      //create section 
      result = await createSection({
        sectionName: data.sectionName,
        courseId: course._id,
      },token)
    }

    //update values
    if(result){
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName","");
    }


    //make loading false
    setLoading(false);
  }


  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if(editSectionName === sectionId){
      cancelEdit();
      return;
    }
    
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName)
  }


  return (
    <div className='text-white'>
        <p>Course Builder</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor='sectionName'>Section Name<sup className='text-pink-200'>*</sup></label>
            <input
            id='sectionName'
            placeholder='Add Section Name'
            {...register("sectionName",{required:true})}
            className='w-full'
            />
            {
              errors.sectionName && (
                <span className='text-yellow-5'>Section Name is Required</span>
              )
            }
          </div>

          <div className='mt-10 flex'>
            <IconBtn
            type="Submit"
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline = {true}
            customClasses={"text-yellow-50"}
            >
              <GrAddCircle className='text-yellow-50'/>

            </IconBtn>
            {editSectionName && (
              <button
              type='button'
              onClick={cancelEdit}
              className='text-richblack-300 underline'
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        
        {
          course.courseContent.length > 0 && (
            <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
          )
        }

        <div className='flex justify-end gap-x-3'>
          <button onClick={goBack} 
          className='rounded-md cursor-pointer flex items-center'>
            Back
          </button>
          <IconBtn text={"Next"} onClick={goToNext}>
            <BiRightArrow/>
          </IconBtn>
        </div>

        




    </div>
  )
}

export default CourseBuilderForm