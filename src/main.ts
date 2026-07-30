import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as mysql from 'mysql2/promise';

async function ensureDatabaseExists() {
  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT) || 3306;
  const user = process.env.DB_USERNAME || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'qrmenu';

  try {
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await connection.end();
    console.log(`✅ MySQL Veritabanı Otomatik Kontrol Edildi / Oluşturuldu: "${database}"`);
  } catch (err) {
    console.error('⚠️ MySQL veritabanı otomatik oluşturma uyarısı:', err);
  }
}

async function bootstrap() {
  // Ensure database exists before NestJS connects with TypeORM
  await ensureDatabaseExists();

  const app = await NestFactory.create(AppModule);

  const corsOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  // Enable CORS with support for local dev ports & network origins
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      
      // Allow if explicit match or wildcard in CORS_ORIGINS
      if (corsOrigins.includes(origin) || corsOrigins.includes('*')) {
        return callback(null, true);
      }

      // Dynamically allow any localhost or 127.0.0.1 origin regardless of port (e.g. 5173, 5174, 5176)
      if (/^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      callback(null, true); // Fallback: allow origin in development
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // All routes prefixed with /api
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 QR Menu Backend running on http://localhost:${port}/api and network interfaces`);
}
bootstrap();
