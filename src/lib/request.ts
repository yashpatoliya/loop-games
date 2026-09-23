import { headers } from "next/headers";

export async function getRequestOrigin() {
  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3001";
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  return { host, proto };
}
