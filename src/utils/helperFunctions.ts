export function formatFirebaseError(errMessage: string): string {
  if (!errMessage) return "";
  const clean = errMessage.replace(/[()]/g, "");
  const errorPart = clean.includes("/") ? clean.split("/")[1] : clean;

  return errorPart.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
