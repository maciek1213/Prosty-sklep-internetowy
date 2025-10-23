import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  setOrderValue: (orderValue: number) => void;
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  quantity: number;
}

const CartPage = ({ setOrderValue }: Props) => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState<Product[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:3000/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sortedProducts = response.data.sort((a: Product, b: Product) =>
        a.title.localeCompare(b.title)
      );
      setCartData(sortedProducts);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const calculateOrder = () => {
    const total = cartData.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    setTotalAmount(Number(total.toFixed(2)));
  };

  const handleRemove = async (id: number) => {
    try {
      await axios.delete("http://localhost:3000/cart/remove", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { itemId: id },
      });
      fetchCart();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await axios.post(
        "http://localhost:3000/cart",
        { item: product },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCart();
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const handleDecreaseQuantity = async (id: number) => {
    try {
      await axios.delete("http://localhost:3000/cart/reduce", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { itemId: id },
      });
      fetchCart();
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  const handleOrder = () => {
    setOrderValue(totalAmount);
    navigate("/order");
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [token]);

  useEffect(() => {
    calculateOrder();
  }, [cartData]);

  return (
    <div className="container">
      <nav
        className="navbar navbar-expand-lg bg-body-tertiary"
        data-bs-theme="light"
      >
        <a className="navbar-brand" href="/">
          <h1 className="display-5">Your Cart</h1>
        </a>
        <div className="d-flex align-items-center">
          <div className="vr" data-bs-theme="dark" />
          <button
            className="btn "
            onClick={() => navigate("/")}
            style={{
              fontSize: "1.5rem",
              border: "none",
              background: "transparent",
            }}
          >
            X
          </button>
        </div>
      </nav>

      <div className="row">
        {cartData.map((product) => (
          <div className="col-md-12 mb-3" key={product.id}>
            <div className="card d-flex flex-row align-items-center p-2">
              <img
                src={product.image}
                className="card-img-left"
                alt={product.title}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
              <div className="card-body d-flex flex-column flex-grow-1">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">${product.price}</p>
                <div className="d-flex align-items-center">
                  <p className="card-text mb-0">Quantity: {product.quantity}</p>
                  <button
                    className="btn btn-success btn-sm ms-2"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.quantity === 20}
                  >
                    +
                  </button>
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => handleDecreaseQuantity(product.id)}
                    disabled={product.quantity === 1}
                  >
                    -
                  </button>
                </div>
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleRemove(product.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between mt-4">
        <h3>Total: ${totalAmount}</h3>
        <button className="btn btn-primary" onClick={handleOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CartPage;
