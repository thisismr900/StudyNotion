import React from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { useEffect } from 'react';
import { useState } from 'react';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';

const Catalog = () => {

    const {catalogName} = useParams();
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    //fetch all categories
    useEffect(()=>{
        const getCategories = async()=>{
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            if(!res)
                throw new Error("Get category api error")
            // console.log("fetched categories:",res)
            const category_id = res?.data?.data?.filter((ct)=>ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            console.log("category_id:",category_id)
            setCategoryId(category_id);
        }
        getCategories();
    },[catalogName])
    
    useEffect(()=>{
        const getCategoryDetails = async()=>{
            try{
                // console.log("Now fetching catalog page data using category id")
                // console.log("sending the category ID:",categoryId)
                const res = await getCatalogPageData({categoryId});
                console.log("this is res for getCatalogPageData(catId):",res);
                if(!res)
                    throw new Error("Get categoryDetails api error")
                setCatalogPageData(res);
            }
            catch(error){
                console.log(error)
            }
        }
        if(categoryId){
            getCategoryDetails();
        }

    },[categoryId])



  return (
    <div className='text-white'>
        <div>
            <p>{`Home / Catalog / `}
            <span>
                {catalogPageData?.data?.selectedCategory?.name}
            </span>
            </p>
            <p>{catalogPageData?.data?.selectedCategory?.name}</p>
            <p>{catalogPageData?.data?.selectedCategory?.description}</p>
        </div>

        <div>
            {/* Section 1 */}
            <div>
                <div className='flex gap-x-3'>
                    <p>Most Popular</p>
                    <p>New</p>
                </div>
                {/* Do here conditional rending for mostpopular or new courses */}
                <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses}/>
            </div>

            {/* Section 2 */}
            <div>
                <p>{`Top Courses in ${catalogPageData?.data?.selectedCategory?.name}`}</p>
                {/* {console.log("Top courses:")} */}
                <div>
                    {/* <CourseSlider  Courses = {catalogPageData?.data?.differentCategory?.courses}/> */}
                </div>
            </div>

            {/* Section 3 : Frequently Bought */}
            <div>
                <div>Frequently Bought</div>
                <div className='py-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-2'>
                        {
                            catalogPageData?.data?.mostSellingCourses?.slice(0,4)
                            .map((course,index)=>(
                                <Course_Card course={course} key={index} Height={"h-[400px]"}/>
                            ))
                        }

                    </div>
                </div>
            </div>

        </div>

        <Footer/>
    </div>

  )
}

export default Catalog