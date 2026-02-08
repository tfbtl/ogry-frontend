/**
 * @ogrency/config — shared config schema + normalize.
 * Single entrypoint; no deep imports.
 * Env reading is NOT done here; composition roots pass env in.
 */

export type { ClientConfig, FeatureFlags } from "./schema";
export {
  normalizeViteClientEnv,
  normalizeNextPublicEnv,
  normalizeNextServerEnv,
} from "./normalize";
export type {
  ImportMetaEnvLike,
  NextServerEnvPlaceholder,
} from "./normalize";
