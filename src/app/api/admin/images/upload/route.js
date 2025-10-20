import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

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

    const uploadedUrls = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");
      const uploadPath = path.join(
        process.cwd(),
        "public/uploads/tours",
        filename
      );

      await writeFile(uploadPath, buffer);
      const publicUrl = `/uploads/tours/${filename}`;
      uploadedUrls.push(publicUrl);
    }

    return NextResponse.json({
      message: "Upload berhasil!",
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload gagal." }, { status: 500 });
  }
}
