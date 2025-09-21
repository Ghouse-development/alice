// components/PresentationPDF.tsx
import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'NotoSansJP',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'NotoSansJP',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 12,
    fontFamily: 'NotoSansJP',
    color: '#374151',
  },
  text: {
    fontSize: 12,
    lineHeight: 1.6,
    fontFamily: 'NotoSansJP',
    color: '#4b5563',
    marginBottom: 8,
  },
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9fafb',
  },
  itemTitle: {
    fontSize: 14,
    fontFamily: 'NotoSansJP',
    marginBottom: 5,
    color: '#1f2937',
  },
  itemText: {
    fontSize: 11,
    fontFamily: 'NotoSansJP',
    color: '#6b7280',
  },
  image: {
    maxWidth: 400,
    maxHeight: 300,
    marginVertical: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    fontSize: 10,
    fontFamily: 'NotoSansJP',
    color: '#9ca3af',
  },
});

interface PresentationPDFProps {
  data: any;
  images?: Record<string, string>;
}

export default function PresentationPDF({ data, images = {} }: PresentationPDFProps) {
  // フォント登録は SaveButton で事前に実行済み

  // データなしは空のDocumentを返す
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <Document />;
  }

  const slideData = Array.isArray(data) ? data : [data];

  return (
    <Document>
      {/* タイトルページ */}
      <Page size="A3" orientation="landscape" style={styles.page}>
        <View>
          <Text style={styles.title}>G-House プレゼンテーション</Text>
          <Text style={styles.text}>作成日: {new Date().toLocaleDateString('ja-JP')}</Text>
        </View>
      </Page>

      {/* 各スライドページ */}
      {slideData.map((slide, pageIndex) => (
        <Page key={pageIndex} size="A3" orientation="landscape" style={styles.page}>
          <View>
            {/* タイトル */}
            {slide.title && <Text style={styles.title}>{String(slide.title)}</Text>}

            {/* サブタイトル */}
            {slide.subtitle && <Text style={styles.subtitle}>{String(slide.subtitle)}</Text>}

            {/* コンテンツ */}
            {slide.content && (
              <View>
                {typeof slide.content === 'string' ? (
                  <Text style={styles.text}>{slide.content}</Text>
                ) : Array.isArray(slide.content) ? (
                  slide.content.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                      {item.title && <Text style={styles.itemTitle}>{String(item.title)}</Text>}
                      {item.description && (
                        <Text style={styles.itemText}>{String(item.description)}</Text>
                      )}
                    </View>
                  ))
                ) : null}
              </View>
            )}

            {/* 画像（dataURL形式をサポート） */}
            {slide.image && images[slide.image] && (
              <Image src={images[slide.image]} style={styles.image} />
            )}
          </View>

          {/* ページ番号 */}
          <Text style={styles.pageNumber}>
            {pageIndex + 1} / {slideData.length}
          </Text>
        </Page>
      ))}
    </Document>
  );
}
