import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// PrismaService extiende PrismaClient para exponer el cliente Prisma a través
// de inyección de dependencias de NestJS. El `DATABASE_URL` se debe declarar
// en el `.env` raíz del proyecto y será leído por Prisma vía `process.env`.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    super();
  }

  // Al cerrar el módulo, desconectar el cliente Prisma
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
