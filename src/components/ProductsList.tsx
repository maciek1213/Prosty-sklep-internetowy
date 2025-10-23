import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  quantity: number;
}

interface Props {
  searchTerm: string;
  token: string | null;
}

function ProductsList({ searchTerm, token }: Props) {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, [searchTerm]);

  const loadProducts = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      const filteredData = data.filter((product: Product) => {
        return product.title.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setProductsData(filteredData.slice(0, 30));
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="container">
      <div className="row">
        {productsData &&
          productsData.map((product: Product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <ProductCard
                product={product}
                onClick={() => handleProductClick(product)}
                token={token}
              />
            </div>
          ))}
      </div>
      {selectedProduct && (
        <ProductModal
          token={token}
          product={selectedProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default ProductsList;
export type { Product };
