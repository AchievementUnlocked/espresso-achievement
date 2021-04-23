import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import chalk from 'chalk';

import { AppQryModule } from 'app-qry.module';
import { AppCmdModule } from './app-cmd.module';

import { GlobalExceptionFilter } from 'operational/exception';


async function bootstrapQry() {
  const appQry = await NestFactory.create(AppQryModule);

  const configService = appQry.get(ConfigService);

  appQry.enableCors({ origin: [configService.get<string>('API_CORS_ALLOWED_ORIGINS')] });
  appQry.setGlobalPrefix(configService.get<string>('API_PREFIX'));
  appQry.useGlobalFilters(new GlobalExceptionFilter());

  await appQry.listen(configService.get<number>('API_QRY_PORT'));

  console.log(chalk.hex('#2ECC71')(`Espresso Achievement QRY.  Env: ${process.env.NODE_ENV} Port:${configService.get<number>('API_QRY_PORT')}`));
}

async function bootstrapCmd() {
  const appCmd = await NestFactory.create(AppCmdModule);

  const configService = appCmd.get(ConfigService);

  appCmd.enableCors({ origin: [configService.get<string>('API_CORS_ALLOWED_ORIGINS')] });
  appCmd.setGlobalPrefix(configService.get<string>('API_PREFIX'));
  appCmd.useGlobalFilters(new GlobalExceptionFilter());

  await appCmd.listen(configService.get<number>('API_CMD_PORT'));

  console.log(chalk.hex('#2ECC71')(`Espresso Achievement CMD.  Env: ${process.env.NODE_ENV} Port:${configService.get<number>('API_CMD_PORT')}`));
}

bootstrapQry();
bootstrapCmd();