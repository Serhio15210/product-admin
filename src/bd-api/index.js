import { uid } from "uid";
import { ref, remove, set, update } from "firebase/database";
import { db } from "../db.js";

export const addProduct = async (product) => {
  const uuid = uid();
  await set(ref(db, `product/${uuid}`), {
    uuid,
    ...product,
  });
};
export const updateProduct = async (product, id) => {
  await update(ref(db, `product/${id}`), {
    ...product,
  });
};
export const deleteProduct = async (id) => {
  await remove(ref(db, `product/${id}`));
};
