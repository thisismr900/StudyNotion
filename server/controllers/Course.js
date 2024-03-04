const Course = require("../models/Course");
const Category = require("../models/Category");
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
// Function to create a new course
exports.createCourse = async (req, res) => {
	try {
		// Get user ID from request object
		const userId = req.user.id;

		// Get all required fields from request body
		let {
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag,
			category,
			status,
			instructions,
		} = req.body;

		 //Get thumbnail image from request files
		 console.log('getting thumbnail from req.files')
		const thumbnail = req.files.thumbnailImage;


		// Check if any of the required fields are missing
		if (
			!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag ||
			!thumbnail ||
			!category
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are Mandatory",
			});
		}
		if (!status || status === undefined) {
			status = "Draft";
		}
		// Check if the user is an instructor
		const instructorDetails = await User.findById(userId, {
			accountType: "Instructor",
		});

		if (!instructorDetails) {
			return res.status(404).json({
				success: false,
				message: "Instructor Details Not Found",
			});
		}

		// Check if the tag given is valid
		const categoryDetails = await Category.findById(category);
		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category Details Not Found",
			});
		}
		// Upload the Thumbnail to Cloudinary
		const thumbnailImage = await uploadImageToCloudinary(
			thumbnail,
			process.env.FOLDER_NAME
		);
		console.log(thumbnailImage);
		 //Create a new course with the given details
		const newCourse = await Course.create({
			courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillLearn: whatYouWillLearn,
			price,
			tag: tag,
			category: categoryDetails._id,
			thumbnail: thumbnailImage.secure_url,
			status: status,
			instructions: instructions,
		});

		// Add the new course to the User Schema of the Instructor
		await User.findByIdAndUpdate(
			{
				_id: instructorDetails._id,
			},
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		);
		// Add the new course to the Categories
		await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		);
		// Return the new course and a success message
		res.status(200).json({
			success: true,
			data: newCourse,
			message: "Course Created Successfully",
		});
	} catch (error) {
		// Handle any errors that occur during the creation of the course
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to create course",
			error: error.message,
		});
	}
};

//get all courses
exports.getAllCourses = async (req, res) => {
	try {
		const allCourses = await Course.find(
			{},
			{
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnroled: true,
			}
		)
			.populate("instructor")
			.exec();
		return res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
	}
};

//getCourseDetails
exports.getCourseDetails = async (req, res) => {
    try {
            //get id
            const {courseId} = req.body;
            //find course details
            const courseDetails = await Course.find(
                                        {_id:courseId})
                                        .populate(
                                            {
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails",
                                                },
                                            }
                                        )
                                        .populate("category")
                                        //.populate("ratingAndreviews")
                                        .populate({
                                            path:"courseContent",
                                            populate:{
                                                path:"subSection",
                                            },
                                        })
                                        .exec();

                //validation
                if(!courseDetails) {
                    return res.status(400).json({
                        success:false,
                        message:`Could not find the course with ${courseId}`,
                    });
                }
                //return response
                return res.status(200).json({
                    success:true,
                    message:"Course Details fetched successfully",
                    data:courseDetails,
                })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

//edit Course
exports.editCourse = async (req,res) => {
	try{
		const {courseId} = req.body;
		console.log("At EditCourse api, Req.body: ",req.body);
		const updates = req.body;
		const course = await Course.findById(courseId)
		if(!course){
			return res.status(404).json({error:"Course not found!"})
		}
		//if thumbnail is passed in request to be editted
		if(req.files){
			console.log("Thumbnail Update")
			const thumbnail = req.files.thumbnailImage
			const thumbnailImage = await uploadImageToCloudinary(
				thumbnail,
				process.env.FOLDER_NAME
			)
			course.thumbnail = thumbnailImage.secure_url;
		}

		for(const key in updates){
			if(updates.hasOwnProperty(key)){
				// Convert the tag and instructions from stringified Array to Array
				if (key === "tag" || key === "instructions") 
					course[key] = JSON.parse(updates[key])
				else 
					course[key] = updates[key]
			}
		}
		await course.save();

		const updatedCourse = await Course.findOne({_id: courseId,})
		.populate({
			path:"instructor",
			populate:{
				path:"additionalDetails",
			}
		})
		.populate("category")
		.populate("ratingAndReviews")
		.populate({
			path: "courseContent",
			populate: {
				path:"subSection",	
			}
		})
		.exec();
		
		return res.json({
			success: true,
			message: "COurse updated successfully",
			data: updatedCourse,
		})
	}
	catch(error){
		console.log(error)
		return res.status(500).json({
			success: false,
			message: `Internal server error`,
			error: error.message,
		})
	}
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
	try {
	  // Get the instructor ID from the authenticated user
	  const instructorId = req.user.id

	  // Find all courses belonging to the instructor
	  const instructorCourses = await Course.find({
		instructor: instructorId,
	  }).sort({ createdAt: -1 })
  
	  // Return the instructor's courses
	  res.status(200).json({
		success: true,
		data: instructorCourses,
	  })
	} catch (error) {
	  console.error(error)
	  res.status(500).json({
		success: false,
		message: "Failed to retrieve instructor courses",
		error: error.message,
	  })
	}
  }


//delete course
exports.deleteCourse = async (req,res) => {
	try{
		const {courseId} = req.body

		const course = await Course.findById(courseId);
		if(!course){
			return res.status(404).json({message: `Course not found`})
		}

		//before deleting course: 
		//1.Unenroll students from course
		const studentsEnrolled = course.studentsEnrolled
		for(const studId of studentsEnrolled){
			await User.findByIdAndUpdate(studId,{
				$pull: {courses: courseId}
			})
		}
		
		//2. Delete subSections then section of this course 
		const courseSections = course.courseContent;
		for(const secId of courseSections){
			const section = Section.findById(secId);
			//delete SubSections under this section
			if(section){
				const subSections = section.subSection
				if(subSections){
					for(const subSecId of subSections){
						await SubSection.findByIdAndDelete(subSecId)
					}
				}
			}
			//delete section
			await Section.findByIdAndDelete(secId);
		}

		//delete course
		await Course.findByIdAndDelete(courseId);

		return res.status(200).json({
			success:true,
			message: "Course Deleted Successfully from dB"
		})
	}
	catch(error){
		console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
	}
}

exports.getFullCourseDetails = async (req,res) => {
	try{
		//strat from here!!!
	}
	catch(error){
		return res.status(500).json({
			success:false,
			message: error.message,
		})
	}
}