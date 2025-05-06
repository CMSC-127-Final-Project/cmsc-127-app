import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { NextRequest } from "next/server";

// ✅ Ensure Node.js runtime
export const runtime = "nodejs";

// ✅ S3 setup
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extension = file.name.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: filename,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
    return new Response(JSON.stringify({ url: fileUrl }), { status: 200 });
  } catch (err) {
    console.error("Upload error:", err);
    return new Response(JSON.stringify({ error: "Failed to upload file" }), { status: 500 });
  }
}
