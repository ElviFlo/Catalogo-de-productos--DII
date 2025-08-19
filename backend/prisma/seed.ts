import { PrismaClient, TipoMedicamento, SubcategoriaPastilla } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear algunos medicamentos de ejemplo
  const medicamentos = [
    {
      nombre: 'Acetaminofén',
      descripcion: 'Analgésico y antipirético para aliviar el dolor y reducir la fiebre',
      farmaceutica: 'Genérico',
      concentracion: '500mg',
      fechaCaducidad: new Date('2025-12-31'),
      tipo: TipoMedicamento.PASTILLA,
      cantidad: 20,
      precio: 4000,
      subcategoria: SubcategoriaPastilla.ANALGESICO
    },
    {
      nombre: 'Ibuprofeno',
      descripcion: 'Antiinflamatorio no esteroideo para aliviar el dolor y la inflamación',
      farmaceutica: 'Advil',
      concentracion: '400mg',
      fechaCaducidad: new Date('2025-10-31'),
      tipo: TipoMedicamento.PASTILLA,
      cantidad: 30,
      precio: 6000,
      subcategoria: SubcategoriaPastilla.ANTIINFLAMATORIO
    },
    {
      nombre: 'Loratadina',
      descripcion: 'Antihistamínico para aliviar síntomas de alergia',
      farmaceutica: 'Claritin',
      concentracion: '10mg',
      fechaCaducidad: new Date('2026-03-15'),
      tipo: TipoMedicamento.PASTILLA,
      cantidad: 15,
      precio: 8000,
      subcategoria: SubcategoriaPastilla.ANTIALERGICO
    },
    {
      nombre: 'Amoxicilina',
      descripcion: 'Antibiótico para tratar infecciones bacterianas',
      farmaceutica: 'Genérico',
      concentracion: '500mg',
      fechaCaducidad: new Date('2025-08-20'),
      tipo: TipoMedicamento.PASTILLA,
      cantidad: 21,
      precio: 12000,
      subcategoria: SubcategoriaPastilla.ANTIBIOTICO
    },
    {
      nombre: 'Diclofenaco Gel',
      descripcion: 'Gel antiinflamatorio para aplicación tópica',
      farmaceutica: 'Voltaren',
      concentracion: '1%',
      fechaCaducidad: new Date('2025-11-30'),
      tipo: TipoMedicamento.GEL,
      volumen: 50,
      precio: 15000
    },
    {
      nombre: 'Clotrimazol Crema',
      descripcion: 'Crema antifúngica para infecciones de la piel',
      farmaceutica: 'Canesten',
      concentracion: '1%',
      fechaCaducidad: new Date('2026-01-15'),
      tipo: TipoMedicamento.CREMA,
      volumen: 30,
      precio: 18000
    }
  ]

  for (const medicamento of medicamentos) {
    try {
      await prisma.medicamento.create({
        data: medicamento
      })
      console.log(`✅ Medicamento "${medicamento.nombre}" creado exitosamente`)
    } catch (error) {
      console.error(`❌ Error al crear "${medicamento.nombre}":`, error)
      // No lanzar el error aquí, solo logearlo para continuar con los demás
    }
  }

  console.log('🎉 Seed completado exitosamente!')
}

// Ejecutar la función main y manejar errores correctamente
main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    // En lugar de process.exit, solo logear el error
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('🔌 Conexión a la base de datos cerrada')
  })
