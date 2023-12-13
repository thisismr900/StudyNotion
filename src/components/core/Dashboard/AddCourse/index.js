import RenderSteps from "./RenderSteps";

export default function AddCourse () {
    return (
        <>
        <div className="text-white flex flex-row justify-between ">
            <div className="lg:w-4/5">
                <h1 className="mb-14 text-3xl font-medium text-richblack-5">
                    Add Course
                </h1>
                <div>
                    <RenderSteps/>
                </div>
            </div>
            <div className="sticky top-10 bg-richblack-800 border-richblack-700 rounded-md border-[1px] lg:w-[450px] h-fit p-4 gap-8 ml-2">
                <p className="text-xl mb-8 text-richblack-5">Code Upload Tips</p>
                <ul className="ml-5 list-item list-disc space-y-4 text-sm text-richblack-5 ">
                    <li>Set Course price or make it free for students</li>
                    <li>Recommended Thumbnail size: 1024x576</li>
                    <li>Video Section controls course overview video</li>
                    <li>Make Announcement to notify something important</li>
                    <li>Inside Couse Builder, you create & organise a course</li>
                    <li>Add topics,subtopics in course builder section</li>
                </ul>
            </div>
        </div>
    </>
    )
}