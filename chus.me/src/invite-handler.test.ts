import { describe, it, expect, vi } from 'vitest';
import { createInvite, getInvite, InviteData } from './invite-handler';
import type { KVNamespace } from '@cloudflare/workers-types';

// Mock the KVNamespace
const mockKVStore = new Map<string, string>();

const mockKVNamespace = {
  get: vi.fn(async (key: string) => mockKVStore.get(key) || null),
  put: vi.fn(async (key: string, value: string) => {
    mockKVStore.set(key, value);
  }),
  delete: vi.fn(async (key: string) => {
    mockKVStore.delete(key);
  }),
  list: vi.fn(async (options?: KVNamespaceListOptions) => {
    // Simplified mock, not fully implementing list
    const keys = Array.from(mockKVStore.keys());
    return {
      keys: keys.map(key => ({ name: key })),
      list_complete: true,
      cursor: undefined
    };
  })
} as unknown as KVNamespace;

const mockEnv = {
  INVITES: mockKVNamespace,
};

// Helper to clear the mock store before each test
beforeEach(() => {
  mockKVStore.clear();
  vi.clearAllMocks(); // Clears mock call history
});

describe('Invite Handler', () => {
  describe('createInvite', () => {
    it('should create a new invite, store it in KV, and return code and URL', async () => {
      const groupId = 'test-group-123';
      const relay = 'wss://relay.example.com';

      const result = await createInvite(mockEnv, groupId, relay);

      expect(result.code).toBeTypeOf('string');
      expect(result.code.length).toBe(8); // Assuming generateCode produces 8 char codes
      expect(result.url).toBe(`https://chus.me/i/${result.code}`);

      // Check if KV put was called correctly
      expect(mockEnv.INVITES.put).toHaveBeenCalledTimes(1);
      expect(mockEnv.INVITES.put).toHaveBeenCalledWith(
        result.code,
        JSON.stringify({ groupId, relay })
      );

      // Verify it's in our mock store
      const storedValue = mockKVStore.get(result.code);
      expect(storedValue).toBeDefined();
      expect(JSON.parse(storedValue!)).toEqual({ groupId, relay });
    });
  });

  describe('getInvite', () => {
    it('should retrieve and parse an existing invite from KV', async () => {
      const groupId = 'test-group-456';
      const relay = 'wss://another.relay.example.com';
      const code = 'EXIST123';
      const inviteData: InviteData = { groupId, relay };
      mockKVStore.set(code, JSON.stringify(inviteData));

      const result = await getInvite(mockEnv, code);

      expect(mockEnv.INVITES.get).toHaveBeenCalledTimes(1);
      expect(mockEnv.INVITES.get).toHaveBeenCalledWith(code);
      expect(result).toEqual(inviteData);
    });

    it('should return null if invite code does not exist in KV', async () => {
      const code = 'NONEXIST';
      const result = await getInvite(mockEnv, code);

      expect(mockEnv.INVITES.get).toHaveBeenCalledTimes(1);
      expect(mockEnv.INVITES.get).toHaveBeenCalledWith(code);
      expect(result).toBeNull();
    });

    it('should return null and log an error if invite data in KV is malformed', async () => {
      const code = 'MALFORMD';
      mockKVStore.set(code, 'this is not json');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error output

      const result = await getInvite(mockEnv, code);

      expect(mockEnv.INVITES.get).toHaveBeenCalledTimes(1);
      expect(mockEnv.INVITES.get).toHaveBeenCalledWith(code);
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
}); 