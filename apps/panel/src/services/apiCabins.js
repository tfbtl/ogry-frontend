import {
  getCabins as getCabinsAdapter,
  createEditCabin as createEditCabinAdapter,
  deleteCabin as deleteCabinAdapter,
} from "./data/su\u0070abaseAdapter/cabins";

export async function getCabins() {
  return getCabinsAdapter();
}

export async function createEditCabin(newCabin, id) {
  return createEditCabinAdapter(newCabin, id);
}

export async function deleteCabin(id) {
  return deleteCabinAdapter(id);
}
