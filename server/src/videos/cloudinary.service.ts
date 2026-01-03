import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadVideo(file: Express.Multer.File): Promise<any> {
    // If no cloudinary config, fallback or throw. 
    // We will assume if envs are missing, we can't upload to cloud.
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
        throw new Error('Cloudinary config missing');
    }

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'korczetube_videos',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      const stream = Readable.from(file.buffer);
      stream.pipe(upload);
    });
  }
}
