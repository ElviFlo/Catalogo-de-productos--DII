const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAPI() {
  try {
    console.log('🌐 Probando la API de NestJS...\n');

    // 1. Obtener todos los medicamentos
    console.log('1️⃣ GET /medicamentos - Obtener todos los medicamentos');
    const response1 = await makeRequest('/medicamentos');
    console.log(`   Status: ${response1.status}`);
    console.log(`   Total medicamentos: ${response1.data.length}`);
    console.log(`   Primer medicamento: ${response1.data[0]?.nombre || 'N/A'}\n`);

    // 2. Obtener estadísticas
    console.log('2️⃣ GET /medicamentos/stats - Obtener estadísticas');
    const response2 = await makeRequest('/medicamentos/stats');
    console.log(`   Status: ${response2.status}`);
    console.log(`   Total: ${response2.data.total}`);
    console.log('   Por tipo:');
    response2.data.byType.forEach(stat => {
      console.log(`     - ${stat.tipo}: ${stat.count}`);
    });
    console.log('');

    // 3. Buscar por tipo
    console.log('3️⃣ GET /medicamentos/tipo/PASTILLA - Buscar por tipo');
    const response3 = await makeRequest('/medicamentos/tipo/PASTILLA');
    console.log(`   Status: ${response3.status}`);
    console.log(`   Pastillas encontradas: ${response3.data.length}`);
    response3.data.forEach(p => {
      console.log(`     - ${p.nombre} (${p.subcategoria})`);
    });
    console.log('');

    // 4. Buscar por ID (usar el primer medicamento)
    if (response1.data.length > 0) {
      const firstId = response1.data[0].id;
      console.log(`4️⃣ GET /medicamentos/${firstId} - Obtener por ID`);
      const response4 = await makeRequest(`/medicamentos/${firstId}`);
      console.log(`   Status: ${response4.status}`);
      console.log(`   Medicamento: ${response4.data.nombre} - ${response4.data.tipo}`);
      console.log('');
    }

    // 5. Crear un medicamento de prueba
    console.log('5️⃣ POST /medicamentos - Crear medicamento de prueba');
    const nuevoMedicamento = {
      nombre: 'Test API',
      descripcion: 'Medicamento creado desde la API',
      farmaceutica: 'Test API Pharma',
      concentracion: '100mg',
      fechaCaducidad: '2026-12-31',
      tipo: 'PASTILLA',
      cantidad: 50,
      subcategoria: 'ANALGESICO'
    };
    
    const response5 = await makeRequest('/medicamentos', 'POST', nuevoMedicamento);
    console.log(`   Status: ${response5.status}`);
    if (response5.status === 201 || response5.status === 200) {
      console.log(`   ✅ Medicamento creado: ${response5.data.nombre}`);
      
      // 6. Actualizar el medicamento
      const id = response5.data.id;
      console.log(`\n6️⃣ PATCH /medicamentos/${id} - Actualizar medicamento`);
      const updateData = { cantidad: 100 };
      const response6 = await makeRequest(`/medicamentos/${id}`, 'PATCH', updateData);
      console.log(`   Status: ${response6.status}`);
      console.log(`   ✅ Cantidad actualizada: ${response6.data.cantidad}`);
      
      // 7. Eliminar el medicamento
      console.log(`\n7️⃣ DELETE /medicamentos/${id} - Eliminar medicamento`);
      const response7 = await makeRequest(`/medicamentos/${id}`, 'DELETE');
      console.log(`   Status: ${response7.status}`);
      console.log('   ✅ Medicamento eliminado');
    } else {
      console.log(`   ❌ Error al crear: ${response5.data.message || 'Error desconocido'}`);
    }

    console.log('\n🎉 ¡Pruebas de la API completadas!');

  } catch (error) {
    console.error('❌ Error durante las pruebas de la API:', error.message);
    console.log('\n💡 Asegúrate de que la aplicación NestJS esté ejecutándose en http://localhost:3000');
  }
}

// Esperar un poco para que la API se inicie
setTimeout(testAPI, 2000);
