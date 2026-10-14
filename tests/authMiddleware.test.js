import { afterEach, describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { authenticateActiveRequest, authenticateRequest } from '../utils/authMiddleware';

const databaseMocks = vi.hoisted(() => ({
  connectToDatabase: vi.fn(),
  findById: vi.fn(),
}));

vi.mock('../lib/mongodb.js', () => ({
  connectToDatabase: databaseMocks.connectToDatabase,
}));

vi.mock('../lib/models/UserModel.js', () => ({
  default: { findById: databaseMocks.findById },
}));

const SECRET = 'a-secure-test-secret-that-is-longer-than-32-characters';

const createResponse = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
});

describe('authenticateRequest', () => {
  afterEach(() => {
    delete process.env.JWT_SECRET;
    vi.clearAllMocks();
  });

  it('accepts a token only while the account and session version are current', async () => {
    process.env.JWT_SECRET = SECRET;
    const token = jwt.sign({ id: 'user-3', role: 'editor', auth_version: 2 }, SECRET);
    databaseMocks.findById.mockReturnValue({
      select: vi.fn().mockResolvedValue({ role: 'editor', auth_version: 2 }),
    });
    const res = createResponse();

    const result = await authenticateActiveRequest(
      { headers: { authorization: `Bearer ${token}` } },
      res,
      ['admin', 'editor']
    );

    expect(result.id).toBe('user-3');
    expect(res.status).not.toHaveBeenCalled();
  });

  it('rejects a token after the account role changes', async () => {
    process.env.JWT_SECRET = SECRET;
    const token = jwt.sign({ id: 'user-4', role: 'editor', auth_version: 0 }, SECRET);
    databaseMocks.findById.mockReturnValue({
      select: vi.fn().mockResolvedValue({ role: 'viewer', auth_version: 0 }),
    });
    const res = createResponse();

    const result = await authenticateActiveRequest(
      { headers: { authorization: `Bearer ${token}` } },
      res
    );

    expect(result).toBeNull();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('rejects a token invalidated by a password change', async () => {
    process.env.JWT_SECRET = SECRET;
    const token = jwt.sign({ id: 'user-5', role: 'admin', auth_version: 1 }, SECRET);
    databaseMocks.findById.mockReturnValue({
      select: vi.fn().mockResolvedValue({ role: 'admin', auth_version: 2 }),
    });
    const res = createResponse();

    const result = await authenticateActiveRequest(
      { headers: { authorization: `Bearer ${token}` } },
      res
    );

    expect(result).toBeNull();
    expect(res.status).toHaveBeenCalledWith(401);
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
