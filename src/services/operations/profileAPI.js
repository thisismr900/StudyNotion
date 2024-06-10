import toast from "react-hot-toast";
import { profileEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import {setLoading,setUser} from "../../slices/profileSlice"
import {logout} from "./authAPI"

const { 
    GET_USER_DETAILS_API, 
    GET_USER_ENROLLED_COURSES_API,
    GET_INSTRUCTOR_DATA_API,
} = profileEndpoints

export function getUserDetails(token, navigate){
    return async (dispatch) => {
        const toastId = toast.loading("Loading");
        dispatch(setLoading(true))
        
        try{
            const response = await apiConnector("GET",GET_USER_DETAILS_API,null,{
                Authorization:`Bearer ${token}`,
            })
            console.log("GET_USER_DETAILS_API_RESPONSE.........",response)

            if(!response?.data?.success){
                throw new Error(response.data.message)
            }
            const userImage = response.data.data.image ?
            response?.data?.data?.image
            : `https://api.dicebear.com/5.x/initials/svg?seed=${response?.data?.data?.firstName} ${response?.data?.data?.lastName}`

            dispatch(setUser({...response.data.data, image: userImage}))

        }catch(error){
            dispatch(logout(navigate))
            console.log("GET_USER_DETAILS_API_ERROR......",error)
            toast.error("Could Nod Get User Details")
        }
        toast.dismiss(toastId) 
        dispatch(setLoading(false))
    }
}

export async function getUserEnrolledCourses(token){
    const toastId = toast.loading("LoadingToastID...")
    let result = []

    try{
        const response = await apiConnector(
            "GET",
            GET_USER_ENROLLED_COURSES_API,
            null,
            {
                Authorization: `Bearer ${token}`,
            },
            null
        )
        console.log("GET_USER_ENROLLED_COURSES_API  API RESPONSE.........", response)

        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.dismiss(toastId)
        return response.data;
    }
    catch(error){
        console.log("Error in fetching enrolled courses", error);
        toast.error("Could not fetch Enrolled Courses")
    }
    
}

export async function getInstructorData(token){
    const toastId = toast.loading("Loading...")
    let result = []
    try{
        console.log("api connector call now for GET_INSTRUCTOR_DATA_API")
        const response = await apiConnector("GET",GET_INSTRUCTOR_DATA_API,null,{
            Authorization: `Bearer ${token}`
        })

        console.log("GET_INSTRUCTOR_DATA_API_RESPONSE",response);
        result = response?.data?.courseDataWithStats
    }
    catch(error){
        console.error("GET_INSTRUCTOR_API_ERROR",error)
        toast.error("Could not get instructor data")
    }
    toast.dismiss(toastId)
    return result
}