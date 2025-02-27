import { IProduct } from "@/models/product.model"
import ProductCard from "./ProductCard"


interface ImageGalleryProps {
    products: IProduct[]
}

export default function ImageGallery({ products }: ImageGalleryProps) {

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {
                products.map((product) => (
                    <ProductCard key={product._id?.toString()} product={product} />
                ))
            }
            {products.length === 0 && (
                <div className="col-span-full text-center py-12">
                    <p className="text-base-content/70">No products found</p>
                </div>
            )}
        </div>
    )
}