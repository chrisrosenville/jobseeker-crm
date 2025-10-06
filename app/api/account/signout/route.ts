// Deprecated: Client handles sign-out via useClerk().signOut
export async function POST() {
  return new Response(null, { status: 410 });
}
