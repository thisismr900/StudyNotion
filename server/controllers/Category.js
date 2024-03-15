const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};

exports.showAllCategories = async (req, res) => {
	try {
		const allCategorys = await Category.find(
			{},
			// { name: true, description: true }
		);
		return res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

//categoryPageDetails 

exports.categoryPageDetails = async (req, res) => {
    try {
            //get categoryId
            const {categoryId} = req.body;


            // console.log("PRINTING CATEGORY ID,at apicall for categoryPageDetails: ", categoryId);
            //get courses for specified categoryId
            const selectedCategory = await Category.findById(categoryId)
                                            .populate({
                                                path:"courses",
                                                match:{status:"Published"},
                                                populate:"ratingAndReviews"
                                            })
                                            .exec();
             console.log("COURSE in selected Category", selectedCategory)
            //validation
            if(!selectedCategory) {
                res.status(404).json({
                    success:false,
                    message:'Data Not Found',
                });
            }
            // Handle the case when there are no courses
            if (selectedCategory.courses.length === 0) {
                console.log("No courses found for the selected category.")
                return res.status(404).json({
                    success: false,
                    message: "No courses found for the selected category.",
                })
            }

            //get coursesfor different categories
            const differentCategories = await Category.find({
                                         _id: {$ne: categoryId},
                                         })
                                         .populate("courses")
                                         .exec();
                                     
            console.log("COURSE in different Category",  differentCategories)
            //get top 10 selling courses
            const allCategories = await Category.find()
            .populate({
                path:"courses",
                match:{
                    status:"Published",
                },
                populate:{
                    path:"instructor",
                }
            }).exec();
            
            const allCourses = allCategories.flatMap((category)=> category.courses)
            const mostSellingCourses = allCourses
                .sort((a,b) => b.sold - a.sold)
                .slice(0,10)
            console.log("mostSellingCourses COURSE", mostSellingCourses)




            //return response
            return res.status(200).json({
                success:true,
                data: {
                    selectedCategory,
                    differentCategories,
                    mostSellingCourses,
                },
            });

    }
    catch(error ) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}