import { CabinServiceAdapter } from "./data/supabaseAdapter/CabinServiceAdapter";

const cabinService = new CabinServiceAdapter();

export async function getCabins() {
  const result = await cabinService.getCabins();
  if (!result.ok) {
    throw new Error(result.error.messageKey || "Cabins could not be loaded");
  }
  return result.data;
}

export async function createEditCabin(newCabin, id) {
  // Legacy function combines create and update
  // Map to TS adapter: if id exists, use updateCabin; otherwise use createCabin
  if (id) {
    const result = await cabinService.updateCabin(id, newCabin);
    if (!result.ok) {
      throw new Error(result.error.messageKey || "Cabin could not be updated");
    }
    return result.data;
  } else {
    const result = await cabinService.createCabin(newCabin);
    if (!result.ok) {
      throw new Error(result.error.messageKey || "Cabin could not be created");
    }
    return result.data;
  }
}

export async function deleteCabin(id) {
  const result = await cabinService.deleteCabin(id);
  if (!result.ok) {
    throw new Error(result.error.messageKey || "Cabin could not be deleted");
  }
  return undefined;
}
