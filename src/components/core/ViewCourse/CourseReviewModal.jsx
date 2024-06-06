import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import ReactStars from 'react-stars';
import IconBtn from '../../common/IconBtn';
import { createRating } from '../../../services/operations/courseDetailsAPI';

const CourseReviewModal = ({setReviewModal}) => {

    const {user} = useSelector((state)=>state.profile);
    const {token} = useSelector((state)=>state.auth);
    const {courseEntireData} = useSelector((state)=>state.viewCourse);
    const {
      register,
      handleSubmit,
      setValue,
      formState:{errors},
    } = useForm();

    useEffect(()=>{
      setValue("courseExperience","");
      setValue("courseRating",0);
    },[])

    const onSubmit  = async () => {
      // make rating entry in db
      await createRating(
        {
          courseId : courseEntireData._id,
          rating : data.courseRating,
          review: data.courseExperience,
        },token
      )
      // close modal
      setReviewModal(false);
    }
    const ratingChange = (newRating)=>{
      setValue("courseRating",newRating);
    }

  return (
    <div>
        <div>
          {/* Modal Header */}
          <div>
            <p>Add Review</p>
            <button onClick={setReviewModal(false)}> X </button>
          </div>
          {/* Modal Body */}
          <div>
            <div>
              <img 
                src={`user?.image`}
                alt='userImage'
                className='aspect-square w-[50px] rounded-full object-cover'
              />
              <div>
                <p>{user?.firstName} {user?.lastName} </p>
                <p>Posting Publicly</p>
              </div>
            </div>


            <form
            onSubmit={handleSubmit(onSubmit)}
            className='mt-6 flex flex-col items-center'
            >
              <ReactStars
                count={5}
                onChange={ratingChange}
                size={24}
                activeColor="#ffd900"
              />
              <div>
                <label htmlFor='courseExperience'> 
                  Add your Experience
                </label>
                <textarea id="courseExperience"
                placeholder='Add your Experience here'
                {...register("courseExperience",{required:true})}
                className='form-style min-h-[130px] w-full'
                />
                {errors.courseExperience && (
                  <span>Please Add your Experience</span>
                )}
              </div>
              {/* Cancel - Save button */}
              <div>
                <button
                onClick={()=>setReviewModal(false)}
                >Cancel
                </button>
                <IconBtn text={"Save"}/>
              </div>
            </form>
          </div>
        </div>
    </div>
  )
}

export default CourseReviewModal