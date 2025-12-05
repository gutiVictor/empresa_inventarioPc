/**
 * Suite de Pruebas del Backend - Inventario
 * 
 * Este script prueba todos los endpoints y modelos del backend
 * para asegurar que funcionen correctamente con la base de datos.
 * 
 * Ejecutar: node test-backend.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper para hacer peticiones
async function request(method, endpoint, data = null, requiresAuth = false) {
  const config = {
    method,
    url: `${BASE_URL}${endpoint}`,
    headers: {}
  };

  if (requiresAuth && authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  if (data) {
    config.data = data;
    config.headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status,
      fullError: error.toString()
    };
  }
}

// Helper para reportar test
function reportTest(name, passed, details = '') {
  const icon = passed ? '✅' : '❌';
  const color = passed ? colors.green : colors.red;
  
  console.log(`${color}${icon} ${name}${colors.reset}`);
  if (details) {
    console.log(`   ${colors.cyan}${details}${colors.reset}`);
  }
  
  results.tests.push({ name, passed, details });
  if (passed) results.passed++;
  else results.failed++;
}

function printSection(title) {
  console.log(`\n${colors.blue}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.blue}${title}${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}\n`);
}

// ============================================
// PRUEBAS
// ============================================

async function testAuth() {
  printSection('1. PRUEBAS DE AUTENTICACIÓN');

  // Test login exitoso
  const loginResult = await request('POST', '/auth/login', {
    email: 'ana.lopez@empresa.com',
    password: 'Inventario2024!'
  });

  if (loginResult.success && loginResult.data.token) {
    authToken = loginResult.data.token;
    reportTest('Login exitoso', true, `Token recibido, rol: ${loginResult.data.user.role}`);
  } else {
    const errorMsg = JSON.stringify(loginResult.error, null, 2) || loginResult.fullError || 'Error desconocido';
    reportTest('Login exitoso', false, `Error: ${errorMsg}\nStatus: ${loginResult.status}`);
    console.log('\nDatos de login enviados:', { email: 'ana.lopez@empresa.com', password: 'Inventario2024!' });
    console.log('Respuesta completa:', JSON.stringify(loginResult, null, 2));
    throw new Error('No se pudo autenticar - las pruebas posteriores fallarán');
  }

  // Test login con credenciales incorrectas
  const badLogin = await request('POST', '/auth/login', {
    email: 'test@test.com',
    password: 'wrongpassword'
  });

  reportTest('Login rechazado con credenciales incorrectas', 
    !badLogin.success && badLogin.status === 401,
    badLogin.error?.message
  );

  // Test obtener perfil
  const profileResult = await request('GET', '/auth/profile', null, true);
  reportTest('Obtener perfil de usuario', 
    profileResult.success && profileResult.data.email === 'ana.lopez@empresa.com',
    profileResult.success ? `Usuario: ${profileResult.data.full_name}` : profileResult.error?.message
  );
}

async function testUsers() {
  printSection('2. PRUEBAS DE USUARIOS');

  // Listar usuarios
  const listResult = await request('GET', '/users', null, true);
  reportTest('Listar todos los usuarios', 
    listResult.success && Array.isArray(listResult.data),
    listResult.success ? `${listResult.data.length} usuarios encontrados` : listResult.error?.message
  );

  // Obtener usuario específico
  if (listResult.success && listResult.data.length > 0) {
    const userId = listResult.data[0].id;
    const userResult = await request('GET', `/users/${userId}`, null, true);
    reportTest('Obtener usuario por ID', 
      userResult.success && userResult.data.id === userId,
      userResult.success ? `Usuario: ${userResult.data.full_name}` : userResult.error?.message
    );
  }
}

async function testLocations() {
  printSection('3. PRUEBAS DE UBICACIONES');

  // Listar ubicaciones
  const listResult = await request('GET', '/locations', null, true);
  reportTest('Listar todas las ubicaciones', 
    listResult.success && Array.isArray(listResult.data),
    listResult.success ? `${listResult.data.length} ubicaciones encontradas` : listResult.error?.message
  );

  // Obtener ubicación específica
  if (listResult.success && listResult.data.length > 0) {
    const locationId = listResult.data[0].id;
    const locationResult = await request('GET', `/locations/${locationId}`, null, true);
    reportTest('Obtener ubicación por ID', 
      locationResult.success && locationResult.data.id === locationId,
      locationResult.success ? `Ubicación: ${locationResult.data.name}` : locationResult.error?.message
    );
  }
}

async function testCategories() {
  printSection('4. PRUEBAS DE CATEGORÍAS');

  // Listar categorías
  const listResult = await request('GET', '/categories', null, true);
  reportTest('Listar todas las categorías', 
    listResult.success && Array.isArray(listResult.data),
    listResult.success ? `${listResult.data.length} categorías encontradas` : listResult.error?.message
  );

  // Obtener categoría específica
  if (listResult.success && listResult.data.length > 0) {
    const categoryId = listResult.data[0].id;
    const categoryResult = await request('GET', `/categories/${categoryId}`, null, true);
    reportTest('Obtener categoría por ID', 
      categoryResult.success && categoryResult.data.id === categoryId,
      categoryResult.success ? `Categoría: ${categoryResult.data.name}` : categoryResult.error?.message
    );
  }
}

async function testSuppliers() {
  printSection('5. PRUEBAS DE PROVEEDORES');

  // Listar proveedores
  const listResult = await request('GET', '/suppliers', null, true);
  reportTest('Listar todos los proveedores', 
    listResult.success && Array.isArray(listResult.data),
    listResult.success ? `${listResult.data.length} proveedores encontrados` : listResult.error?.message
  );

  // Obtener proveedor específico
  if (listResult.success && listResult.data.length > 0) {
    const supplierId = listResult.data[0].id;
    const supplierResult = await request('GET', `/suppliers/${supplierId}`, null, true);
    reportTest('Obtener proveedor por ID', 
      supplierResult.success && supplierResult.data.id === supplierId,
      supplierResult.success ? `Proveedor: ${supplierResult.data.name}` : supplierResult.error?.message
    );
  }
}

async function testAssets() {
  printSection('6. PRUEBAS DE ACTIVOS');

  // Listar activos
  const listResult = await request('GET', '/assets', null, true);
  reportTest('Listar todos los activos', 
    listResult.success && Array.isArray(listResult.data),
    listResult.success ? `${listResult.data.length} activos encontrados` : listResult.error?.message
  );

  // Verificar relaciones en activos
  if (listResult.success && listResult.data.length > 0) {
    const asset = listResult.data[0];
    const hasRelations = asset.category && asset.location;
    reportTest('Activos incluyen relaciones (category, location)', 
      hasRelations,
      hasRelations ? `Asset: ${asset.name} → Categoría: ${asset.category.name}, Ubicación: ${asset.location.name}` : 'Relaciones no cargadas'
    );

    // Obtener activo específico
    const assetResult = await request('GET', `/assets/${asset.id}`, null, true);
    reportTest('Obtener activo por ID', 
      assetResult.success && assetResult.data.id === asset.id,
      assetResult.success ? `Activo: ${assetResult.data.name}` : assetResult.error?.message
    );
  }
}

async function testMoves() {
  printSection('7. PRUEBAS DE MOVIMIENTOS DE ACTIVOS');

  const listResult = await request('GET', '/moves', null, true);
  reportTest('Listar movimientos de activos', 
    listResult.success && Array.isArray(listResult.data),
    listResult.success ? `${listResult.data.length} movimientos encontrados` : listResult.error?.message
  );

  // Verificar relaciones
  if (listResult.success && listResult.data.length > 0) {
    const move = listResult.data[0];
    const hasRelations = move.asset && move.fromLocation && move.toLocation;
    reportTest('Movimientos incluyen relaciones completas', 
      hasRelations,
      hasRelations ? `Movimiento: ${move.asset.name} de ${move.fromLocation.name} a ${move.toLocation.name}` : 'Relaciones incompletas'
    );
  }
}

async function testAssignments() {
  printSection('8. PRUEBAS DE ASIGNACIONES');

  const listResult = await request('GET', '/assignments', null, true);
  reportTest('Listar asignaciones de activos', 
    listResult.success && Array.isArray(listResult.data),
    listResult.success ? `${listResult.data.length} asignaciones encontradas` : listResult.error?.message
  );

  // Verificar relaciones
  if (listResult.success && listResult.data.length > 0) {
    const assignment = listResult.data[0];
    const hasRelations = assignment.asset && assignment.user;
    reportTest('Asignaciones incluyen relaciones', 
      hasRelations,
      hasRelations ? `${assignment.asset.name} → ${assignment.user.full_name}` : 'Relaciones incompletas'
    );
  }
}

async function testMaintenance() {
  printSection('9. PRUEBAS DE ÓRDENES DE MANTENIMIENTO');

  const listResult = await request('GET', '/maintenance', null, true);
  reportTest('Listar órdenes de mantenimiento', 
    listResult.success && Array.isArray(listResult.data),
    listResult.success ? `${listResult.data.length} órdenes encontradas` : listResult.error?.message
  );

  // Verificar relaciones
  if (listResult.success && listResult.data.length > 0) {
    const order = listResult.data[0];
    const hasRelations = order.asset;
    reportTest('Órdenes incluyen relación con activo', 
      hasRelations,
      hasRelations ? `Orden para: ${order.asset.name} (${order.type})` : 'Relaciones incompletas'
    );
  }
}

async function testLicenses() {
  printSection('10. PRUEBAS DE LICENCIAS DE SOFTWARE');

  const listResult = await request('GET', '/licenses', null, true);
  reportTest('Listar licencias de software', 
    listResult.success && Array.isArray(listResult.data),
    listResult.success ? `${listResult.data.length} licencias encontradas` : listResult.error?.message
  );
}

async function testConsumables() {
  printSection('11. PRUEBAS DE CONSUMIBLES');

  const listResult = await request('GET', '/consumables', null, true);
  reportTest('Listar consumibles', 
    listResult.success && Array.isArray(listResult.data),
    listResult.success ? `${listResult.data.length} consumibles encontrados` : listResult.error?.message
  );
}

async function testDocuments() {
  printSection('12. PRUEBAS DE DOCUMENTOS');

  const listResult = await request('GET', '/documents', null, true);
  reportTest('Listar documentos', 
    listResult.success && Array.isArray(listResult.data),
    listResult.success ? `${listResult.data.length} documentos encontrados` : listResult.error?.message
  );
}

// ============================================
// EJECUTAR TODAS LAS PRUEBAS
// ============================================

async function runAllTests() {
  console.log(`\n${colors.cyan}╔${'═'.repeat(58)}╗${colors.reset}`);
  console.log(`${colors.cyan}║${' '.repeat(10)}SUITE DE PRUEBAS DEL BACKEND${' '.repeat(20)}║${colors.reset}`);
  console.log(`${colors.cyan}╚${'═'.repeat(58)}╝${colors.reset}\n`);

  try {
    await testAuth();
    await testUsers();
    await testLocations();
    await testCategories();
    await testSuppliers();
    await testAssets();
    await testMoves();
    await testAssignments();
    await testMaintenance();
    await testLicenses();
    await testConsumables();
    await testDocuments();

    // Resumen final
    printSection('RESUMEN DE RESULTADOS');
    
    const total = results.passed + results.failed;
    const percentage = ((results.passed / total) * 100).toFixed(1);
    
    console.log(`${colors.green}✅ Pruebas pasadas: ${results.passed}${colors.reset}`);
    console.log(`${colors.red}❌ Pruebas fallidas: ${results.failed}${colors.reset}`);
    console.log(`${colors.yellow}📊 Porcentaje de éxito: ${percentage}%${colors.reset}\n`);

    if (results.failed > 0) {
      console.log(`${colors.yellow}Pruebas fallidas:${colors.reset}`);
      results.tests
        .filter(t => !t.passed)
        .forEach(t => console.log(`   ${colors.red}• ${t.name}${colors.reset}`));
      console.log('');
    }

    if (results.failed === 0) {
      console.log(`${colors.green}🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!${colors.reset}\n`);
    } else {
      console.log(`${colors.yellow}⚠️  Hay ${results.failed} prueba(s) que requieren atención${colors.reset}\n`);
    }

  } catch (error) {
    console.error(`${colors.red}Error fatal: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Instalar axios si es necesario
console.log(`${colors.cyan}Verificando dependencias...${colors.reset}`);
try {
  require.resolve('axios');
  runAllTests();
} catch (e) {
  console.log(`${colors.yellow}Instalando axios...${colors.reset}`);
  const { execSync } = require('child_process');
  execSync('npm install axios', { stdio: 'inherit' });
  console.log(`${colors.green}✅ axios instalado${colors.reset}\n`);
  runAllTests();
}
