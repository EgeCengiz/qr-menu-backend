import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import sharp from 'sharp';

const uploadsDir = path.join(process.cwd(), 'uploads');

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 500 * 1024 * 1024, // 500 MB max for video files
      },
      fileFilter: (_req, file, cb) => {
        const allowed = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
          'image/gif',
          'video/mp4',
          'video/webm',
          'video/ogg',
          'video/quicktime',
        ];
        if (allowed.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Sadece Resim (JPG, PNG, WebP, GIF) veya Video (MP4, WebM, MOV) yüklenebilir.',
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Dosya yüklenemedi.');
    }

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const isImage = file.mimetype.startsWith('image/') && file.mimetype !== 'image/gif';

    let finalFilename: string;
    let finalPath: string;
    let finalSize = file.size;

    if (isImage) {
      // ── Sharp WebP Auto-Compression & Resize ─────────────────────────────────
      finalFilename = `media-${uniqueSuffix}.webp`;
      finalPath = path.join(uploadsDir, finalFilename);

      try {
        const processedBuffer = await sharp(file.buffer)
          .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 82, effort: 4 })
          .toBuffer();

        fs.writeFileSync(finalPath, processedBuffer);
        finalSize = processedBuffer.length;
      } catch (err) {
        console.error('Sharp WebP compression failed, fallback to original storage:', err);
        const ext = path.extname(file.originalname) || '.jpg';
        finalFilename = `media-${uniqueSuffix}${ext}`;
        finalPath = path.join(uploadsDir, finalFilename);
        fs.writeFileSync(finalPath, file.buffer);
      }
    } else {
      // ── Video & GIF Direct Storage ────────────────────────────────────────────
      const ext = path.extname(file.originalname) || '.mp4';
      finalFilename = `media-${uniqueSuffix}${ext}`;
      finalPath = path.join(uploadsDir, finalFilename);
      fs.writeFileSync(finalPath, file.buffer);
    }

    return {
      url: `/uploads/${finalFilename}`,
      filename: finalFilename,
      originalname: file.originalname,
      size: finalSize,
    };
  }
}
