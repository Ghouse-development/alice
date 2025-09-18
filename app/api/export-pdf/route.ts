import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  try {
    // リクエストからプロジェクトIDを取得
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: 'プロジェクトIDが必要です' }, { status: 400 });
    }

    // Puppeteerを起動
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    try {
      const page = await browser.newPage();

      // A3横サイズに設定
      await page.setViewport({
        width: 1587, // A3横の幅（px）
        height: 1123, // A3横の高さ（px）
        deviceScaleFactor: 1,
      });

      // プリントページへナビゲート
      const url = `${request.nextUrl.origin}/print?projectId=${projectId}`;
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 60000,
      });

      // print-readyイベントを待つ
      await page.evaluateHandle(() => {
        return new Promise((resolve) => {
          if (window.dispatchEvent) {
            window.addEventListener('print-ready', resolve);
            // 既にreadyの場合
            const checkReady = () => {
              const images = document.querySelectorAll('img');
              const allLoaded = Array.from(images).every((img) => img.complete);
              if (allLoaded && document.fonts?.status === 'loaded') {
                resolve(undefined);
              }
            };
            checkReady();
          } else {
            // フォールバック: 3秒待つ
            setTimeout(resolve, 3000);
          }
        });
      });

      // 追加の待機時間（レンダリング完了を確実にする）
      await page.waitForTimeout(1000);

      // PDFを生成
      const pdf = await page.pdf({
        format: 'A3',
        landscape: true,
        printBackground: true,
        margin: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
        preferCSSPageSize: true,
        displayHeaderFooter: false,
      });

      // ファイル名を生成
      const fileName = `g-house-presentation-${projectId}-${new Date().toISOString().split('T')[0]}.pdf`;

      // PDFをレスポンスとして返す
      return new NextResponse(pdf, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Length': pdf.length.toString(),
        },
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('PDFエクスポートエラー:', error);
    return NextResponse.json({ error: 'PDFの生成に失敗しました' }, { status: 500 });
  }
}

// GETメソッドはサポートしない
export async function GET() {
  return NextResponse.json(
    { error: 'GETメソッドはサポートされていません。POSTを使用してください。' },
    { status: 405 }
  );
}
