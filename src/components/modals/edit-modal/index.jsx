import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { updateProduct } from "../../../bd-api/index.js";

const EditModal = ({ product, onClose }) => {
  const [error, setError] = useState(""); // Состояние для ошибок
  const [data, setData] = useState({
    name: product?.name || "",
    price: product?.price || "",
    photo: product?.photo || "",
    description: product?.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!data.name.trim()) {
      setError("The 'Name' field is required.");
      return false;
    }
    if (!data.price || isNaN(data.price) || Number(data.price) <= 0) {
      setError(
        "The 'Price' field is required and must be a valid number greater than zero.",
      );
      return false;
    }
    return true;
  };

  const editProduct = async () => {
    setError("");
    if (!validate()) return;
    try {
      await updateProduct(data, product.uuid);
      onClose();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className={`form-control ${error && !data.name.trim() ? "is-invalid" : ""}`}
              name="name"
              value={data.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input
              type="number"
              className={`form-control ${
                error &&
                (!data.price || isNaN(data.price) || Number(data.price) <= 0)
                  ? "is-invalid"
                  : ""
              }`}
              name="price"
              value={data.price}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3 d-flex flex-column gap-2">
            <label className="form-label">Photo URL</label>
            <input
              type="text"
              className="form-control"
              name="photo"
              value={data.photo}
              onChange={handleChange}
            />
            {data.photo && (
              <img
                src={data.photo}
                alt="product"
                className="img-fluid"
                style={{ maxHeight: 300 }}
              />
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={data.description}
              onChange={handleChange}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className={"d-flex flex-column align-items-center"}>
        <Button variant="secondary" onClick={onClose} className={"w-100"}>
          Close
        </Button>
        <Button variant="primary" onClick={editProduct} className={"w-100"}>
          Save changes
        </Button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;
