import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function resolveTenantFromRequest() {
  // Simple resolver: prefer X-Tenant header, then subdomain slug.
  const hdrs = headers();
  const explicit = hdrs.get("x-tenant");
  if (explicit) {
    const tenant = await prisma.tenant.findUnique({ where: { slug: explicit } });
    if (tenant) return tenant;
  }
  const host = hdrs.get("host") ?? "";
  const parts = host.split(".");
  if (parts.length > 2) {
    const slug = parts[0];
    const tenant = await prisma.tenant.findUnique({ where: { slug } });
    if (tenant) return tenant;
  }
  return null;
}

export async function getTenantSettings(tenantId?: string | null) {
  if (!tenantId) return {};
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  return (tenant?.settings as Record<string, unknown>) ?? {};
}

export async function isTenantFeatureEnabled(
  tenantId: string | undefined | null,
  featureKey: string,
  fallback: boolean = true,
) {
  const settings = await getTenantSettings(tenantId);
  const value = settings?.[`enable${capitalize(featureKey)}` as keyof typeof settings];
  if (typeof value === "boolean") return value;
  return fallback;
}

export function tenantFeatureLimit(tenantSettings: Record<string, unknown>, key: string) {
  const value = tenantSettings?.[key];
  if (typeof value === "number") return value;
  return undefined;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
