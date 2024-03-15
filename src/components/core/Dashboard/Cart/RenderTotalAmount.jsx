import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn'
import { buyCourse } from '../../../../services/operations/studentFeaturesApi'
import { useNavigate } from 'react-router-dom'

const RenderTotalAmount = () => {

    const {total,cart}=useSelector((state)=>state.cart)
    const navigate = useNavigate();
    const {token} = useSelector((state)=>state.auth)
    const dispatch = useDispatch();

    const handleBuyCourse = () => {

        const courses = cart.map((course)=>course._id)
        console.log("Buying these courses:",courses)

        //go to payment integration Gateway
        buyCourse(token, courses, navigate, dispatch)
    }


    return (
    <div>
        <p>Total:</p>
        <p>Rs {total}</p>

        <IconBtn
            text={"Buy Now"}
            onclick={handleBuyCourse}
            customClasses={"w-full justify-center"}
        />
    </div>
  )
}

export default RenderTotalAmount