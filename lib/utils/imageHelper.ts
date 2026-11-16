export interface ImageMeta {
  width: number;
  height: number;
  name: string;
  fileSize: number;
  fileExt: string;
  localUrl: string;
}

function getDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(reader.error ?? new Error("Could not read image"));
    reader.onload = async (e) => {
      const result = e.target?.result;
      if (typeof result !== "string") {
        reject(new Error("Unexpected FileReader result"));
        return;
      }
      try {
        const image = new Image();
        image.src = result;
        await image.decode();
        resolve({ width: image.width, height: image.height });
      } catch (err) {
        reject(err);
      }
    };

    reader.readAsDataURL(file);
  });
}

export const getImageMeta = async (file: File): Promise<ImageMeta> => {
  const { name } = file;
  const fileExt = name.split(".").pop() ?? "";
  const localUrl = URL.createObjectURL(file);
  const { width, height } = await getDimensions(file);

  return { width, height, name, fileSize: file.size, fileExt, localUrl };
};
