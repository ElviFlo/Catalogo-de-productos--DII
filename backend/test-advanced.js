const { PrismaClient, TipoMedicamento, SubcategoriaPastilla } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAdvancedOperations() {
  try {
    console.log('🚀 Probando operaciones avanzadas de la base de datos...\n');
    
    // 1. Buscar medicamentos por tipo
    console.log('1️⃣ Buscando medicamentos de tipo PASTILLA:');
    const pastillas = await prisma.medicamento.findMany({
      where: { tipo: TipoMedicamento.PASTILLA },
      select: { nombre: true, subcategoria: true, cantidad: true }
    });
    pastillas.forEach(p => console.log(`   - ${p.nombre}: ${p.subcategoria} (${p.cantidad} unidades)`));
    
    // 2. Buscar medicamentos por subcategoría
    console.log('\n2️⃣ Buscando medicamentos ANALGESICOS:');
    const analgesicos = await prisma.medicamento.findMany({
      where: { subcategoria: SubcategoriaPastilla.ANALGESICO },
      select: { nombre: true, tipo: true, farmaceutica: true }
    });
    analgesicos.forEach(a => console.log(`   - ${a.nombre} (${a.tipo}) - ${a.farmaceutica}`));
    
    // 3. Buscar por nombre (búsqueda parcial)
    console.log('\n3️⃣ Buscando medicamentos que contengan "ina":');
    const medicamentosConIna = await prisma.medicamento.findMany({
      where: {
        nombre: { contains: 'ina', mode: 'insensitive' }
      },
      select: { nombre: true, tipo: true }
    });
    medicamentosConIna.forEach(m => console.log(`   - ${m.nombre} (${m.tipo})`));
    
    // 4. Estadísticas detalladas
    console.log('\n4️⃣ Estadísticas detalladas:');
    const totalMedicamentos = await prisma.medicamento.count();
    const medicamentosPorFarmaceutica = await prisma.medicamento.groupBy({
      by: ['farmaceutica'],
      _count: { farmaceutica: true }
    });
    
    console.log(`   Total de medicamentos: ${totalMedicamentos}`);
    console.log('   Por farmacéutica:');
    medicamentosPorFarmaceutica.forEach(f => {
      console.log(`     - ${f.farmaceutica}: ${f._count.farmaceutica}`);
    });
    
    // 5. Medicamentos que caducan pronto (próximos 6 meses)
    const seisMeses = new Date();
    seisMeses.setMonth(seisMeses.getMonth() + 6);
    
    const medicamentosCaducando = await prisma.medicamento.findMany({
      where: {
        fechaCaducidad: { lte: seisMeses }
      },
      select: { nombre: true, fechaCaducidad: true, tipo: true },
      orderBy: { fechaCaducidad: 'asc' }
    });
    
    console.log('\n5️⃣ Medicamentos que caducan en los próximos 6 meses:');
    if (medicamentosCaducando.length > 0) {
      medicamentosCaducando.forEach(m => {
        const fecha = m.fechaCaducidad.toLocaleDateString('es-ES');
        console.log(`   - ${m.nombre} (${m.tipo}): ${fecha}`);
      });
    } else {
      console.log('   ✅ No hay medicamentos que caduquen pronto');
    }
    
    // 6. Crear un medicamento de prueba
    console.log('\n6️⃣ Creando un medicamento de prueba...');
    const nuevoMedicamento = await prisma.medicamento.create({
      data: {
        nombre: 'Paracetamol Test',
        descripcion: 'Medicamento de prueba para verificar la funcionalidad',
        farmaceutica: 'Test Pharma',
        concentracion: '500mg',
        fechaCaducidad: new Date('2026-12-31'),
        tipo: TipoMedicamento.PASTILLA,
        cantidad: 10,
        subcategoria: SubcategoriaPastilla.ANALGESICO
      }
    });
    console.log(`   ✅ Medicamento creado: ${nuevoMedicamento.nombre} (ID: ${nuevoMedicamento.id})`);
    
    // 7. Actualizar el medicamento de prueba
    console.log('\n7️⃣ Actualizando el medicamento de prueba...');
    const medicamentoActualizado = await prisma.medicamento.update({
      where: { id: nuevoMedicamento.id },
      data: { cantidad: 20 }
    });
    console.log(`   ✅ Cantidad actualizada: ${medicamentoActualizado.cantidad}`);
    
    // 8. Eliminar el medicamento de prueba
    console.log('\n8️⃣ Eliminando el medicamento de prueba...');
    await prisma.medicamento.delete({
      where: { id: nuevoMedicamento.id }
    });
    console.log('   ✅ Medicamento de prueba eliminado');
    
    console.log('\n🎉 ¡Todas las pruebas completadas exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión cerrada');
  }
}

testAdvancedOperations();
