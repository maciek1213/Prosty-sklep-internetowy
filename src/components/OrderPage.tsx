import { useState } from "react";

interface Props {
  orderValue: number;
}

function OrderPage({ orderValue }: Props) {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Order placed successfully!\n\nName: ${firstName} ${lastName}\nPhone: ${
        phone || "Not provided"
      }\nAddress: ${addressLine1}, ${addressLine2}\nAdditional Notes: ${
        additionalNotes || "None"
      }\nOrder Total: $${orderValue.toFixed(2)}`
    );
  };

  return (
    <div className="container">
      <h2>Place Your Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="Enter your first name"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone (Optional)
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number (Optional)"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="addressLine1" className="form-label">
            Address Line 1
          </label>
          <input
            type="text"
            className="form-control"
            id="addressLine1"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            required
            placeholder="Enter your address (eg. Kawiory 1)"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="addressLine2" className="form-label">
            Address Line 2
          </label>
          <input
            type="text"
            className="form-control"
            id="addressLine2"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            placeholder="Apartment, suite, etc. (Optional)"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="additionalNotes" className="form-label">
            Additional Notes
          </label>
          <textarea
            className="form-control"
            id="additionalNotes"
            rows={3}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Any additional notes (Optional)"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="orderValue" className="form-label">
            Order Total
          </label>
          <input
            type="text"
            className="form-control"
            id="orderValue"
            value={`$${orderValue.toFixed(2)}`}
            readOnly
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Place Order
        </button>
      </form>
    </div>
  );
}

export default OrderPage;
