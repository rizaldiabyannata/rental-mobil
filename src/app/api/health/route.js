import prisma from "@/lib/prisma";

export async function GET() {
  // Basic health check that touches the DB
  try {
    await prisma.$queryRaw`SELECT 1`; // Works on SQLite too
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
