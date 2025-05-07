import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

const s3 = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    console.log('FormData keys:', [...formData.keys()]);

    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
    }

    console.log('File info:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extension = file.name.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET!,
      Key: filename,
      Body: buffer,
      ContentType: file.type || 'application/octet-stream',
    };

    console.log('Uploading with params:', {
      Bucket: uploadParams.Bucket,
      Key: uploadParams.Key,
      ContentType: uploadParams.ContentType,
    });

    await s3.send(new PutObjectCommand(uploadParams));

    const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${filename}`;
    return new Response(JSON.stringify({ url: fileUrl }), { status: 200 });
  } catch (err) {
    console.error('Upload error:', JSON.stringify(err, null, 2));
    return new Response(JSON.stringify({ error: 'Failed to upload file' }), { status: 500 });
  }
}
