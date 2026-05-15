/**
 * ตรวจ role จาก Clerk publicMetadata ให้สอดคล้องกับ smart-takhli (lib/requireAuth + lib/permissions)
 * ต้องใช้หลัง requireAuth แล้ว (ต้องมี req.user จาก verifyToken)
 */
const { users } = require("@clerk/clerk-sdk-node");

const CACHE_TTL_MS = 30_000;
const roleCache = new Map();
const inflight = new Map();

async function resolveRole(userId) {
  const now = Date.now();
  const hit = roleCache.get(userId);
  if (hit && hit.expiresAt > now) return hit.role;

  let pending = inflight.get(userId);
  if (!pending) {
    pending = (async () => {
      const user = await users.getUser(userId);
      const role = user?.publicMetadata?.role || "guest";
      roleCache.set(userId, { role, expiresAt: Date.now() + CACHE_TTL_MS });
      return role;
    })();
    pending.finally(() => inflight.delete(userId));
    inflight.set(userId, pending);
  }
  return pending;
}

/**
 * @param {string[]} allowedRoles เช่น ['admin','superadmin']
 */
function requireRole(allowedRoles) {
  return async (req, res, next) => {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    try {
      const role = await resolveRole(userId);
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({
          success: false,
          error: "Forbidden",
          message: `ต้องการ role: ${allowedRoles.join(" หรือ ")}`,
        });
      }
      req.clerkRole = role;
      next();
    } catch (e) {
      console.error("requireRole:", e?.message || e);
      return res.status(500).json({ success: false, error: "ไม่สามารถตรวจสอบสิทธิ์ได้" });
    }
  };
}

module.exports = requireRole;
