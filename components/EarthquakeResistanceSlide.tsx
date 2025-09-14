'use client';

import { ExternalLink } from 'lucide-react';

export function EarthquakeResistanceSlide() {
  return (
    <div className="w-full h-full bg-white" style={{ width: '100%', height: '100%', fontFamily: 'Noto Sans JP, sans-serif' }}>
      <div className="h-full overflow-hidden relative pt-2.5">
        {/* Main Title */}
        <h1 className="text-2xl font-black px-6 py-1 tracking-wide text-left mb-0">
          EARTHQUAKE RESISTANCE
        </h1>

        {/* Top Row - Large Points */}
        <div className="grid grid-cols-2 gap-5 px-6 mb-5">
          {/* Point 01 - evoltz */}
          <div className="rounded bg-white shadow-md overflow-hidden flex flex-col relative" style={{ height: '440px' }}>
            <div className="relative overflow-hidden" style={{ height: '380px' }}>
              <img
                src="https://page.gensparksite.com/slides_images/34595eba74194a28cd0fb37de69cff92.png"
                alt="制振ダンパーevoltz"
                className="w-full h-full object-contain bg-white"
              />
            </div>
            <div className="p-3 bg-white flex-1 relative">
              <div className="flex items-center mb-2 border-b border-gray-300 pb-1.5">
                <div className="flex flex-col mr-2.5">
                  <div className="text-sm font-bold text-black uppercase">POINT</div>
                  <div className="text-3xl font-black text-black leading-none">01</div>
                </div>
                <div className="text-base font-bold text-black mt-1">制振ダンパー evoltz</div>
              </div>
              <div className="text-sm font-normal text-black leading-tight mb-1.5">
                揺れを抑え、建物を守る。
              </div>
              <div className="text-xs font-normal text-blue-600 mt-0.5 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="text-blue-600 font-semibold">▶</span> 世界最高品質のダンパーで長期安心。
              </div>
              <div className="absolute top-3 right-3 w-6 h-6 bg-black bg-opacity-10 rounded flex items-center justify-center text-gray-900">
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Point 02 - Wallstat */}
          <div className="rounded bg-white shadow-md overflow-hidden flex flex-col relative" style={{ height: '440px' }}>
            <div className="relative overflow-hidden" style={{ height: '380px' }}>
              <img
                src="https://page.gensparksite.com/slides_images/49d94249226f91ae496224aa4e93e686.png"
                alt="Wallstat"
                className="w-full h-full object-contain bg-white"
              />
            </div>
            <div className="p-3 bg-white flex-1 relative">
              <div className="flex items-center mb-2 border-b border-gray-300 pb-1.5">
                <div className="flex flex-col mr-2.5">
                  <div className="text-sm font-bold text-black uppercase">POINT</div>
                  <div className="text-3xl font-black text-black leading-none">02</div>
                </div>
                <div className="text-base font-bold text-black mt-1">時刻歴応答解析 Wallstat</div>
              </div>
              <div className="text-sm font-normal text-black leading-tight mb-1.5">
                モデルプランで強さを検証。
              </div>
              <div className="text-xs font-normal text-blue-600 mt-0.5 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="text-blue-600 font-semibold">▶</span> 巨大地震を想定したシミュレーションで実証。
              </div>
              <div className="absolute top-3 right-3 w-6 h-6 bg-black bg-opacity-10 rounded flex items-center justify-center text-gray-900">
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Small Points */}
        <div className="grid grid-cols-2 gap-5 px-6">
          {/* Point 03 - 許容応力度計算 */}
          <div className="rounded bg-white shadow-md overflow-hidden flex flex-row relative" style={{ height: '270px' }}>
            <div className="relative overflow-hidden" style={{ width: '55%', height: '270px' }}>
              <img
                src="https://page.gensparksite.com/slides_images/cddd3ee0c4e9ce45039aab5118704fb5.png"
                alt="許容応力度計算"
                className="w-full h-full object-contain bg-white"
              />
            </div>
            <div className="p-3 bg-white flex-1 relative flex flex-col justify-end">
              <div className="flex items-center mb-2 border-b border-gray-300 pb-1.5">
                <div className="flex flex-col mr-2.5">
                  <div className="text-sm font-bold text-black uppercase">POINT</div>
                  <div className="text-3xl font-black text-black leading-none">03</div>
                </div>
                <div className="text-base font-bold text-black mt-1">許容応力度計算</div>
              </div>
              <div className="text-sm font-normal text-black leading-tight mb-1.5">
                緻密な計算で、精度ある強さ。
              </div>
              <div className="text-xs font-normal text-blue-600 mt-0.5 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="text-blue-600 font-semibold">▶</span> 全棟200ページ超の構造計算を実施。
              </div>
              <div className="absolute top-3 right-3 w-6 h-6 bg-black bg-opacity-10 rounded flex items-center justify-center text-gray-900">
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Point 04 - 耐震等級3 */}
          <div className="rounded bg-white shadow-md overflow-hidden flex flex-row relative" style={{ height: '270px' }}>
            <div className="relative overflow-hidden" style={{ width: '55%', height: '270px' }}>
              <img
                src="https://page.gensparksite.com/slides_images/c3e8404c096416ffa901735e4c483f34.jpg"
                alt="耐震等級3"
                className="w-full h-full object-contain bg-white"
              />
            </div>
            <div className="p-3 bg-white flex-1 relative flex flex-col justify-end">
              <div className="flex items-center mb-2 border-b border-gray-300 pb-1.5">
                <div className="flex flex-col mr-2.5">
                  <div className="text-sm font-bold text-black uppercase">POINT</div>
                  <div className="text-3xl font-black text-black leading-none">04</div>
                </div>
                <div className="text-base font-bold text-black mt-1">耐震等級3</div>
              </div>
              <div className="text-sm font-normal text-black leading-tight mb-1.5">
                最高等級の強度で暮らしを守る。
              </div>
              <div className="text-xs font-normal text-blue-600 mt-0.5 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="text-blue-600 font-semibold">▶</span> 耐震等級3＋地震保険割引50％。
              </div>
              <div className="absolute top-3 right-3 w-6 h-6 bg-black bg-opacity-10 rounded flex items-center justify-center text-gray-900">
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}