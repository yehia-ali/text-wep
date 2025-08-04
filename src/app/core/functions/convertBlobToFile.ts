export async function convertBlobURLToFile(blobURL: string, fileName: string): Promise<File> {
  const response = await fetch(blobURL);
  const blobData = await response.blob();
  return new File([blobData], fileName);
}