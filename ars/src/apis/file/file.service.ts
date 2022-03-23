import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { Storage } from '@google-cloud/storage';

interface IFiles {
  files: FileUpload[];
}

@Injectable()
export class FileService {
  async upload({ files }: IFiles) {
    const bucketName = process.env.BUCKET;
    const storage = new Storage({
      keyFilename: process.env.KEYFILENAME,
      projectId: process.env.PROJECTID,
    }).bucket(bucketName);

    // 업로드 할 이미지들 일단 먼저 받고,
    const waitedFiles = await Promise.all(files);

    // 받은 이미지들 한번에 업로드하기
    const results = await Promise.all(
      waitedFiles.map((file) => {
        return new Promise((resolve, reject) => {
          file
            .createReadStream()
            .pipe(storage.file(file.filename).createWriteStream())
            .on('finish', () => resolve(`/${bucketName}/${file.filename}`))
            .on('error', (error) => reject(error));

          console.log(file.createReadStream().on);
        });
      }),
    );
    return results;
  }
}
