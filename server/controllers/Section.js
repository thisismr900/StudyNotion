const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");
// CREATE a new section
exports.createSection = async (req, res) => {
	try {
		// Extract the required properties from the request body
		const { sectionName, courseId } = req.body;

		// Validate the input
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}

		// Create a new section with the given name
		const newSection = await Section.create({ sectionName });

		// Add the new section to the course's content array
		const updatedCourse = await Course.findByIdAndUpdate(
			courseId,
			{
				$push: {
					courseContent: newSection._id,
				},
			},
			{ new: true }
		)
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedCourse,
		});
	} catch (error) {
		// Handle errors
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

// UPDATE a section
exports.updateSection = async (req, res) => {
	try {
		const { sectionName, sectionId, courseId } = req.body;
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);

		const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection"
			},
		})
		.exec();


		res.status(200).json({
			success: true,
			message: section,
			data: course
		});
	} catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",

		});
	}
};

// DELETE a section
exports.deleteSection = async (req, res) => {
	try {
		//HW -> req.params -> test
		var { sectionId, courseId } = req.body;

		sectionId = new mongoose.Types.ObjectId(sectionId);
		courseId = new mongoose.Types.ObjectId(courseId);

		console.log("sectionID to be deleted: ",sectionId);
		console.log("sectionID belong to courseID: ",courseId);
		// Update deleted section in Course schema ko bhi update karo
		await Course.findByIdAndUpdate(
			{_id:courseId},
			{ $pull: { courseContent : sectionId }},
			)
		const sectionToBeDeleted = await Section.findById(sectionId);
		if(!sectionToBeDeleted){
			return res.status(400).json({
				success: false,
				message: "Section To Be deleted not found",
			})
		}
		console.log("sectionToBeDeleted: ",sectionToBeDeleted);
		//delete the subsections under the sectionToBeDeleted
		await SubSection.deleteMany({ _id: { $in: sectionToBeDeleted.subSection } });
		//Now delete this section
		await Section.findByIdAndDelete({_id:sectionId});
		
		const updatedCourse = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection",
			}
		}).exec();
		
		console.log("Updated Course: ",updatedCourse);
		res.status(200).json({
			success: true,
			message: "Section deleted",
			data: updatedCourse,
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
