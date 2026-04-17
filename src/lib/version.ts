export const APP_VERSION = "0.1.0";

export function isStableVersion(version: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(version);
}
