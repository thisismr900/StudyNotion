import toast from "react-hot-toast";
import { profileEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";


const { GET_USER_DETAILS_API, GET_USER_ENROLLED_COURSES_API } = profileEndpoints

// exports function getUserDetails(token, navigate){

// }

export async function getUserEnrolledCourses(token){
    const toastId = toast.loading("LoadingToastID...")
    let result = []

    try{
        const response = await apiConnector(
            "GET",
            GET_USER_ENROLLED_COURSES_API,
            null,
            {
                Authorisation: `Bearer ${token}`,
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