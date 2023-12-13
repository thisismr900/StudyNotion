import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../common/IconBtn"
import Upload from "./Upload"
import CourseTagInput from "./CourseTagInput"
import RequirementsField from "./RequirementField"

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      const categories = await fetchCourseCategories()
      if (categories.length > 0) {
        // console.log("categories", categories)
        setCourseCategories(categories)
      }
      setLoading(false)
    }
    // if form is in edit mode
    if (editCourse) {
      // console.log("data populated", editCourse)
      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("coursePrice", course.price)
      setValue("courseTags", course.tag)
      setValue("courseBenefits", course.whatYouWillLearn)
      setValue("courseCategory", course.category)
      setValue("courseRequirements", course.instructions)
      setValue("courseImage", course.thumbnail)
    }
    getCategories()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isFormUpdated = () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !==
        course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail
    ) {
      return true
    }
    return false
  }

  //   handle next button click
  const onSubmit = async (data) => {
    // console.log(data)

    if (editCourse) {
      // const currentValues = getValues()
      // console.log("changes after editing form values:", currentValues)
      // console.log("now course:", course)
      // console.log("Has Form Changed:", isFormUpdated())
      if (isFormUpdated()) {
        const currentValues = getValues()
        const formData = new FormData()
        // console.log(data)
        formData.append("courseId", course._id)
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle)
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc)
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice)
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags))
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits)
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory)
        }
        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          )
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage)
        }
        // console.log("Edit Form data: ", formData)
        setLoading(true)
        const result = await editCourseDetails(formData, token)
        setLoading(false)
        if (result) {
          dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      } else {
        toast.error("No changes made to the form")
      }
      return
    }

    const formData = new FormData()
    formData.append("courseName", data.courseTitle)
    formData.append("courseDescription", data.courseShortDesc)
    formData.append("price", data.coursePrice)
    formData.append("tag", JSON.stringify(data.courseTags))
    formData.append("whatYouWillLearn", data.courseBenefits)
    formData.append("category", data.courseCategory)
    formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("instructions", JSON.stringify(data.courseRequirements))
    formData.append("thumbnailImage", data.courseImage)
    setLoading(true)
    const result = await addCourseDetails(formData, token)
    if (result) {
      dispatch(setStep(2))
      dispatch(setCourse(result))
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">
          Course Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course title is required
          </span>
        )}
      </div>
      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
          Course Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Description is required
          </span>
        )}
      </div>
      {/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Course Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Price is required
          </span>
        )}
      </div>
      {/* Course Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          defaultValue=""
          id="courseCategory"
          className="form-style w-full"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            courseCategories?.map((category, indx) => (
              <option key={indx} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
        )}
      </div>
      {/* Course Tags */}
      <CourseTagInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />
      {/* Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />
      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the course is required
          </span>
        )}
      </div>
      {/* Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />
      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Wihout Saving
          </button>
        )}
        <IconBtn
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  )
}



















// my code



// import React, { useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { useDispatch, useSelector } from 'react-redux';
// import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '../../../../../services/operations/courseDetailsAPI';
// import { HiOutlineCurrencyRupee } from 'react-icons/hi';
// import RequirementField from '../CourseInformation/RequirementField';
// import IconBtn from '../../../../common/IconBtn';
// import toast from 'react-hot-toast';
// import Upload from "./Upload"
// import CourseTagInput from './CourseTagInput';


// const CourseInformationForm = () => {

//     const {
//         register,
//         handleSubmit,
//         setValue,
//         getValues,
//         formState:{errors}
//     } = useForm();

//     const dispatch = useDispatch();
//     const {course,editCourse,setCourse,setStep} = useSelector((state)=>state.course);
//     const [loading , setLoading] = useState(false);
//     const [courseCategories, setCourseCategories] = useState([]);
//     const {token} = useSelector((state)=>state.auth);


//     useEffect(( ()=>{
//         const getCategories = async () => {
//             setLoading(true);
//             const categories  = await fetchCourseCategories();
//             if(categories.length>0){
//                 setCourseCategories(categories);
//                 console.log("Course Categories.........",courseCategories)
//             }             
//             setLoading(false);
//         }

//         if(editCourse){
//             setValue("courseTitle",course.courseName);
//             setValue("courseShortDesc",course.courseDescription);
//             setValue("coursePrice",course.price);
//             setValue("courseTags",course.tags);
//             setValue("courseBenefits",course.whatWillYouLearn);
//             setValue("courseRequirements",course.instructions);
//             setValue("courseImage",course.thumbnail);
//         }

//         getCategories();
//     }),[])

//     const isFormUpdated=()=>{
//         const currentValues = getValues();
//         if( currentValues.courseTitle !== course.courseName ||
//             currentValues.courseShortDesc !== course.courseDescription ||
//             currentValues.coursePrice !== course.price ||
//             currentValues.courseTags.toString() !== course.tags.toString() ||
//             currentValues.courseBenefits !== course.whatWillYouLearn ||
//             currentValues.courseCategory._id !== course.category._id ||
//             currentValues.courseImage !== course.thumbnail ||
//             currentValues.courseRequirements.toString() !== course.instructions.toString()          
//             )
//         {
//             return true;
//         }
//         else 
//             return false;
//     }

//     //handle next button click
//     const onSubmit = async (data) => {
//         if(editCourse){
//             if(isFormUpdated()){
//                 const currentValues = getValues();
//             const formData = new FormData();
//             formData.append("courseId",course._id)

//             if(currentValues.courseTitle !== course.courseName){
//                 formData.append("courseName", data.courseTitle);
//             }
//             if(currentValues.courseShortDesc !== course.courseDescription){
//                 formData.append("courseDescription", data.courseShortDesc);
//             }
//             if(currentValues.coursePrice !== course.price){
//                 formData.append("price", data.coursePrice);
//             }
//             if(currentValues.courseBenefits !== course.whatYouWillLearn){
//                 formData.append("whatYouWillLearn", data.courseBenefits);
//             }
//             if(currentValues.courseCategory._id !== course.category._id){
//                 formData.append("category", data.courseCategory);
//             }
//             if(currentValues.courseRequirements.toString() !== course.instructions.toString()){
//                 formData.append("instructions", JSON.stringify(data.courseRequirements));
//             }
//             // if(currentValues.courseTitle !== course.courseName){
//             //     formData.append("courseName", data.courseTitle);
//             // }
//             // if(currentValues.courseTitle !== course.courseName){
//             //     formData.append("courseName", data.courseTitle);
//             // }
//             setLoading(true);
//             const result = await editCourseDetails(formData, token);
//             setLoading(false)
//             if(result){
//                 setStep(2);
//                 dispatch(setCourse(result));
//             }
//             }
//             else{
//                 toast.error("No changes made to the form")
//             } 
//         return;
//         }

//         //create a new course
//         const formData = new FormData();
//         //
//         formData.append("courseName", data.courseTitle);
//         formData.append("courseDescription", data.courseShortDesc);
//         formData.append("price", data.coursePrice);
//         formData.append("whatYouWillLearn", data.courseBenefits);
//         formData.append("category", data.courseCategory);
//         formData.append("instructions", JSON.stringify(data.courseRequirements));
//         formData.append("tag",JSON.stringify(data.courseTags))
//         formData.append("thumbnailImage",data.courseImage)

//         // formData.append("status",COURSE_STATUS.DRAFT)
        
//         setLoading(true);

//         const result = await addCourseDetails(formData, token);
//         if(result){
//             setStep(2);
//             dispatch(setCourse(result))
//         }

//         setLoading(false);
        
//     }
    


//   return (
//     <form
//     onSubmit={handleSubmit(onSubmit)}
//     className='rounded-md border-r-richblue-700 bg-richblack-800 p-6 space-y-8'
//     >
//         <div className='flex flex-col'> 
//             {/* Course Title  */}
//             <label htmlFor='courseTitle'>Course Title <sup className='text-pink-200'>*</sup></label>
//             <input
//                 id='courseTitle'
//                 name='courseTitle'
//                 placeholder='Enter Course Title'
//                 {...register("courseTitle",{required:true})}
//                 className='w-full bg-richblack-600 rounded-md  p-4'
//             />
//             {
//                 errors.courseTitle && (
//                     <span>Course Title is Required !</span>
//                 )
//             }
//         </div>

//         {/* Course Description  */}
//         <div className='flex flex-col'>
//             <label htmlFor='courseShortDesc'>Course Description <sup>*</sup></label>
//             <textarea
//                 id='courseShortDesc'
//                 name='courseShortDesc'
//                 placeholder='Enter Course Description in short'
//                 className='bg-richblack-600 min-h-[140px] rounded-md w-full p-4'
//                 {...register("courseShortDesc",{required:true})}
//             />
//             {
//                 errors.courseShortDesc && (<span>Course Desc is required</span>)
//             }
//         </div>


//         {/* Course Price  */}
//         <div className='flex flex-col relative'>
//             <label htmlFor='coursePrice'>Price <sup>*</sup></label>
//             <input
//                 id='coursePrice'
//                 name='coursePrice'
//                 placeholder='Enter Course Price'
//                 className='bg-richblack-600 min-h-[50px] rounded-md w-full p-4 pl-8'
//                 {...register("coursePrice",{
//                     required:true,
//                     valueAsNumber:true,
//                 })}
//             />
//             <HiOutlineCurrencyRupee className='absolute bottom-[25%] ml-2'/>
//             {
//                 errors.coursePrice && (<span>Enter a valid Course Price</span>)
//             }
//         </div>

//         {/* Course Categories dropdown options */}
//         <div>
//             <label htmlFor='courseCategory'>Course Category <sup>*</sup></label>
//             <select 
//             id='courseCategory'
//             defaultValue={""}
//             {...register("courseCategory", { required:true })}
//             className='bg-richblack-600'
//             >
//                 <option value={""} disabled className='bg-richblack-600'>
//                     Choose a Category
//                 </option>

//                 {
                    
//                     !loading && courseCategories.map( (category)=> (
//                         <option key={category?._id} value={category?.name}>
//                             {category?.name}
//                         </option>
//                     ))
//                 }
//             </select>
//         </div>


//         {/* //create a component for handling tags input */}
//         <CourseTagInput
//           label = "Tags"
//           name = "courseTags"
//           placeholder = "Insert tags and press Enter Key to create  multiple Tags"
//           register = {register}
//           setValue = {setValue}
//           getValues = {getValues}
//           errors = {errors}
//         />

//         {/* Create a component for uploading and showing preview of media file */}
//         <Upload
//         label = "Course Thumbnail"
//         name = "courseImage"
//         register = {register}
//         errors={errors}
//         setValue={setValue}
//         editData = {editCourse ? course?.thumbnail : null}
//         />


//         {/* Benefits of the course */}
//         <div>
//             <label>Benefit of the course<sup>*</sup></label>
//             <textarea
//                 id='courseBenefits'
//                 name='courseBenefits'
//                 placeholder='Enter Course Description in short'
//                 className='bg-richblack-600 min-h-[100px] rounded-md w-full p-4'
//                 {...register("courseBenefits",{required:true})}
//             />
//             {
//                 errors.courseBenefits && (<span>Atleast 1 Course Benefit is required</span>)
//             }
//         </div>

//         <RequirementField
//             name = "courseRequirements"
//             label ="Requirements / Instructions"
//             register={register}
//             errors={errors}
//             setValue={setValue}
//             getValues={getValues}
//         />


//         <div>
//             {
//                 editCourse && (
//                     <button
//                     onClick={()=> dispatch(setStep(2))}
//                     className='flex items-center gap-x-2 bg-richblack-300 text-white'
//                     >
//                         Continue without Saving
//                     </button>
//                 )
//             }
//             <IconBtn
//             text={!editCourse ? "Next" : "Save Changes"}
//             onClick={()=> dispatch(setStep(2))}
//             />
//         </div>
 




//     </form>
//   )
// }

// export default CourseInformationForm