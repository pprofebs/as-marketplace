import { FaLock, FaThumbsUp, FaUsers } from 'react-icons/fa';


const ReasonCard = ({name, description}) => {
    return (
        <div className="bg-gray-100 shadow-md rounded-lg p-8 flex flex-col items-center">
            <FaLock className="text-5xl text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
            <p className="text-gray-600">Buy and sell with confidence knowing that your transactions are secure.</p>
        </div>
    )
}
export default ReasonCard;