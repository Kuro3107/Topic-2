import { getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";

const uploadFile = async (file) => {
    const storageRef = ref(storage, file.name);
    const response = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(response.ref);
    return downloadUrl;
}

export { uploadFile };