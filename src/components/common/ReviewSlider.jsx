import React, { useState } from 'react'
import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { Autoplay,FreeMode,Navigation, Pagination}  from 'swiper/modules'
import ReactStars from 'react-stars'
import { useEffect } from 'react'
import {REVIEWS_DETAILS_API, ratingsEndpoints} from "../../services/apis"
import {apiConnector} from "../../services/apiconnector"
import { FaStar } from 'react-icons/fa'

const ReviewSlider = () => {
    const [reviews,setReviews] = useState([]);
    const truncateWords = 10;

    useEffect(()=>{
        const fetchAllReviews = async()=>{
            
            const {data} = await apiConnector("GET",ratingsEndpoints.REVIEWS_DETAILS_API)
            if(data?.success){
                setReviews(data?.data)
            }
        }
        fetchAllReviews();
        },[])
  
    return (
    <div>
        <div className='text-white mb-10'>
        <Swiper
        slidesPerView={4}
        spaceBetween={25}
        loop = {true}
        freeMode={true}
        autoPlay = {{
            delay:2500,
            disableOnInteraction: false
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className='w-full'
        >
            {
                reviews.map((review,i)=>{
                    return(
                        <SwiperSlide key={i}>
                            <div className='flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25'>
                            <div className='flex items-center gap-4'>
                                <img 
                                src={
                                    review?.user?.image
                                    ? review?.user?.image
                                    : (`https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`)
                                    }
                                alt='userImage'
                                className='h-9 w-9 rounded-full object-cover'
                                />

                                <div className='flex flex-col'>
                                    <h1 className='font-semibold text-richblack-5'>
                                        {`${review?.user?.firstName}`} {`${review?.user?.lastName}`}
                                    </h1>
                                    <h2 className='text-[12px] font-medium text-richblack-500'>
                                        {review?.course?.courseName}
                                    </h2>
                                </div>
                            </div>
                            
                            <p className='font-medium text-richblack-25'>
                                {
                                    (review?.review.split(" ").length >truncateWords || review?.review?.length>25)
                                    ? `${review?.review.split(" ").slice(0,truncateWords).join(" ")}...`
                                    : `${review?.review}`
                                }
                            </p>

                            <div className='flex items-center gap-2'>
                                <h3 className='font-semibold text-yellow-100'>
                                    {review.rating.toFixed(1)}
                                </h3>
                                <ReactStars
                                    count={5}
                                    value={review.rating}
                                    size={20}
                                    edit={false}
                                    activeColor="#ffd700"
                                    emptyIcon={<FaStar/>}
                                    fullIcon={<FaStar/>}
                                />
                            </div>
                            </div>
                        </SwiperSlide>
                    )
                })
            }
        </Swiper>
        </div>
    </div>
    
  )
}

export default ReviewSlider