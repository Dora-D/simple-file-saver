export function formatFileSize(sizeInBytes: number): string {
  const units = ["bytes", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (sizeInBytes >= 1024 && i < units.length - 1) {
    sizeInBytes /= 1024;
    i++;
  }
  return `${sizeInBytes.toFixed(1)} ${units[i]}`;
}
