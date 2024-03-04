import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn';
import {GrAddCircle} from 'react-icons/gr'
import {BiRightArrow} from "react-icons/bi"
import { useDispatch, useSelector } from 'react-redux';
import { setEditCourse, setStep, setCourse} from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI';
import NestedView from './NestedView';

const CourseBuilderForm = () => {

  const {
    register, 
    handleSubmit,
    setValue,
    formState:{errors}
  } = useForm();

  const [editSectionName, setEditSectionName] = useState(null);
  const dispatch = useDispatch();
  const {course} = useSelector((state)=>state.course)
  const [loading,setLoading]= useState(false)
  const {token} = useSelector((state)=>state.auth)

  const cancelEdit = () => {
    setEditSectionName(null);
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
      // console.log("edit", result)
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
      // console.log("section result", result)
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
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
        <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-2">
            
            <label  
              className="text-sm text-richblack-5" 
              htmlFor='sectionName'>
                Section Name
                <sup className='text-pink-200'>*</sup>
            </label>

            <input
            id='sectionName'
            disabled={loading}
            placeholder='Add Section Name'
            {...register("sectionName",{required:true})}
            className={'w-full text-black form-style'}
            />
            {
              errors.sectionName && (
                <span className='ml-2 text-xs tracking-wide text-yellow-5'>
                  Section Name is Required
                </span>
              )
            }
          </div>

          <div className='mt-10 flex items-end gap-x-4'>
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

        {/* Back & Next button */}
        <div className='flex justify-end gap-x-3'>
          <button onClick={goBack} 
          className='rounded-md cursor-pointer flex items-center'>
            Back
          </button>
          <button onClick={goToNext} 
          className='rounded-md border border-yellow-50 py-2 px-5 font-semibold text-richblack-900 bg-yellow-50 cursor-pointer flex items-center'>
            Next
          </button>
          {/* <IconBtn 
          // While loading: disable its functioning
            disabled={loading} 
            text={"Next!"}
            type={"button"} 
            outline = {false}
            onClick={goToNext}>
            <BiRightArrow/>
          </IconBtn> */}
        </div>

        




    </div>
  )
}

export default CourseBuilderForm