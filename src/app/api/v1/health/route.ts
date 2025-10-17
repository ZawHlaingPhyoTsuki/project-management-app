// GET /api/v1/health - Health check
export async function GET() {
  return new Response("OK", { status: 200 });
}
