import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import RatingStars from '../../common/RatingStars'
import { useEffect } from 'react';
import GetAvgRating from '../../../utils/avgRating'


const Course_Card = ({course, Height}) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  
  useEffect(()=>{
    const count = GetAvgRating(course.ratingAndReviews);
    setAvgReviewCount(count);
  },[course])
  
  return (
    <div>
      <Link to={`/courses/${course._id}`}>
        <div>
          <div>
            <img 
              src={course?.thumbnail}
              alt='Course Thumbnail'
              className={`${Height} w-full rounded-xl object-cover`}  
            />
          </div>
          <div>
            <p>
              {course?.courseName}
              {/* Course Name */}
            </p>
            <p>
              By {course?.instructor?.firstName} {` `} {course?.instructor?.lastName}
            </p>
            <div className='flex gap-x-3'>
              <span>
                {avgReviewCount || 0}
              </span>
              <RatingStars Review_Count={avgReviewCount}/>
              <span>
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p>
              {course?.price}
              {/* price */}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Course_Card