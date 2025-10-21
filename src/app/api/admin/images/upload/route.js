import { NextResponse } from "next/server";
import { minioClient } from "@/lib/minio";
// import path from "path";
// import { writeFile } from "fs/promises";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images");

    if (files.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada file yang diupload." },
        { status: 400 }
      );
    }

    const bucketName = process.env.MINIO_BUCKET;
    const uploadedUrls = [];

    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, "us-east-1");
    }

    function randomString(length = 8) {
      return Math.random()
        .toString(36)
        .substring(2, 2 + length);
    }
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split(".").pop();
      const filename = `${Date.now()}_${randomString(8)}.${ext}`;
      const objectName = `tours/${filename}`;
      await minioClient.putObject(bucketName, objectName, buffer, file.size);

      const publicUrl = `${
        process.env.MINIO_USE_SSL === "true" ? "https" : "http"
      }://${process.env.MINIO_ENDPOINT}:${
        process.env.MINIO_PORT
      }/${bucketName}/${objectName}`;
      uploadedUrls.push(publicUrl);
    }

    // return NextResponse.json({
    //   message: "Upload berhasil!",
    //   urls: uploadedUrls,
    // });
    return NextResponse.json({
      message: "Upload ke MinIO berhasil!",
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error("MinIO Upload error:", error);
    return NextResponse.json(
      { error: "Upload ke MinIO gagal." },
      { status: 500 }
    );
  }
}
