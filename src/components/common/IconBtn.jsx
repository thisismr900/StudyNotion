import React from 'react'

const IconBtn = ({
    text,
    onclick,
    children,
    disabled=false,
    outline=false,
    customClasses,
    type,
}) => {
  return (
    <button 
    disabled={disabled}
    onClick={onclick}
    type={type}>
        {
            children ? (
                <div className='flex gap-2 bg-yellow-50 text-center rounded-md p-2'>
                    <span>
                        {text}
                    </span>
                    {children}
                </div>
            ) : (text)
        }
    </button>
  )
}

export default IconBtn
