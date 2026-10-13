const stores = globalThis.__vgtRateLimitStores || new Map();
globalThis.__vgtRateLimitStores = stores;
const MAX_STORES = 5000;

const pruneStores = (now) => {
  if (stores.size < MAX_STORES) return;
  for (const [key, value] of stores) {
    if (value.resetAt <= now) stores.delete(key);
  }
  while (stores.size >= MAX_STORES) {
    stores.delete(stores.keys().next().value);
  }
};

const getClientAddress = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
};

export const enforceRateLimit = (
  req,
  res,
  { name, limit = 20, windowMs = 60_000 }
) => {
  const now = Date.now();
  pruneStores(now);
  const key = `${name}:${getClientAddress(req)}`;
  const current = stores.get(key);

  if (!current || current.resetAt <= now) {
    stores.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  current.count += 1;
  if (current.count <= limit) return true;

  res.setHeader('Retry-After', Math.ceil((current.resetAt - now) / 1000));
  res.status(429).json({ error: 'Trop de requêtes, veuillez réessayer plus tard' });
  return false;
};

export const clearRateLimitsForTests = () => stores.clear();
