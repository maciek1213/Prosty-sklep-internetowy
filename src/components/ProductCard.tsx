import { useNavigate } from "react-router-dom";
import { Product } from "./ProductsList";

interface Props {
  product: Product;
  onClick: () => void;
  token: string | null;
}

function ProductCard({ product, onClick, token }: Props) {
  const navigate = useNavigate();

  async function handleAddToCart(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ item: product }),
      });

      console.log(JSON.stringify({ item: product }));

      if (!response.ok) {
        throw new Error("Failed to add product to cart");
      }

      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("There was an error adding the product to the cart.");
    }
  }

  return (
    <div
      className="card h-100"
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest("button")) {
          onClick();
        }
      }}
    >
      <img
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
        src={product.image}
        className="card-img-top"
        alt={product.title}
      />
      <div className="card-body">
        <h5 className="card-title">{product.title}</h5>
        <p
          className="card-text product-description"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.description}
        </p>
        <button className="btn btn-primary" onClick={handleAddToCart}>
          Add to cart
        </button>
      </div>
      <div
        className="card-footer"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div>{product.price} $</div>
      </div>
    </div>
  );
}

export default ProductCard;
