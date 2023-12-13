import React from 'react'
import ReactStars from 'react-stars'
import {GiNinjaStar} from "react-icons/gi"
import {RiDeleteBin6Line} from "react-icons/ri"
import { removeFromCart } from '../../../../slices/cartSlice'
import { useSelector } from 'react-redux'
const RenderCartCourses = () => {
  
    const {cart}=useSelector((state)=>state.auth)
  
    return (
    <div>
    {
        cart.map((course,index)=>{
            return(
                <div>
                    <div>
                        <img src={course?.thumbnail} alt='course-thumbnail'/>
                        <div>
                            <p>{course?.courseName}</p>
                            <p>{course?.category?.name}</p>
                            <div>
                                <span>4.8</span>
                                <ReactStars
                                    count = {5}
                                    size = {20}
                                    edit = {false}
                                    activeColor = "#ffd700"
                                    emptyIcon = {<GiNinjaStar/>}
                                    fullIcon = {<GiNinjaStar/>}
                                />

                                <span>{course?.ratingAndReviews?.length} Ratings</span>

                            </div>
                        </div>
                    </div>



                    <div>
                        <button
                        onClick={()=> dispatchEvent(removeFromCart(course._id))}
                        >
                            <RiDeleteBin6Line/>
                            <span>Remove</span>
                        </button>
                        <p> Rs {course?.price}</p>
                    </div>
                </div>
            )
        })
    }
    </div>
  )
}

export default RenderCartCourses