// 全プレゼンテーションの包括的なデータエクスポート

export interface ComprehensiveSlideData {
  section: string;
  slides: {
    title: string;
    subtitle?: string;
    content: any;
    type: string;
  }[];
}

export function getComprehensivePresentationData(): ComprehensiveSlideData[] {
  return [
    // 1. デザイン（複数枚可能）
    {
      section: 'デザイン',
      slides: [
        {
          title: 'デザインコンセプト',
          subtitle: 'お客様の理想を形に',
          content: {
            type: 'image_gallery',
            description: 'お客様のご要望に合わせたデザインをご提案いたします'
          },
          type: 'design'
        }
      ]
    },

    // 2. 標準仕様（GHousePresentationSlidesの10枚）
    {
      section: '標準仕様',
      slides: [
        {
          title: '商品ラインナップ',
          subtitle: 'あなたのライフスタイルに最適な住まいを',
          content: {
            products: [
              { name: 'LIFE', price: '1,650万円〜', description: '豊かな暮らしをリーズナブルな価格で' },
              { name: 'LIFE+', price: '1,890万円〜', description: '洗練された暮らしをデザイン' },
              { name: 'HOURS', price: 'お問い合わせ', description: '家族の豊かな時間と心を育てる家' },
              { name: 'LACIE', price: 'お問い合わせ', description: '空間美と機能美で"上質"を彩る家' },
              { name: 'LIFE X', price: 'お問い合わせ', description: '規格住宅の常識を変える究極のデザイン' }
            ],
            specs: {
              '耐震等級3': '最高等級',
              'Ua値0.46': 'HEAT20 G2',
              'C値0.2': '高気密',
              '60年保証': '最長保証'
            }
          },
          type: 'products'
        },
        {
          title: '耐震性能',
          subtitle: '最先端技術で実現する究極の安全性',
          content: {
            features: [
              '許容応力度計算: A4用紙200枚以上の詳細構造計算を全棟実施',
              'evoltz制振システム: ドイツBILSTEIN社製・地震エネルギーを40-50%吸収',
              'WALLSTAT倒壊シミュレーション: 京大生研開発の最先端解析システム'
            ],
            specs: {
              '耐震等級3': '建築基準法の1.5倍',
              '40-50%': '地震エネルギー減衰',
              '震度7連続': '実大実験クリア',
              '1mm〜': '制振作動開始'
            }
          },
          type: 'performance'
        },
        {
          title: '断熱・気密性能',
          subtitle: '世界トップクラスの性能で実現する快適空間',
          content: {
            specs: {
              'Ua値': '0.46 W/㎡·K (HEAT20 G2)',
              'C値': '0.2 ㎠/㎡ (超高気密)',
              'η値': '1.0 (日射遮蔽率)'
            },
            features: [
              '高性能樹脂サッシ（Uw値0.9）',
              'アルゴンガス入りトリプルガラス',
              'ネオマフォーム断熱材85mm',
              '全棟気密測定実施'
            ],
            benefits: {
              '夏': '27℃設定で快適',
              '冬': '20℃設定で暖かい',
              '削減率': '年間冷暖房費70%削減'
            }
          },
          type: 'performance'
        },
        {
          title: '温熱環境',
          subtitle: '健康と快適を実現する理想の温熱設計',
          content: {
            main: '医学的根拠に基づく健康住宅: 室温18℃以上をキープし、ヒートショックリスクを90%削減',
            features: [
              '脱衣室・浴室の温度差2℃以内',
              '廊下・トイレも暖かい',
              '結露・カビの発生を防止'
            ],
            specs: {
              '夏季室温': '25-27℃',
              '冬季室温': '20-22℃',
              '湿度': '40-60%',
              '温度差': '±2℃以内'
            }
          },
          type: 'performance'
        },
        {
          title: '換気システム',
          subtitle: '24時間クリーンで新鮮な空気環境',
          content: {
            system: '第一種熱交換換気システム（熱交換効率90%）',
            performance: [
              'PM2.5を98%除去',
              '花粉を99%カット',
              'CO2濃度1000ppm以下',
              'ホルムアルデヒド濃度0.08ppm以下',
              '全熱交換で湿度もコントロール'
            ],
            specs: {
              '換気回数': '0.5回/h',
              '熱回収率': '90%',
              'フィルター': 'MERV13'
            }
          },
          type: 'performance'
        },
        {
          title: '太陽光・蓄電池',
          subtitle: 'エネルギー自給自足を実現',
          content: {
            system: {
              '太陽光発電': '6.5kW標準',
              '蓄電池': '7.04kWh',
              '年間発電量': '約7,800kWh',
              '売電収入': '月1.5万円'
            },
            v2h: {
              title: 'V2H対応',
              features: [
                '停電時も3日間生活可能',
                'EV充電コスト80%削減',
                'スマートグリッド対応'
              ]
            }
          },
          type: 'energy'
        },
        {
          title: '保証・メンテナンス',
          subtitle: '業界最長の安心保証システム',
          content: {
            warranty: {
              '初期保証30年': '構造躯体・防水',
              '延長保証60年': '有償メンテナンス実施で',
              '設備保証10年': '住宅設備機器',
              '24時間365日': '緊急対応サービス'
            },
            inspection: [
              '定期点検: 3ヶ月/1年/2年/5年/10年/15年/20年/25年/30年',
              '点検項目: 326項目',
              'メンテナンスファイル管理',
              'オンライン相談対応'
            ]
          },
          type: 'service'
        },
        {
          title: '施工品質',
          subtitle: '職人の技術とテクノロジーの融合',
          content: {
            system: '自社施工体制（専属大工による責任施工）',
            quality: {
              '平均経験年数': '15年以上',
              '技能検定1級': '保有率80%',
              '年間施工研修': '40時間以上'
            },
            inspection: [
              '第三者検査機関による10回検査',
              '全工程写真記録（平均2000枚）',
              'お客様立会い検査5回',
              '施工精度±3mm以内'
            ]
          },
          type: 'quality'
        },
        {
          title: '標準設備',
          subtitle: '最高級の設備を標準仕様で',
          content: {
            equipment: {
              'キッチン': 'LIXIL リシェルSI / 食洗機・IH標準',
              'バスルーム': 'TOTO サザナ1.25坪 / ほっカラリ床',
              'トイレ': 'TOTO ネオレスト / 自動洗浄・除菌',
              '洗面台': 'LIXIL ルミシス / W900三面鏡'
            },
            standard: [
              '全館空調システム',
              '床暖房（LDK標準）',
              'IoT対応設備',
              'EV充電用コンセント'
            ]
          },
          type: 'equipment'
        },
        {
          title: '会社紹介',
          subtitle: 'G-HOUSEが選ばれる理由',
          content: {
            achievement: {
              '創業': '1985年',
              '施工実績': '3,500棟以上',
              '顧客満足度': '98.5%',
              '紹介率': '65%'
            },
            awards: [
              'グッドデザイン賞 5年連続受賞',
              'ハウス・オブ・ザ・イヤー 3回受賞',
              'SDGs取組企業認定',
              'ZEHビルダー最高評価'
            ],
            philosophy: '「100年快適に住み継がれる家づくり」を通じて、お客様の幸せな暮らしを実現します'
          },
          type: 'company'
        }
      ]
    },

    // 3. オプション項目
    {
      section: 'オプション項目',
      slides: [
        {
          title: 'オプション選択',
          subtitle: 'お客様のご要望に合わせたカスタマイズ',
          content: {
            categories: [
              {
                name: '外装オプション',
                items: ['タイル外壁', 'バルコニー拡張', '太陽光パネル増設']
              },
              {
                name: '内装オプション',
                items: ['無垢フローリング', '造作家具', 'アクセントウォール']
              },
              {
                name: '設備オプション',
                items: ['床暖房追加', '浴室TV', 'ミストサウナ']
              },
              {
                name: 'スマートホーム',
                items: ['全館IoT化', 'セキュリティ強化', '音声制御システム']
              }
            ]
          },
          type: 'options'
        }
      ]
    },

    // 4. 資金計画
    {
      section: '資金計画',
      slides: [
        {
          title: '資金計画',
          subtitle: 'お客様に最適な資金プランをご提案',
          content: {
            breakdown: {
              '建物本体価格': '詳細はお見積りにて',
              '付帯工事費': '詳細はお見積りにて',
              '諸経費': '詳細はお見積りにて'
            },
            financing: [
              '住宅ローン相談',
              '補助金・減税制度のご案内',
              'ライフプランシミュレーション'
            ]
          },
          type: 'funding'
        }
      ]
    },

    // 5. 光熱費シミュレーション
    {
      section: '光熱費シミュレーション',
      slides: [
        {
          title: '光熱費シミュレーション',
          subtitle: '30年間の経済効果を試算',
          content: {
            comparison: {
              '一般住宅': {
                '年間光熱費': '24万円',
                '30年合計': '720万円'
              },
              'G-HOUSE G2仕様': {
                '年間光熱費': '20万円',
                '30年合計': '600万円',
                '削減額': '120万円'
              },
              'G-HOUSE G3仕様': {
                '年間光熱費': '14万円',
                '30年合計': '420万円',
                '削減額': '300万円'
              }
            },
            solarBenefit: {
              '太陽光発電': '年間8万円の売電収入',
              '蓄電池': '災害時の安心',
              'V2H': 'EV充電コスト削減'
            }
          },
          type: 'simulation'
        }
      ]
    },

    // 6. メンテナンスコスト
    {
      section: 'メンテナンスコスト',
      slides: [
        {
          title: 'メンテナンスコスト',
          subtitle: '長期的な維持管理費用の試算',
          content: {
            schedule: {
              '10年目': {
                '点検': '無償',
                'メンテナンス': '防蟻処理（約10万円）'
              },
              '20年目': {
                '点検': '無償',
                'メンテナンス': '外壁塗装・防水（約150万円）'
              },
              '30年目': {
                '点検': '無償',
                'メンテナンス': '設備更新（約200万円）'
              }
            },
            comparison: {
              '一般住宅': '30年で約600万円',
              'G-HOUSE': '30年で約360万円',
              '削減額': '約240万円'
            },
            support: [
              'メンテナンスファンド制度',
              '定期点検無償',
              '緊急対応24時間365日'
            ]
          },
          type: 'maintenance'
        }
      ]
    }
  ];
}