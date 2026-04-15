export function getImageFilenameAlt(imagePath: string): string {
  const sanitizedPath = imagePath.split("?")[0].split("#")[0];
  const filenameWithExt = sanitizedPath.split("/").pop() || sanitizedPath;
  const filename = filenameWithExt.replace(/\.[^.]+$/, "");
  return filename.replace(/[-_]+/g, " ").trim();
}
