import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearRateLimitsForTests, enforceRateLimit } from '../utils/rateLimit';

const createResponse = () => ({
  setHeader: vi.fn(),
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
});

const createRequest = (address = '203.0.113.10') => ({
  headers: { 'x-forwarded-for': address },
  socket: {},
});

describe('enforceRateLimit', () => {
  beforeEach(() => clearRateLimitsForTests());

  it('accepts requests until the configured limit', () => {
    const req = createRequest();
    const res = createResponse();

    expect(enforceRateLimit(req, res, { name: 'test', limit: 2 })).toBe(true);
    expect(enforceRateLimit(req, res, { name: 'test', limit: 2 })).toBe(true);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns HTTP 429 after the configured limit', () => {
    const req = createRequest();
    const res = createResponse();

    enforceRateLimit(req, res, { name: 'test', limit: 1 });
    expect(enforceRateLimit(req, res, { name: 'test', limit: 1 })).toBe(false);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.setHeader).toHaveBeenCalledWith('Retry-After', expect.any(Number));
  });

  it('keeps independent counters for different clients', () => {
    const res = createResponse();

    expect(enforceRateLimit(createRequest('203.0.113.10'), res, { name: 'test', limit: 1 })).toBe(true);
    expect(enforceRateLimit(createRequest('203.0.113.11'), res, { name: 'test', limit: 1 })).toBe(true);
  });
});
