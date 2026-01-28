export async function downloadFileFromS3(
  s3Url: string,
  fileName: string
): Promise<void> {
  try {
    const response = await fetch(s3Url);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
}

export function isImageFromS3Url(s3Url: string): boolean {
  // List of common image file extensions
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".tiff",
    ".svg",
  ];

  // Extract the file extension from the S3 URL
  const url = new URL(s3Url);
  const pathname = url.pathname;
  const extension = pathname.substring(pathname.lastIndexOf(".")).toLowerCase();

  // Check if the extension is in the list of image extensions
  return imageExtensions.includes(extension);
}
