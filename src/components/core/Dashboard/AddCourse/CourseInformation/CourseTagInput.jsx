import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { MdClose } from "react-icons/md"
import { useSelector } from 'react-redux'


const CourseTagInput = (
    // props
    {
        label,
        name,
        placeholder,
        register,
        setValue,
        errors
    }
) => {

    const { editCourse, course } = useSelector((state) => state.course)

    const [tags,setTags] = useState([]); //tag array of the course

    const handleDeleteTag = (tagIndex) => {
        const updatedTags = tags.filter((_,currIdx)=>currIdx!==tagIndex)
        setTags(updatedTags)
    }

    const handleKeyDown = (event) => {
        if(event.key === 'Enter' || event.key === ','){
            event.preventDefault();
            let inputTag=event.target.value;
            inputTag.trim();//remove trailing/leading spaces
            //only add new tags
            if(inputTag && !tags.includes(inputTag)){
                if (inputTag.length > 30) {
                    inputTag = inputTag.substring(0, 30) + "...";
                }
                const updatedTags = [...tags, inputTag];
                setTags(updatedTags);
                event.target.value = "";
            }
        }
    }


    useEffect(() => {
      if(editCourse){
        // console.log(course);
        setTags(course?.tag)
      }
      register(name,{
        required:true , 
        validate: (value)=> value.length>0 })
    }, [])
    

    //form state must be updated with updated tags
    useEffect(() => {
        setValue(name, tags)
      }, [tags])

 // Render the component
  return (
    <div className="flex flex-col space-y-2">
    
      {/* Render-the-label-for-the-input */}
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>

      {/* Render-the-tags-and-input */}
      <div className="flex w-full flex-wrap gap-y-2">
        {/* Map-over-the-tags-array-and-render-each-tag */}
        {tags.map((tag, index) => (
          <div
            key={index}
            className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5"
          >
            {/* Render the tag value */}
            {tag}
            {/* Render the button to delete the tag */}
            <button
              type="button"
              className="ml-2 focus:outline-none"
              onClick={() => handleDeleteTag(index)}
            >
              <MdClose className="text-sm" />
            </button>
          </div>
        ))}
        {/* Render the input for adding new tag */}
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="form-style w-full"
        />
      </div>
      {/* Render an error message if the input is required and not filled */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          Atleast 1 {label} is required
        </span>
      )}
    </div>
  )
}

export default CourseTagInput