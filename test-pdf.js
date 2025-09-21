// Test script to verify PDF generation with Japanese fonts
const { ensurePdfFont } = require('./lib/pdf-font.ts');

async function testFontLoading() {
  console.log('Testing Japanese font loading...');

  try {
    await ensurePdfFont();
    console.log('✅ Font loading successful!');
  } catch (error) {
    console.error('❌ Font loading failed:', error);
    process.exit(1);
  }
}

// Run test
testFontLoading();