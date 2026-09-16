import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('kero Store API')
    .setDescription('This is the backend API for kero Store')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'kero Store API',
    customCss: `
      html, body {
        background: #1f242a;
        color: #f4f6f8;
      }
      body {
        font-family: Inter, Arial, sans-serif;
      }
      .swagger-ui {
        background: #1f242a;
        color: #f4f6f8;
      }
      .swagger-ui .topbar {
        background: #1d2228;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        min-height: 52px;
      }
      .swagger-ui .topbar .wrapper {
        padding: 0 18px;
      }
      .swagger-ui .topbar .download-url-wrapper {
        display: none;
      }
      .swagger-ui .topbar a {
        color: #ffffff;
      }
      .swagger-ui .topbar .link {
        font-weight: 700;
      }
      .swagger-ui .info {
        margin: 24px 0 16px;
      }
      .swagger-ui .info .title {
        color: #f4f6f8;
        font-size: 2.85rem;
        font-weight: 700;
        letter-spacing: -0.04em;
        margin-bottom: 8px;
      }
      .swagger-ui .info .title .version {
        display: inline-block;
        margin-left: 8px;
      }
      .swagger-ui .info .description {
        color: #dce0e6;
        font-size: 1.05rem;
      }
      .swagger-ui .opblock-tag-section {
        border-top: 1px solid rgba(255,255,255,0.08);
        margin-top: 18px;
      }
      .swagger-ui .opblock {
        margin: 0 0 10px;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: none;
        background: rgba(17, 24, 31, 0.9);
      }
      .swagger-ui .opblock-summary {
        padding: 16px 12px;
      }
      .swagger-ui .opblock-summary-path {
        color: #f4f6f8;
        font-size: 1.05rem;
        font-weight: 600;
      }
      .swagger-ui .opblock-summary-operation-id {
        color: #f4f6f8;
      }
      .swagger-ui .opblock-summary-method {
        min-width: 72px;
        border-radius: 4px;
        font-size: 0.78rem;
        font-weight: 700;
        padding: 7px 10px;
      }
      .swagger-ui .opblock-get .opblock-summary-method {
        background: #3f7bd9;
        color: #fff;
      }
      .swagger-ui .opblock-post .opblock-summary-method {
        background: #3ca77a;
        color: #fff;
      }
      .swagger-ui .opblock-patch .opblock-summary-method {
        background: #32a9bd;
        color: #fff;
      }
      .swagger-ui .opblock-delete .opblock-summary-method {
        background: #d65252;
        color: #fff;
      }
      .swagger-ui .curl-command {
        background: #111821;
      }
      .swagger-ui .scheme-container {
        background: transparent;
        box-shadow: none;
      }
      .swagger-ui .model-box,
      .swagger-ui .model-title,
      .swagger-ui .parameter__name,
      .swagger-ui .table-container,
      .swagger-ui table thead tr th,
      .swagger-ui table tbody tr td,
      .swagger-ui .response-col_status,
      .swagger-ui .btn {
        color: #f4f6f8;
      }
      .swagger-ui section.models {
        border-top: 1px solid rgba(255,255,255,0.08);
      }
    `,
  });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
}

await bootstrap();