#!/usr/bin/env node

const { exec, spawn } = require('child_process');
const readline = require('readline');
const path = require('path');

// 開発サーバー管理スクリプト

class DevServerManager {
  constructor() {
    this.currentProcess = null;
    this.port = process.env.PORT || 3000;
  }

  // 既存のNode.jsプロセスをクリーンアップ
  async cleanup() {
    console.log('🧹 既存のNode.jsプロセスをクリーンアップ中...');

    return new Promise((resolve) => {
      // Windows環境
      if (process.platform === 'win32') {
        exec('taskkill /F /IM node.exe 2>nul', (error) => {
          if (error && error.code !== 128) {
            console.log('⚠️ プロセスクリーンアップ中の警告:', error.message);
          }
          resolve();
        });
      } else {
        // Unix系環境
        exec('pkill -f "next dev" 2>/dev/null', (error) => {
          if (error && error.code !== 1) {
            console.log('⚠️ プロセスクリーンアップ中の警告:', error.message);
          }
          resolve();
        });
      }
    });
  }

  // ポートが使用可能か確認
  async checkPort(port) {
    return new Promise((resolve) => {
      const command = process.platform === 'win32'
        ? `netstat -an | findstr :${port}`
        : `lsof -i :${port}`;

      exec(command, (error, stdout) => {
        if (error || !stdout) {
          resolve(true); // ポートは使用可能
        } else {
          resolve(false); // ポートは使用中
        }
      });
    });
  }

  // 利用可能なポートを探す
  async findAvailablePort(startPort = 3000) {
    let port = startPort;
    while (port < startPort + 100) {
      const isAvailable = await this.checkPort(port);
      if (isAvailable) {
        return port;
      }
      port++;
    }
    throw new Error('利用可能なポートが見つかりません');
  }

  // .nextディレクトリをクリア
  async clearNextCache() {
    console.log('🗑️ .nextキャッシュをクリア中...');

    return new Promise((resolve) => {
      const command = process.platform === 'win32'
        ? 'rd /s /q .next 2>nul && mkdir .next'
        : 'rm -rf .next && mkdir .next';

      exec(command, (error) => {
        if (error) {
          console.log('ℹ️ .nextディレクトリのクリアをスキップ');
        }
        resolve();
      });
    });
  }

  // 開発サーバーを起動
  async start() {
    console.log('🚀 開発サーバーを起動中...');

    // 環境をクリーンアップ
    await this.cleanup();
    await this.clearNextCache();

    // 利用可能なポートを探す
    this.port = await this.findAvailablePort(this.port);
    console.log(`✅ ポート ${this.port} を使用します`);

    // 開発サーバーを起動
    return new Promise((resolve, reject) => {
      const env = { ...process.env, PORT: this.port };

      this.currentProcess = spawn('npm', ['run', 'dev'], {
        env,
        stdio: 'pipe',
        shell: true,
        cwd: process.cwd()
      });

      this.currentProcess.stdout.on('data', (data) => {
        const output = data.toString();
        process.stdout.write(output);

        // サーバーが起動したら解決
        if (output.includes('Ready') || output.includes('started server on')) {
          console.log(`\n✨ 開発サーバーが起動しました: http://localhost:${this.port}\n`);
          resolve();
        }
      });

      this.currentProcess.stderr.on('data', (data) => {
        process.stderr.write(data);
      });

      this.currentProcess.on('error', (error) => {
        console.error('❌ サーバー起動エラー:', error);
        reject(error);
      });

      this.currentProcess.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          console.log(`⚠️ サーバーが終了しました (code: ${code})`);
        }
      });
    });
  }

  // サーバーを停止
  stop() {
    if (this.currentProcess) {
      console.log('🛑 開発サーバーを停止中...');
      this.currentProcess.kill();
      this.currentProcess = null;
    }
  }

  // 再起動
  async restart() {
    console.log('🔄 開発サーバーを再起動中...');
    this.stop();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await this.start();
  }
}

// CLIインターフェース
async function main() {
  const manager = new DevServerManager();

  // 初回起動
  try {
    await manager.start();
  } catch (error) {
    console.error('起動に失敗しました:', error);
    process.exit(1);
  }

  // コマンドラインインターフェース
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n📝 コマンド:');
  console.log('  restart - サーバーを再起動');
  console.log('  clean   - キャッシュをクリアして再起動');
  console.log('  stop    - サーバーを停止');
  console.log('  exit    - 終了\n');

  rl.on('line', async (input) => {
    const command = input.trim().toLowerCase();

    switch (command) {
      case 'restart':
        await manager.restart();
        break;
      case 'clean':
        await manager.clearNextCache();
        await manager.restart();
        break;
      case 'stop':
        manager.stop();
        break;
      case 'exit':
        manager.stop();
        process.exit(0);
        break;
      default:
        console.log('不明なコマンド:', command);
    }
  });

  // プロセス終了時のクリーンアップ
  process.on('SIGINT', () => {
    console.log('\n👋 終了中...');
    manager.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    manager.stop();
    process.exit(0);
  });
}

// スクリプト実行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = DevServerManager;