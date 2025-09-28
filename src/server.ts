import { env } from '@config/env.js';
import { buildApp } from '@/app.js';

const app = await buildApp();

try {
  const address = await app.listen({
    port: env.PORT,
    host: env.HOST,
  });
  app.log.info(`Documentation available at ${address}/documentation/`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
