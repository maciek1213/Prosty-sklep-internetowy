import { useNavigate } from "react-router-dom";
import { Product } from "./ProductsList";

interface Props {
  product: Product;
  onClose: () => void;
  token: string | null;
}

function ProductModal({ product, onClose, token }: Props) {
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
    <div className="modal show" style={{ display: "block" }} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{product.title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <img
              src={product.image}
              className="img-fluid"
              alt={product.title}
            />
            <p>{product.description}</p>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Price:</strong> {product.price} $
            </p>
            <hr />
            <h5>Comments</h5>
            <div className="comments-section">
              <p>No comments yet.</p>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
