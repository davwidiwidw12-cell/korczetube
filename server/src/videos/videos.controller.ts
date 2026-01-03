import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, UploadedFiles, Request, BadRequestException, Headers, Ip, Delete } from '@nestjs/common';
import { VideosService } from './videos.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtService } from '@nestjs/jwt';

@Controller('videos')
export class VideosController {
  constructor(
    private readonly videosService: VideosService,
    private jwtService: JwtService
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ], {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  async create(@UploadedFiles() files: { video?: Express.Multer.File[], thumbnail?: Express.Multer.File[] }, @Body() body: any, @Request() req: any) {
    const videoFile = files.video ? files.video[0] : null;
    const thumbnailFile = files.thumbnail ? files.thumbnail[0] : null;
    
    if (!videoFile) {
        throw new BadRequestException('Video file is required');
    }

    return this.videosService.create(body, videoFile, thumbnailFile, req.user.userId);
  }

  @Get('dashboard')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  getDashboardVideos() {
      return this.videosService.getDashboardVideos();
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  delete(@Param('id') id: string) {
      return this.videosService.delete(id);
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  getStats() {
      return this.videosService.getAdminStats();
  }

  @Get()
  findAll() {
    return this.videosService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @Headers('authorization') authHeader: string, @Ip() ip: string) {
    let userId = undefined;
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = this.jwtService.decode(token) as any;
            if (decoded) userId = decoded.sub;
        } catch (e) {}
    }
    return this.videosService.findOne(slug, userId, ip);
  }

  @Post(':id/contest')
  @UseGuards(AuthGuard('jwt'))
  enterContest(@Param('id') id: string, @Body('password') password: string, @Request() req: any) {
    return this.videosService.enterContest(id, req.user.userId, password);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  toggleLike(@Param('id') id: string, @Body('type') type: 'LIKE' | 'DISLIKE', @Request() req: any) {
      return this.videosService.toggleLike(id, req.user.userId, type);
  }

  @Post(':id/comments')
  @UseGuards(AuthGuard('jwt'))
  addComment(@Param('id') id: string, @Body('content') content: string, @Request() req: any) {
      return this.videosService.addComment(id, req.user.userId, content);
  }

  @Post('subscribe/:channelId')
  @UseGuards(AuthGuard('jwt'))
  toggleSubscribe(@Param('channelId') channelId: string, @Request() req: any) {
      return this.videosService.toggleSubscribe(channelId, req.user.userId);
  }
}
