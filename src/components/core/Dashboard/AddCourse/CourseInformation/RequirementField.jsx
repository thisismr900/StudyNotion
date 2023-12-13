import React, { useState } from 'react'
import { useEffect } from 'react';

const RequirementField = ({name,label,register,errors,setValue, getValues}) => {
    const [requirement,setRequirement] = useState("");
    const [requirementList,setRequirementList] = useState([]);

    const handleAddRequirement = () => {
        if(requirement){
            setRequirementList([...requirementList,requirement])
            setRequirement("")
        }
    }
    const handleRemoveRequirement = (index) => {
        const updatedRequirementList = [...requirementList]
        updatedRequirementList.splice(index,1);
        setRequirementList(updatedRequirementList)
    }

    useEffect(()=>{
        register(name,{
            required:true,
            validate: (value) => value.length>0
        })
    },[])

    useEffect(()=>{
        setValue(name,requirementList)
    },[requirementList])

  return (
    <div>
        <label htmlFor={name}>{label}<sup>*</sup></label>
        <div>
            <input
            type='text'
            id={name}
            value={requirement}
            placeholder='Enter Requirements '
            className='bg-richblack-600 p-4 rounded-md w-full'
            onChange={(e)=> setRequirement(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleAddRequirement();
                }
            }}
            />

            <button 
            type='button'
            onClick={handleAddRequirement}
            className='font-semibold text-yellow-50'
            >
                Add +
            </button>  

            {/*Show all added requirements */}
            <div>
            {
                requirementList.map((requirement,index) => (
                    <div className='flex flex-row gap-3' key={index}>
                        <p>{requirement}</p>
                        <button
                        type='button'
                        onClick={()=>handleRemoveRequirement(index)}
                        className='text-richblack-400 text-xs'
                        >
                            Remove
                        </button>
                    </div>
                ))
            }
            </div>


        </div>

    </div>
  )
}

export default RequirementField