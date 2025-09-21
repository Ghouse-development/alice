'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { getComprehensivePresentationData } from '@/lib/comprehensive-slide-export';

// A3横向き用のスタイル
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'NotoSansJP',
    backgroundColor: '#ffffff',
  },
  coverPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverTitle: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1a1a1a',
  },
  coverSubtitle: {
    fontSize: 32,
    color: '#666666',
    marginBottom: 60,
  },
  coverDate: {
    fontSize: 20,
    color: '#999999',
  },
  slideContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  slideTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  slideSubtitle: {
    fontSize: 28,
    color: '#666666',
    marginBottom: 40,
    textAlign: 'center',
  },
  contentArea: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2d2d2d',
  },
  productGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 30,
  },
  productCard: {
    width: '18%',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    border: '1px solid #e0e0e0',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1a1a1a',
  },
  productPrice: {
    fontSize: 16,
    color: '#c41e3a',
    marginBottom: 5,
  },
  productDesc: {
    fontSize: 12,
    color: '#666666',
  },
  specGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 20,
  },
  specItem: {
    width: '22%',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    textAlign: 'center',
  },
  specLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  specValue: {
    fontSize: 14,
    color: '#666666',
  },
  featureList: {
    marginTop: 20,
  },
  featureItem: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
    paddingLeft: 20,
  },
  comparisonTable: {
    marginTop: 20,
    border: '1px solid #ddd',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid #ddd',
  },
  tableHeader: {
    width: '30%',
    padding: 10,
    backgroundColor: '#f5f5f5',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tableCell: {
    width: '35%',
    padding: 10,
    fontSize: 14,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 50,
    fontSize: 12,
    color: '#999999',
  },
  sectionDivider: {
    marginTop: 30,
    marginBottom: 30,
    height: 1,
    backgroundColor: '#e0e0e0',
  }
});

export default function ComprehensivePresentationPDF() {
  const data = getComprehensivePresentationData();
  let pageNumber = 0;

  const renderContent = (content: any, type: string) => {
    switch (type) {
      case 'products':
        return (
          <View>
            <View style={styles.productGrid}>
              {content.products?.map((product: any, idx: number) => (
                <View key={idx} style={styles.productCard}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                  <Text style={styles.productDesc}>{product.description}</Text>
                </View>
              ))}
            </View>
            {content.specs && (
              <View style={styles.specGrid}>
                {Object.entries(content.specs).map(([key, value], idx) => (
                  <View key={idx} style={styles.specItem}>
                    <Text style={styles.specLabel}>{key}</Text>
                    <Text style={styles.specValue}>{value as string}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );

      case 'performance':
      case 'energy':
      case 'service':
      case 'quality':
        return (
          <View>
            {content.main && (
              <Text style={{ fontSize: 18, marginBottom: 20, lineHeight: 1.6 }}>
                {content.main}
              </Text>
            )}
            {content.features && (
              <View style={styles.featureList}>
                {content.features.map((feature: string, idx: number) => (
                  <Text key={idx} style={styles.featureItem}>• {feature}</Text>
                ))}
              </View>
            )}
            {content.specs && (
              <View style={styles.specGrid}>
                {Object.entries(content.specs).map(([key, value], idx) => (
                  <View key={idx} style={styles.specItem}>
                    <Text style={styles.specLabel}>{key}</Text>
                    <Text style={styles.specValue}>{value as string}</Text>
                  </View>
                ))}
              </View>
            )}
            {content.system && typeof content.system === 'string' && (
              <Text style={{ fontSize: 20, marginBottom: 20, fontWeight: 'bold' }}>
                {content.system}
              </Text>
            )}
            {content.system && typeof content.system === 'object' && (
              <View style={styles.specGrid}>
                {Object.entries(content.system).map(([key, value], idx) => (
                  <View key={idx} style={styles.specItem}>
                    <Text style={styles.specLabel}>{key}</Text>
                    <Text style={styles.specValue}>{value as string}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );

      case 'options':
        return (
          <View>
            {content.categories?.map((category: any, idx: number) => (
              <View key={idx} style={{ marginBottom: 25 }}>
                <Text style={styles.sectionTitle}>{category.name}</Text>
                <View style={styles.featureList}>
                  {category.items.map((item: string, itemIdx: number) => (
                    <Text key={itemIdx} style={styles.featureItem}>• {item}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        );

      case 'simulation':
      case 'maintenance':
        return (
          <View>
            {content.comparison && (
              <View>
                <Text style={styles.sectionTitle}>比較</Text>
                {Object.entries(content.comparison).map(([key, value], idx) => (
                  <View key={idx} style={{ marginBottom: 15 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>
                      {key}
                    </Text>
                    {typeof value === 'object' ? (
                      <View style={{ paddingLeft: 20 }}>
                        {Object.entries(value).map(([k, v], i) => (
                          <Text key={i} style={{ fontSize: 14, marginBottom: 3 }}>
                            {k}: {v as string}
                          </Text>
                        ))}
                      </View>
                    ) : (
                      <Text style={{ fontSize: 16, paddingLeft: 20 }}>{value}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
            {content.schedule && (
              <View style={{ marginTop: 30 }}>
                <Text style={styles.sectionTitle}>メンテナンススケジュール</Text>
                {Object.entries(content.schedule).map(([period, details]: [string, any], idx) => (
                  <View key={idx} style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>
                      {period}
                    </Text>
                    <View style={{ paddingLeft: 20 }}>
                      <Text style={{ fontSize: 14 }}>点検: {details.点検}</Text>
                      <Text style={{ fontSize: 14 }}>メンテナンス: {details.メンテナンス}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        );

      default:
        return (
          <View>
            <Text style={{ fontSize: 16 }}>{JSON.stringify(content, null, 2)}</Text>
          </View>
        );
    }
  };

  return (
    <Document>
      {/* 表紙 */}
      <Page size="A3" orientation="landscape" style={styles.page}>
        <View style={styles.coverPage}>
          <Text style={styles.coverTitle}>G-HOUSE プレゼンテーション</Text>
          <Text style={styles.coverSubtitle}>高性能住宅のご提案</Text>
          <Text style={styles.coverDate}>
            作成日: {new Date().toLocaleDateString('ja-JP')}
          </Text>
        </View>
      </Page>

      {/* 各セクションのスライド */}
      {data.map((section) =>
        section.slides.map((slide, slideIdx) => {
          pageNumber++;
          return (
            <Page key={`${section.section}-${slideIdx}`} size="A3" orientation="landscape" style={styles.page}>
              <View style={styles.slideContainer}>
                <Text style={styles.slideTitle}>{slide.title}</Text>
                {slide.subtitle && (
                  <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
                )}

                <View style={styles.contentArea}>
                  {renderContent(slide.content, slide.type)}
                </View>
              </View>

              <Text style={styles.pageNumber}>
                {pageNumber} / {data.reduce((sum, s) => sum + s.slides.length, 0)}
              </Text>
            </Page>
          );
        })
      )}
    </Document>
  );
}