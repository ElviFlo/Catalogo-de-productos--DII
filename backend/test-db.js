const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    
    // Probar conexión
    await prisma.$connect();
    console.log('✅ Conexión exitosa a la base de datos Neon');
    
    // Contar medicamentos
    const count = await prisma.medicamento.count();
    console.log(`📊 Total de medicamentos en la base de datos: ${count}`);
    
    // Obtener todos los medicamentos
    const medicamentos = await prisma.medicamento.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log('\n📋 Últimos medicamentos:');
    medicamentos.forEach((med, index) => {
      console.log(`${index + 1}. ${med.nombre} - ${med.tipo} - ${med.farmaceutica}`);
    });
    
    // Estadísticas por tipo
    const stats = await prisma.medicamento.groupBy({
      by: ['tipo'],
      _count: { tipo: true }
    });
    
    console.log('\n📈 Estadísticas por tipo:');
    stats.forEach(stat => {
      console.log(`- ${stat.tipo}: ${stat._count.tipo} medicamentos`);
    });
    
  } catch (error) {
    console.error('❌ Error al probar la base de datos:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión cerrada');
  }
}

testDatabase();
