import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
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
            const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
                (data)=>data._id === subSectionId
            )
            const activeSubSectionId = courseSectionData?.[currentSectionIndex]
            ?.subSection?.[currentSubSectionIndex]?._id;//to highlight subsection in UI
            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id)
            setVideoBarActive(activeSubSectionId)
        }
        setActiveFlags();
    },[courseSectionData,courseEntireData,location.pathname])
  
  
    return (
    <>
    <div>
        {/* for buttons and headings */}
        <div>
            {/* for buttons */}
            <div>
                <div onClick={()=>{navigate("/dashboard/enrolled-courses")}}>
                    Back
                </div>
                <IconBtn
                text="Add Review"
                onclick={()=>setReviewModal(true)}
                />
            </div>
            {/* for heading / title */}
            <div>
                <p>{courseEntireData?.courseName}</p>
                <p>{completedLectures.length} / {totalNoOfLectures.length}</p>
            </div>
        </div>

        {/* for sections & subsections */}
        <div>
            {
                courseSectionData.map((section,index)=>{
                    <div
                    onClick={()=>setActiveStatus(section?._id)}
                    key={index}>
                    {/* section */}
                        <div>
                            <div>{section?.sectionName}</div>
                            {/* add icon here & handle rotate logic */}
                        </div>
                    {/* subSections */}
                        <div>
                            {
                                activeStatus === section?._id && (
                                    <div>
                                        {
                                            section.subSection.map((topic,index)=> {
                                                <div
                                                className={`flex gap-5 p-5 ${
                                                    videoBarActive === topic?._id
                                                    ? "bg-yellow-200 text-richblack-900":
                                                    "bg-richblack-900 text-white"
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
                                                    <span>{topic?.title}</span>
                                                </div>
                                            })
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                })
            }
        </div>
    </div>
    </>
  )
}

export default VideoDetailsSideBar