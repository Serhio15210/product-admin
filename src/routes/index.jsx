import React, { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { onValue, ref } from "firebase/database";
import "../index.css";
import { createFileRoute } from "@tanstack/react-router";
import { deleteProduct } from "../bd-api/index.js";
import EditModal from "../components/modals/edit-modal/index.jsx";
import SureModal from "../components/modals/sure-modal/index.jsx";
import AddModal from "../components/modals/add-modal/index.jsx";
import { db } from "../db.js";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [products, setProducts] = useState([]); // Список продуктов
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectProduct, setSelectProduct] = useState(null);
  const [query, setQuery] = useState(""); // Поиск
  const [sortField, setSortField] = useState(""); // Поле сортировки
  const [sortOrder, setSortOrder] = useState("asc"); // Направление сортировки

  const filterData = useMemo(() => {
    const filteredData = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()),
    );

    if (sortField) {
      return filteredData.sort((a, b) => {
        if (sortOrder === "asc") {
          if (typeof a[sortField] === "string") {
            return a[sortField].localeCompare(b[sortField]);
          }
          return a[sortField] - b[sortField];
        } else {
          if (typeof a[sortField] === "string") {
            return b[sortField].localeCompare(a[sortField]);
          }
          return b[sortField] - a[sortField];
        }
      });
    }

    return filteredData;
  }, [products, query, sortField, sortOrder]);

  const removeProduct = async () => {
    try {
      await deleteProduct(selectProduct.uuid);
      setOpenDeleteModal(false);
    } catch (e) {
      console.error(e.message);
    }
  };
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  useEffect(() => {
    const dbRef = ref(db, "product");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      setProducts(data ? Object.values(data) : []);
    });
  }, []);

  return (
    <div className="container-fluid">
      {openAddModal && <AddModal onClose={() => setOpenAddModal(false)} />}
      {openEditModal && (
        <EditModal
          product={selectProduct}
          onClose={() => setOpenEditModal(false)}
        />
      )}
      {openDeleteModal && (
        <SureModal
          onDelete={removeProduct}
          onClose={() => setOpenDeleteModal(false)}
        />
      )}
      <div className="d-flex flex-row align-items-center justify-content-between gap-5 mb-3">
        <h3>Product List</h3>

        <input
          type="text"
          className="form-control w-50"
          name="search"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="primary" onClick={() => setOpenAddModal(true)}>
          Add Product
        </Button>
      </div>

      <div className="table-responsive min-vh-1000">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th
                onClick={() => handleSort("name")}
                style={{ cursor: "pointer" }}
              >
                Name {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="text-center">Photo</th>
              <th
                className="text-center"
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("price")}
              >
                Price (USD){" "}
                {sortField === "price" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th className="text-center">Desc</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterData.map((product, index) => (
              <tr key={product.uuid} style={{ cursor: "pointer" }}>
                <td>{index + 1}</td>
                <td>
                  <span className="fw-bold">{product.name}</span>
                </td>
                <td className="text-center">
                  {product.photo ? (
                    <img
                      src={product.photo}
                      className="img-fluid tableImg"
                      alt="product"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="text-center fw-bold text-success">
                  {product.price ? `$${product.price}` : "-"}
                </td>
                <td className="text-center overflow-auto text-break desc">
                  <span>{product.description || "-"}</span>
                </td>
                <td className="flex-column">
                  <Button
                    variant="warning"
                    className="mb-1 w-100"
                    onClick={() => {
                      setSelectProduct(product);
                      setOpenEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    className="w-100"
                    onClick={() => {
                      setSelectProduct(product);
                      setOpenDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
