import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {RxDropdownMenu} from 'react-icons/rx'

const NestedView = () => {

    const {course} = useSelector((state)=>state.course);
    // const {token } = useSelector((state)=>state.auth);
    const dispatch = useDispatch();

    //modes of subsection : add , view , edit
    // const [addSubSection, setAddSubSection] = useState(null);
    // const [viewSubSection, setViewSubSection] = useState(null);
    // const [editSubSection, setEditSubSection] = useState(null);

    // const [confirmationModal, setConfirmationModal] = useState(null);

  return (
    <>
    <div className='bg-richblack-700 rounded-lg p-8'>
    
    {course.courseContent?.map((section)=>(
        <details key={section._id} open>

            <summary className='flex items-center justify-between gap-x-3 border-b-2'>
                <div className='bg-yellow-50'>
                    <RxDropdownMenu className='text-white'/>
                    <p>{section.sectionName}</p>
                </div>
            </summary>

        </details>
    ))}

    </div>
    </>
  )
}

export default NestedView