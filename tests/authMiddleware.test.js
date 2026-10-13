import { afterEach, describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { authenticateRequest } from '../utils/authMiddleware';

const SECRET = 'a-secure-test-secret-that-is-longer-than-32-characters';

const createResponse = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
});

describe('authenticateRequest', () => {
  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('rejects a request without a Bearer token', () => {
    const res = createResponse();
    const result = authenticateRequest({ headers: {} }, res, ['admin']);

    expect(result).toBeNull();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('accepts a signed token with an allowed role', () => {
    process.env.JWT_SECRET = SECRET;
    const token = jwt.sign({ id: 'user-1', role: 'admin' }, SECRET, { algorithm: 'HS256' });
    const res = createResponse();
    const result = authenticateRequest(
      { headers: { authorization: `Bearer ${token}` } },
      res,
      ['admin']
    );

    expect(result.id).toBe('user-1');
    expect(res.status).not.toHaveBeenCalled();
  });

  it('rejects a valid token when its role is not allowed', () => {
    process.env.JWT_SECRET = SECRET;
    const token = jwt.sign({ id: 'user-2', role: 'viewer' }, SECRET, { algorithm: 'HS256' });
    const res = createResponse();
    const result = authenticateRequest(
      { headers: { authorization: `Bearer ${token}` } },
      res,
      ['admin']
    );

    expect(result).toBeNull();
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
