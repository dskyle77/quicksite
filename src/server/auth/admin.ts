// /src/server/auth/admin.ts

import { getUserFromSession } from "../auth";

export async function requireAdmin() {
  const user = await getUserFromSession();

  if (!user || !user.isAdmin) {
    return null;
  }

  return user;
}
