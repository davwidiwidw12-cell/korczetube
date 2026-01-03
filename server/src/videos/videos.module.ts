import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [JwtModule],
  controllers: [VideosController],
  providers: [VideosService, CloudinaryService]
})
export class VideosModule {}
