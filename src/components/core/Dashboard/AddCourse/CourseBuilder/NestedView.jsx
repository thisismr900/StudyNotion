import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {RxDropdownMenu} from 'react-icons/rx'
import { MdEdit } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import {BiSolidDownArrow} from "react-icons/bi"
import { AiOutlinePlus } from 'react-icons/ai'
import SubSectionModal from './SubSectionModal'
import ConfirmationModal from '../../../../common/ConfirmationModal'
import { deleteSection, deleteSubSection } from '../../../../../services/operations/courseDetailsAPI'
import { setCourse } from '../../../../../slices/courseSlice'


const NestedView = ({handleChangeEditSectionName}) => {

    const { course } = useSelector( (state)=>state.course );
    const { token } = useSelector( (state)=>state.auth );
    const dispatch = useDispatch();

    //3 flags for current mode of subsection : add , view , edit
    const [addSubSection, setAddSubSection] = useState(null);
    const [viewSubSection, setViewSubSection] = useState(null);
    const [editSubSection, setEditSubSection] = useState(null);

    const [confirmationModal, setConfirmationModal] = useState(null);

    const handleDeleteSection = async (sectionId) => {
    
            const updatedCourse = await deleteSection({
                sectionId,
                courseId: course._id,
                token
            })

            if(updatedCourse){
                dispatch(setCourse(updatedCourse))
            }
            setConfirmationModal(null);
    }
    const handleDeleteSubSection = async (subSectionId, sectionId) => {
        const updatedCourse = await deleteSubSection({
            subSectionId, 
            sectionId, 
            token
        })
        if(updatedCourse){
            //what can be done extra??
            dispatch(setCourse(updatedCourse))
        }
        setConfirmationModal(null);


    }

  return (
    <div>
    <div className='bg-richblack-700 rounded-lg p-6 px-8 text-white'>
    
    {course?.courseContent?.map((section)=>(
        <details key={section._id} open>

            <summary className='flex items-center justify-between gap-x-3 border-b-2'>
                <div className='flex items-center gap-x-3'>
                    <RxDropdownMenu className='text-white'/>
                    <p className='text-white'>{section.sectionName}</p>
                </div>

                <div className='flex items-center gap-x-3'>
                    <button
                    onClick={()=>handleChangeEditSectionName(section._id, section.sectionName)}
                    >
                        <MdEdit/>
                    </button>

                    <button
                    onClick={()=>{
                        setConfirmationModal({
                            text1:"Delete this Section",
                            text2:"All the lectures in this section will be deleted",
                            btn1:"Delete",
                            btn2:"Cancel",
                            btn1Handler:()=>handleDeleteSection(section._id),
                            btn2Handler:()=>setConfirmationModal(null),
                        })
                    }}>
                        <RiDeleteBin6Line/>
                    </button>

                    <span>|</span>
                    <BiSolidDownArrow className='text-xl text-richblack-300'/>
                </div>

            </summary>

            <div>
                {
                    section?.subSection.map((data) => (
                        <div key={data?._id}
                        onClick={()=> setViewSubSection(data)}
                        className='flex items-center justify-between gap-x-3 border-b-2'
                        >
                            <div className='flex items-center gap-x-3'>
                                <RxDropdownMenu className='text-white'/>
                                <p className='text-white'>{data.title}</p>
                            </div>

                            <div
                            className='flex items-center gap-x-3'
                            >
                                <button
                                onClick={() => setEditSubSection({...data,sectionId:section._id})}
                                >
                                    <MdEdit/>
                                </button>
                                <button
                                onClick={() => setConfirmationModal({
                                    text1:"Delete this Sub-Section",
                                    text2:"Selected lecture will be deleted",
                                    btn1:"Delete",
                                    btn2:"Cancel",
                                    btn1Handler:()=>handleDeleteSubSection(data._id,section._id),
                                    btn2Handler:()=>setConfirmationModal(null),
                                })}
                                >
                                    <RiDeleteBin6Line/>
                                </button>
                                

                            </div>

                        </div>
                    ))
                }
                <button
                onClick={()=>setAddSubSection(section._id)}
                className='mt-4 flex items-center gap-x-2 text-yellow-50'
                >
                    <p>Add Lecture</p> 
                    <AiOutlinePlus/>
                </button>
            </div>

            

        </details>
    ))}

    </div>

    {addSubSection ? (<SubSectionModal
        modalData = {addSubSection}
        setModalData = {setAddSubSection}
        add = {true}
    />) : 
    (viewSubSection ? (<SubSectionModal
        modalData = {viewSubSection}
        setModalData = {setViewSubSection}
        view = {true}
        />):
    (editSubSection ? (<SubSectionModal
        modalData = {editSubSection}
        setModalData = {setEditSubSection}
        edit = {true}
        />): (<div></div>)))
    }

    {confirmationModal ? 
    (<ConfirmationModal modalData={confirmationModal}/>)
    :(<div></div>)}

    </div>
  )
}

export default NestedView