import React from 'react'
import toast from 'react-hot-toast'
import {apiConnector} from '../apiconnector'
import { catalogData } from '../apis';

export const getCatalogPageData = async({categoryId}) => {
    let result = [];
    const toastId = toast.loading("Loading...")
        
    try
    {
        console.log("PRINTING CATEGORYID in getcatalogpagedata,line12",categoryId)
        const response = await apiConnector("POST",catalogData.CATALOGPAGEDATA_API, 
        {categoryId: categoryId});
        console.log("response from apiConnector for catalogPageDetails:",response)
        if(!response?.data?.success)
        throw new Error("Could not fetch category page data")
        result = response?.data;    
    }
    catch(error){
        console.log("CATALOG PAGE DATA API ERROR",error);
        toast.error(error.message)
    } 
    
    toast.dismiss(toastId);
    return result;
}
