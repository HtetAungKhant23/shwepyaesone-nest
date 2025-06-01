import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      secure: true,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log('init cloudinary');
  }

  async uploadImage(filePath: string, folderName: 'transaction' | 'profile'): Promise<UploadApiErrorResponse | UploadApiResponse> {
    const res = await cloudinary.uploader.upload(filePath, { folder: `spendwise/${folderName}` }).catch((err) => {
      console.log(err);
      return err;
    });

    return res.secure_url;
  }
}
