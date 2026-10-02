import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<CloudinaryResponse> {
    const res = await new Promise<CloudinaryResponse>((res, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error || !result) {
            return reject(
              error instanceof Error
                ? error
                : new Error(error?.message ?? 'Cloudinary upload failed'),
            );
          }
          res(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
    return res;
  }
}
