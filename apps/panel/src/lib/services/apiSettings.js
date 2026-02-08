import { getSettingsUseCase, updateSettingsUseCase } from "../shared/composition/settingsUseCases";

export async function getSettings() {
  const result = await getSettingsUseCase.execute();
  if (!result.ok) {
    throw new Error(result.error.messageKey);
  }
  // Return Settings object directly (SINGLETON, not array)
  return result.data;
}

// We expect a newSetting object that looks like {setting: newValue}
export async function updateSetting(newSetting) {
  const result = await updateSettingsUseCase.execute(newSetting);
  if (!result.ok) {
    throw new Error(result.error.messageKey);
  }
  // Return updated Settings object (SINGLETON, not array)
  return result.data;
}
