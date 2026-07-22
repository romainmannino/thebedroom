import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "application/pdf",
]);

function safeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "Aucun fichier reçu.",
        },
        { status: 400 },
      );
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Format de fichier non autorisé.",
        },
        { status: 400 },
      );
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: "Le fichier dépasse 50 Mo.",
        },
        { status: 400 },
      );
    }

    const extensionName = safeFileName(file.name);
    const storagePath =
      `the-bedroom/${Date.now()}-${crypto.randomUUID()}-${extensionName}`;

    const bytes = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from("guide-media")
      .upload(storagePath, bytes, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabaseAdmin.storage
      .from("guide-media")
      .getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      url: data.publicUrl,
      path: storagePath,
      fileName: file.name,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue",
      },
      { status: 500 },
    );
  }
}
