import { uploadBytesResumable, ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { firebaseStorage } from '../firebase';
import { getImageMeta }  from '../utils/imageHelper';

const StorageService = {

  uploadImage: async (file, onStateChange) => {
    const uid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);    
    const imageMeta = await getImageMeta(file);

    const metadata = {
      contentType: 'image/' + imageMeta.fileExt,
      name: imageMeta.name,
      size: imageMeta.fileSize
    };

    const photoRef = ref(firebaseStorage, `images/${uid}`, metadata);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(photoRef, file);
      uploadTask.on('state_changed', (snapshot) => {
        if(onStateChange) {
          const percent  = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onStateChange(percent);          
        }
      }, (e) => {
        reject(e);
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve({ downloadURL, uid, ...metadata });
        });
      });
    });
  },

  deleteImage: async (uid) => {
    const photoRef = ref(firebaseStorage, `images/${uid}`);
    return new Promise((resolve, reject) => {
      deleteObject(photoRef).then(() => {
        resolve(true);
      }).catch(err => reject(err));
    });
  }

};

export { StorageService };
