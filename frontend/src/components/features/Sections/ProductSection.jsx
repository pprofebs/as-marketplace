import ProductCard from "../Cards/productCard";


const ProductSection = () => {
    return (
    <section className="py-16">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProductCard name={"VFC m4"} description={"This is a nice, used gun"} price={99} />
            <ProductCard name={"M4"} description={"This is a nice, used gun"} price={99} />
            <ProductCard name={"M4"} description={"This is a nice, used gun"} price={99} />
        </div>
    </section>
    )
}
export default ProductSection;