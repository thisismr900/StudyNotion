import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { BsChevronDown } from 'react-icons/bs';
import {IoIosArrowBack} from "react-icons/io"
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';

const VideoDetailsSideBar = ({setReviewModal}) => {
  
    const [activeStatus,setActiveStatus] = useState("");
    const [videoBarActive,setVideoBarActive] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const {sectionId,subSectionId} = useParams();
    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures
    } = useSelector((state)=>state.viewCourse);

    useEffect(()=>{
        const setActiveFlags = () =>{
            if(!courseSectionData.length)
                return;
            const currentSectionIndex = courseSectionData.findIndex(
                (data)=>data._id === sectionId
            )
            // console.log("currentSectionIndex",currentSectionIndex);
            
            const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
                (data)=>data._id === subSectionId
            )
            // console.log("currentSubSectionIndex",currentSubSectionIndex);
            
            const activeSubSectionId = courseSectionData?.[currentSectionIndex]
            ?.subSection?.[currentSubSectionIndex]?._id;//to highlight subsection in UI
            // console.log("activeSubSectionId",activeSubSectionId);
            
            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id)
            setVideoBarActive(activeSubSectionId)
        }
        setActiveFlags();
        // console.log("activeStatus : ",activeStatus)
    },[courseSectionData,courseEntireData,location.pathname])
  
    return (
    <div>

    <div className='flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800'>
        {/* for buttons and headings */}
        <div className='mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25'>
            {/* for buttons */}
            <div className='flex w-full items-center justify-between'>
                <div onClick={()=>{navigate("/dashboard/enrolled-courses")}}
                className='flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90'
                title='Back'>
                    <IoIosArrowBack size={30}/>
                </div>
                <IconBtn
                text="Add Review"
                onclick={()=>setReviewModal(true)}
                customClasses={"ml-auto"}
                />
            </div>
            {/* for heading & title */}
            <div className='flex flex-col'>
                <p>{courseEntireData?.courseName}</p>
                <p className='text-sm font-semibold text-richblack-500'>
                    {completedLectures.length} / {totalNoOfLectures}
                </p>
            </div>
        </div>

        {/* {console.log("courseSectionData:",courseSectionData)} */}
        {/* for sections & subsections */}
        <div className='h-[calc(100vh-5rem)] overflow-y-auto'>
            {
                courseSectionData.map((section,index)=>
                {
                    return <div
                    onClick={()=>setActiveStatus(section?._id)}
                    key={index}>
                    {/* section */}
                        <div className='flex flex-row justify-between bg-richblack-600 px-5 py-4'>
                            <div className='w-[70%] font-semibold text-white'>
                                {section?.sectionName}
                            </div>
                            {/* {console.log("section?.sectionName: ",section?.sectionName)} */}
                            {/* add icon here & handle rotate logic */}
                            <div className='flex items-center gap-3'>
                            <span className={`${
                                activeStatus === section?.sectionName
                                ? "rotate-0"
                                : "rotate-180"
                            } transition-all duration-500`}>
                                <BsChevronDown/>
                            </span>
                            </div>
                        </div>


                    {/* subSections */}
                        <div>
                            {
                            activeStatus === section?._id && (
                            <div className='transition-[height] duration-500 ease-in-out'>
                                {
                                section.subSection.map((topic,index)=> {
                                return <div
                                   className={`flex gap-3 px-5 py-2 
                                   ${ videoBarActive === topic?._id
                                   ? "bg-yellow-200 text-richblack-800 font-semibold":
                                   "hover:bg-richblack-900 "
                                   }`}
                                   key={index}
                                   onClick={()=>{
                                   navigate(`/view-course/${courseEntireData?._id}/section/${section?.id}/sub-section/${topic?.id}`)
                                   setVideoBarActive(topic?.id)
                                   }}
                                >
                                <input
                                   type='checkbox'
                                   checked = {completedLectures.includes(topic?._id)}
                                   onChange={()=>{}}
                                />
                                <span className='text-white'>{topic?.title}</span>
                                </div>
                                })
                                }
                            </div>
                                )
                            }
                        </div>
                    </div>
                }
                )
            }
        </div>
    </div>
    </div>
  )
}

export default VideoDetailsSideBar