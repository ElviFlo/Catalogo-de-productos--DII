import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    console.log("✅ Base de datos conectada exitosamente");
  }

  async enableShutdownHooks(app: INestApplication) {
    // Use Node's process event to gracefully close the Nest app
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
