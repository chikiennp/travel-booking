import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ErrorMessage } from 'src/common/enums/message.enums';
import { UploadType } from 'src/common/enums/multer.enum';
import * as fs from 'fs';
import { join } from 'path';

const fileNameGenerator = (prefix: string, file: Express.Multer.File) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  return `${prefix}-${uniqueSuffix}${extname(file.originalname)}`;
};

export const imageFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    return callback(
      new BadRequestException(ErrorMessage.IMG_FILES_ONLY),
      false,
    );
  }
  callback(null, true);
};

export const multerConfigFactory = (type: UploadType) => {
  const basePath = process.env.UPLOAD_LOCATION || './uploads';

  return {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const dest = join(basePath, type);

        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
      },
      filename: (req, file, cb) => cb(null, fileNameGenerator(type, file)),
    }),
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10) },
    fileFilter: imageFileFilter,
  };
};
