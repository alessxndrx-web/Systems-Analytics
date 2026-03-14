type EnvRecord = Record<string, string | undefined>;

function requireValue(env: EnvRecord, key: string) {
  const value = env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function validateEnv(env: EnvRecord) {
  const databaseUrl = requireValue(env, 'DATABASE_URL');
  const jwtSecret = requireValue(env, 'JWT_SECRET');
  const redisUrl = env.REDIS_URL?.trim();
  const redisHost = env.REDIS_HOST?.trim();
  const redisPort = env.REDIS_PORT?.trim();

  if (!redisUrl && (!redisHost || !redisPort)) {
    throw new Error('Missing Redis configuration. Set REDIS_URL or both REDIS_HOST and REDIS_PORT.');
  }

  return {
    ...env,
    DATABASE_URL: databaseUrl,
    JWT_SECRET: jwtSecret,
    REDIS_URL: redisUrl,
    REDIS_HOST: redisHost,
    REDIS_PORT: redisPort
  };
}
