

const TestimonialCard = ({name, recommendation}) => {
    return (
        <div className="bg-gray-800 shadow-md rounded-lg p-8">
            <img src={""} alt="Testimonial 1" className="w-full rounded-full mb-4 mx-auto" />
            <p className="text-gray-300 mb-4">"{recommendation}"</p>
            <p className="text-gray-400">- {name}</p>
        </div>
    )
}
export default TestimonialCard;