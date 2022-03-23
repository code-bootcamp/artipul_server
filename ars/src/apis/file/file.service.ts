import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { getToday } from 'src/common/libraries/utils';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  async uploads({ files }) {
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(process.env.STORAGE_BUCKET);

    // 먼저 이미지파일 모두 받아두기
    const waitedFiles = await Promise.all(files);

    // 받은 파일 동시에 스토리지에 올리기
    const results = await Promise.all(
      waitedFiles.map(
        (file) =>
          new Promise((resolve, reject) => {
            const fname = `${getToday()}/${uuidv4()}/origin/${file.filename}`;
            file
              .createReadStream()
              .pipe(storage.file(fname).createWriteStream())
              .on('finish', () => resolve(`project-saul/${fname}`))
              .on('error', (error) => reject(error));
          }),
      ),
    );
    return results;
  }
}
