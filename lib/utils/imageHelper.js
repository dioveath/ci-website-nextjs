export const getImageMeta = async (file) => {
  const { name } = file;
  const fileExt = name.split('.').pop();
  const localUrl = URL.createObjectURL(file);

  async function getMeta(file){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async(e) => {
        const image = new Image();
        image.src = e.target.result;
        await image.decode();
        resolve({ width: image.width, height: image.height});
      };

      reader.readAsDataURL(file);
    });
  }

  const { width, height } = await getMeta(file);

  return { width, height, name, fileSize: file.size, fileExt, localUrl };
};
