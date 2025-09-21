'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { getExportSlideData } from '@/lib/slide-data-export';

// スタイル定義
const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: 'NotoSansJP',
    backgroundColor: '#ffffff',
  },
  slideContainer: {
    height: '100%',
    padding: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2d2d2d',
  },
  productGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  productCard: {
    width: '18%',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    border: '2px solid #e0e0e0',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  productPrice: {
    fontSize: 18,
    color: '#c41e3a',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#666666',
  },
  statsGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  statItem: {
    width: '22%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    color: '#666666',
  },
  gridItem: {
    marginBottom: 15,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  gridTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2d2d2d',
  },
  gridDescription: {
    fontSize: 16,
    color: '#666666',
  },
  textContent: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 15,
    lineHeight: 1.6,
  },
  listItem: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
    paddingLeft: 20,
  },
  pointsList: {
    marginTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    fontSize: 10,
    color: '#999999',
  },
});

interface PresentationPDFSlidesProps {
  data?: any;
}

export default function PresentationPDFSlides({ data }: PresentationPDFSlidesProps) {
  const slides = getExportSlideData();

  const renderSection = (section: any) => {
    switch (section.type) {
      case 'products':
        return (
          <View style={styles.section}>
            <View style={styles.productGrid}>
              {section.data.map((product: any, idx: number) => (
                <View key={idx} style={styles.productCard}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                  <Text style={styles.productDescription}>{product.description}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'stats':
        return (
          <View style={styles.section}>
            {section.data.title && (
              <Text style={styles.sectionTitle}>{section.data.title}</Text>
            )}
            <View style={styles.statsGrid}>
              {section.data.items.map((stat: any, idx: number) => (
                <View key={idx} style={styles.statItem}>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  {stat.unit && <Text style={styles.statValue}>{stat.unit}</Text>}
                </View>
              ))}
            </View>
          </View>
        );

      case 'grid':
        return (
          <View style={styles.section}>
            {section.data.map((item: any, idx: number) => (
              <View key={idx} style={styles.gridItem}>
                <Text style={styles.gridTitle}>{item.title}</Text>
                <Text style={styles.gridDescription}>{item.description}</Text>
              </View>
            ))}
          </View>
        );

      case 'text':
        return (
          <View style={styles.section}>
            {section.data.title && (
              <Text style={styles.sectionTitle}>{section.data.title}</Text>
            )}
            {section.data.content && (
              <Text style={styles.textContent}>{section.data.content}</Text>
            )}
            {section.data.points && (
              <View style={styles.pointsList}>
                {section.data.points.map((point: string, idx: number) => (
                  <Text key={idx} style={styles.listItem}>• {point}</Text>
                ))}
              </View>
            )}
          </View>
        );

      case 'list':
        return (
          <View style={styles.section}>
            {section.data.map((item: string, idx: number) => (
              <Text key={idx} style={styles.listItem}>• {item}</Text>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Document>
      {/* 表紙 */}
      <Page size="A3" orientation="landscape" style={styles.page}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 30 }}>
            G-HOUSE プレゼンテーション
          </Text>
          <Text style={{ fontSize: 36, color: '#666666' }}>
            高性能住宅のご提案
          </Text>
          <Text style={{ fontSize: 24, color: '#999999', marginTop: 60 }}>
            作成日: {new Date().toLocaleDateString('ja-JP')}
          </Text>
        </View>
      </Page>

      {/* 各スライド */}
      {slides.map((slide, index) => (
        <Page key={slide.id} size="A3" orientation="landscape" style={styles.page}>
          <View style={styles.slideContainer}>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>

            {slide.sections?.map((section, sIdx) => (
              <View key={sIdx}>
                {renderSection(section)}
              </View>
            ))}
          </View>

          <Text style={styles.pageNumber}>
            {index + 1} / {slides.length}
          </Text>
        </Page>
      ))}
    </Document>
  );
}