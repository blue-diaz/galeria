import { Redis } from '@upstash/redis';

let redisSingleton: Redis | null = null;

function readEnv(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name];
    if (value !== undefined && value !== null && value.trim() !== '')
      return value;
  }
  return undefined;
}

export function isClonesRedisConfigured(): boolean {
  const url = readEnv('UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_URL');
  const token = readEnv('UPSTASH_REDIS_REST_TOKEN', 'UPSTASH_REDIS_TOKEN');
  return url !== undefined && token !== undefined;
}

export function getClonesRedis(): Redis {
  if (redisSingleton !== null) return redisSingleton;

  const url = readEnv('UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_URL');
  const token = readEnv('UPSTASH_REDIS_REST_TOKEN', 'UPSTASH_REDIS_TOKEN');

  if (url === undefined || token === undefined) {
    throw new Error(
      'Upstash Redis env not configured. Expected UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.',
    );
  }

  redisSingleton = new Redis({ url, token });
  return redisSingleton;
}

export function normalizeCloneId(rawId: string): string | null {
  const id = rawId.trim();

  if (id.length < 1 || id.length > 64) return null;
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return null;

  return id;
}

export function cloneKey(id: string): string {
  return `clones:${id}`;
}

export function unicCloneKey(id: string): string {
  return `unic_clones:${id}`;
}
