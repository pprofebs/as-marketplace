

const HeroSection = ({ title, secondaryTitle}) =>{
    return (
        <section className="py-16 bg-gray-900 text-white">
            <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{ title }</h1>
            <p className="text-lg md:text-xl mb-8">{ secondaryTitle }</p>
            <a href="#" className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-red-700">Explore Now</a>
            </div>
        </section>
    )
}
export default HeroSection;