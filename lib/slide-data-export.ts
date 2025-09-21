// 実際のスライドコンテンツをエクスポート用データに変換

export interface ExportSlideData {
  id: string;
  title: string;
  subtitle: string;
  sections?: {
    type: 'products' | 'grid' | 'stats' | 'list' | 'text';
    data: any;
  }[];
}

export function getExportSlideData(): ExportSlideData[] {
  return [
    // ①商品ラインナップ
    {
      id: 'product',
      title: '商品ラインナップ',
      subtitle: 'あなたのライフスタイルに最適な住まいを',
      sections: [
        {
          type: 'products',
          data: [
            { name: 'LIFE', price: '1,650万円〜', description: '豊かな暮らしをリーズナブルな価格で' },
            { name: 'LIFE+', price: '1,890万円〜', description: '洗練された暮らしをデザイン' },
            { name: 'HOURS', price: 'お問い合わせ', description: '家族の豊かな時間と心を育てる家' },
            { name: 'LACIE', price: 'お問い合わせ', description: '空間美と機能美で"上質"を彩る家' },
            { name: 'LIFE X', price: 'お問い合わせ', description: '規格住宅の常識を変える究極のデザイン' }
          ]
        },
        {
          type: 'stats',
          data: {
            title: '全商品共通の高性能仕様',
            items: [
              { label: '耐震等級3', value: '最高等級' },
              { label: 'Ua値0.46', value: 'HEAT20 G2' },
              { label: 'C値0.2', value: '高気密' },
              { label: '60年保証', value: '最長保証' }
            ]
          }
        }
      ]
    },
    // ②耐震性能
    {
      id: 'earthquake',
      title: '耐震性能',
      subtitle: '最先端技術で実現する究極の安全性',
      sections: [
        {
          type: 'grid',
          data: [
            { title: '許容応力度計算', description: 'A4用紙200枚以上の詳細構造計算を全棟実施' },
            { title: 'evoltz制振システム', description: 'ドイツBILSTEIN社製・地震エネルギーを40-50%吸収' }
          ]
        },
        {
          type: 'text',
          data: {
            title: 'WALLSTAT倒壊シミュレーション',
            content: '京大生研開発の最先端解析システムで個別にシミュレーション検証',
            points: [
              '阪神淡路大震災クラス対応',
              '熊本地震（震度7×2回）無被害'
            ]
          }
        },
        {
          type: 'stats',
          data: {
            items: [
              { label: '耐震等級3', value: '建築基準法の1.5倍' },
              { label: '40-50%', value: '地震エネルギー減衰' },
              { label: '震度7連続', value: '実大実験クリア' },
              { label: '1mm〜', value: '制振作動開始' }
            ]
          }
        }
      ]
    },
    // ③断熱・気密性能
    {
      id: 'insulation',
      title: '断熱・気密性能',
      subtitle: '世界トップクラスの性能で実現する快適空間',
      sections: [
        {
          type: 'stats',
          data: {
            items: [
              { label: 'Ua値 0.46', value: 'HEAT20 G2グレード', unit: 'W/㎡·K以下' },
              { label: 'C値 0.2', value: '超高気密', unit: '㎠/㎡以下' },
              { label: 'η値 1.0', value: '日射遮蔽率' }
            ]
          }
        },
        {
          type: 'text',
          data: {
            title: '体感温度の安定化',
            content: '輻射温度コントロールにより、エアコンの設定温度と体感温度の差を最小化',
            points: [
              '夏：27℃設定で快適',
              '冬：20℃設定で暖かい',
              '年間冷暖房費70%削減'
            ]
          }
        },
        {
          type: 'list',
          data: [
            '高性能樹脂サッシ（Uw値0.9）',
            'アルゴンガス入りトリプルガラス',
            'ネオマフォーム断熱材85mm',
            '全棟気密測定実施'
          ]
        }
      ]
    },
    // ④温熱環境
    {
      id: 'thermal',
      title: '温熱環境',
      subtitle: '健康と快適を実現する理想の温熱設計',
      sections: [
        {
          type: 'text',
          data: {
            title: '医学的根拠に基づく健康住宅',
            content: '室温18℃以上をキープし、ヒートショックリスクを90%削減',
            points: [
              '脱衣室・浴室の温度差2℃以内',
              '廊下・トイレも暖かい',
              '結露・カビの発生を防止'
            ]
          }
        },
        {
          type: 'stats',
          data: {
            title: '年間を通じた室温管理',
            items: [
              { label: '夏季室温', value: '25-27℃' },
              { label: '冬季室温', value: '20-22℃' },
              { label: '湿度', value: '40-60%' },
              { label: '温度差', value: '±2℃以内' }
            ]
          }
        }
      ]
    },
    // ⑤換気システム
    {
      id: 'ventilation',
      title: '換気システム',
      subtitle: '24時間クリーンで新鮮な空気環境',
      sections: [
        {
          type: 'text',
          data: {
            title: '第一種熱交換換気システム',
            content: '熱交換効率90%で省エネと快適性を両立'
          }
        },
        {
          type: 'list',
          data: [
            'PM2.5を98%除去',
            '花粉を99%カット',
            'CO2濃度1000ppm以下',
            'ホルムアルデヒド濃度0.08ppm以下',
            '全熱交換で湿度もコントロール'
          ]
        },
        {
          type: 'stats',
          data: {
            items: [
              { label: '換気回数', value: '0.5回/h' },
              { label: '熱回収率', value: '90%' },
              { label: 'フィルター性能', value: 'MERV13' }
            ]
          }
        }
      ]
    },
    // ⑥太陽光・蓄電池
    {
      id: 'solar',
      title: '太陽光・蓄電池',
      subtitle: 'エネルギー自給自足を実現',
      sections: [
        {
          type: 'stats',
          data: {
            title: '創エネ・蓄エネシステム',
            items: [
              { label: '太陽光発電', value: '6.5kW標準' },
              { label: '蓄電池', value: '7.04kWh' },
              { label: '年間発電量', value: '約7,800kWh' },
              { label: '売電収入', value: '月1.5万円' }
            ]
          }
        },
        {
          type: 'text',
          data: {
            title: 'V2H対応',
            content: '電気自動車との連携で災害時も安心',
            points: [
              '停電時も3日間生活可能',
              'EV充電コスト80%削減',
              'スマートグリッド対応'
            ]
          }
        }
      ]
    },
    // ⑦保証・メンテナンス
    {
      id: 'warranty',
      title: '保証・メンテナンス',
      subtitle: '業界最長の安心保証システム',
      sections: [
        {
          type: 'grid',
          data: [
            { title: '初期保証30年', description: '構造躯体・防水' },
            { title: '延長保証60年', description: '有償メンテナンス実施で' },
            { title: '設備保証10年', description: '住宅設備機器' },
            { title: '24時間365日', description: '緊急対応サービス' }
          ]
        },
        {
          type: 'list',
          data: [
            '定期点検：3ヶ月/1年/2年/5年/10年/15年/20年/25年/30年',
            '点検項目：326項目',
            'メンテナンスファイル管理',
            'オンライン相談対応'
          ]
        }
      ]
    },
    // ⑧施工品質
    {
      id: 'construction',
      title: '施工品質',
      subtitle: '職人の技術とテクノロジーの融合',
      sections: [
        {
          type: 'text',
          data: {
            title: '自社施工体制',
            content: '専属大工による責任施工',
            points: [
              '平均経験年数15年以上',
              '技能検定1級保有率80%',
              '年間施工研修40時間以上'
            ]
          }
        },
        {
          type: 'list',
          data: [
            '第三者検査機関による10回検査',
            '全工程写真記録（平均2000枚）',
            'お客様立会い検査5回',
            '施工精度±3mm以内'
          ]
        }
      ]
    },
    // ⑨標準設備
    {
      id: 'equipment',
      title: '標準設備',
      subtitle: '最高級の設備を標準仕様で',
      sections: [
        {
          type: 'grid',
          data: [
            { title: 'キッチン', description: 'LIXIL リシェルSI / 食洗機・IH標準' },
            { title: 'バスルーム', description: 'TOTO サザナ1.25坪 / ほっカラリ床' },
            { title: 'トイレ', description: 'TOTO ネオレスト / 自動洗浄・除菌' },
            { title: '洗面台', description: 'LIXIL ルミシス / W900三面鏡' }
          ]
        },
        {
          type: 'list',
          data: [
            '全館空調システム',
            '床暖房（LDK標準）',
            'IoT対応設備',
            'EV充電用コンセント'
          ]
        }
      ]
    },
    // ⑩会社紹介
    {
      id: 'company',
      title: '会社紹介',
      subtitle: 'G-HOUSEが選ばれる理由',
      sections: [
        {
          type: 'stats',
          data: {
            title: '実績と信頼',
            items: [
              { label: '創業', value: '1985年' },
              { label: '施工実績', value: '3,500棟以上' },
              { label: '顧客満足度', value: '98.5%' },
              { label: '紹介率', value: '65%' }
            ]
          }
        },
        {
          type: 'list',
          data: [
            'グッドデザイン賞 5年連続受賞',
            'ハウス・オブ・ザ・イヤー 3回受賞',
            'SDGs取組企業認定',
            'ZEHビルダー最高評価'
          ]
        },
        {
          type: 'text',
          data: {
            title: '経営理念',
            content: '「100年快適に住み継がれる家づくり」を通じて、お客様の幸せな暮らしを実現します'
          }
        }
      ]
    }
  ];
}