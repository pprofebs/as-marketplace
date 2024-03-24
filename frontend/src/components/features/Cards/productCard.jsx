import heroImage from '../../../assets/images/gun-ar.jpg'

const ProductCard = ({name, description, price}) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-8">
            <img src={heroImage} alt="Product 1" className="w-full rounded-lg mb-4" />
            <h2 className="text-lg font-semibold mb-2">{name}</h2>
            <p className="text-gray-600 mb-4">{description}</p>
            <p className="text-gray-800 font-bold">${price}</p>
        </div>
    )
}
export default ProductCard;