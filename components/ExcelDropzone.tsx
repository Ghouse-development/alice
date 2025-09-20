'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, Settings, Check } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Cell configuration for extraction
interface CellConfig {
  label: string;
  cell: string;
  formula?: string;
  defaultValue?: number | string;
  type?: 'number' | 'string';
}

interface ExcelData {
  本体: number;
  付帯A: number;
  付帯B: number;
  オプション費用: number;
  付帯C: number;
  消費税: number;
  合計: number;
  外構工事: number;
  土地費用: number;
  諸費用: number;
  総額: number;
  自己資金: number;
  借入金額: number;
  金利: number;
  借入年数: number;
  商品名?: string;
  坪数?: number;
  階数?: string;
}

interface ExcelDropzoneProps {
  onDataExtracted: (data: ExcelData) => void;
}

export default function ExcelDropzone({ onDataExtracted }: ExcelDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [extractedData, setExtractedData] = useState<ExcelData | null>(null);
  const [sheetName, setSheetName] = useState('資金計画書');
  const [showConfig, setShowConfig] = useState(false);

  // Cell configurations (can be edited by user)
  const [cellConfig, setCellConfig] = useState<Record<string, CellConfig>>({
    本体: { label: '本体', cell: 'AG26', defaultValue: 0, type: 'number' },
    付帯A: { label: '付帯A', cell: 'AG31', defaultValue: 0, type: 'number' },
    付帯B: { label: '付帯B', cell: 'AG44', defaultValue: 0, type: 'number' },
    オプション費用: { label: 'オプション費用', cell: 'AI54', defaultValue: 0, type: 'number' },
    付帯C: { label: '付帯C', cell: 'AG57', defaultValue: 0, type: 'number' },
    消費税: { label: '消費税', cell: 'AG75', defaultValue: 0, type: 'number' },
    合計: { label: '合計', cell: 'AF77', defaultValue: 0, type: 'number' },
    外構工事: { label: '外構工事', cell: 'O94+O96', formula: 'O94+O96', defaultValue: 0, type: 'number' },
    土地費用: { label: '土地費用', cell: 'AI82', defaultValue: 0, type: 'number' },
    諸費用: { label: '諸費用', cell: 'M80+AG80-O94-O96-AI82', formula: 'M80+AG80-O94-O96-AI82', defaultValue: 0, type: 'number' },
    総額: { label: '総額', cell: 'AF102', defaultValue: 0, type: 'number' },
    自己資金: { label: '自己資金', cell: 'CC28', defaultValue: 0, type: 'number' },
    借入金額: { label: '借入金額', cell: 'BA33', defaultValue: 0, type: 'number' },
    金利: { label: '金利', cell: 'BG77', defaultValue: 0, type: 'number' },
    借入年数: { label: '借入年数', cell: 'BO33', defaultValue: 35, type: 'number' },
    商品名: { label: '商品名', cell: 'N1', defaultValue: '', type: 'string' },
    坪数: { label: '坪数', cell: 'CA1', defaultValue: 0, type: 'number' },
    階数: { label: '階数', cell: 'CJ1', defaultValue: '', type: 'string' },
  });

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const extractCellValue = (worksheet: XLSX.WorkSheet, cellAddress: string, type: string = 'number'): any => {
    const cell = worksheet[cellAddress];
    if (!cell) return type === 'string' ? '' : 0;

    if (type === 'string') {
      return String(cell.v || '');
    }

    if (typeof cell.v === 'number') {
      return cell.v;
    }
    if (typeof cell.v === 'string') {
      const num = parseFloat(cell.v.replace(/[,￥¥]/g, ''));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const evaluateFormula = (worksheet: XLSX.WorkSheet, formula: string): number => {
    // Simple formula evaluation for addition and subtraction
    const parts = formula.split(/([+-])/);
    let result = 0;
    let operation = '+';

    for (const part of parts) {
      if (part === '+' || part === '-') {
        operation = part;
      } else if (part.trim()) {
        const value = extractCellValue(worksheet, part.trim());
        if (operation === '+') {
          result += value;
        } else {
          result -= value;
        }
      }
    }

    return result;
  };

  const processExcelFile = useCallback((file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });

        // Find the target sheet
        let worksheet = workbook.Sheets[sheetName];

        // If sheet not found, try the first sheet
        if (!worksheet && workbook.SheetNames.length > 0) {
          worksheet = workbook.Sheets[workbook.SheetNames[0]];
          console.warn(`シート「${sheetName}」が見つかりません。「${workbook.SheetNames[0]}」を使用します。`);
        }

        if (!worksheet) {
          alert('Excelファイルにシートが見つかりません。');
          return;
        }

        // Extract data based on cell configuration
        const extracted: ExcelData = {
          本体: 0,
          付帯A: 0,
          付帯B: 0,
          オプション費用: 0,
          付帯C: 0,
          消費税: 0,
          合計: 0,
          外構工事: 0,
          土地費用: 0,
          諸費用: 0,
          総額: 0,
          自己資金: 0,
          借入金額: 0,
          金利: 0,
          借入年数: 35,
          商品名: '',
          坪数: 0,
          階数: '',
        };

        // Extract each configured cell
        Object.entries(cellConfig).forEach(([key, config]) => {
          if (config.formula) {
            extracted[key as keyof ExcelData] = evaluateFormula(worksheet, config.formula) as any;
          } else {
            const value = extractCellValue(worksheet, config.cell, config.type);
            extracted[key as keyof ExcelData] = value || config.defaultValue || (config.type === 'string' ? '' : 0) as any;
          }
        });

        setExtractedData(extracted);
        setFileName(file.name);
        onDataExtracted(extracted);

      } catch (error) {
        console.error('Error processing Excel file:', error);
        alert('Excelファイルの処理中にエラーが発生しました。');
      }
    };

    reader.readAsArrayBuffer(file);
  }, [sheetName, cellConfig, onDataExtracted]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.match(/\.(xlsx|xls|xlsm)$/i)) {
        processExcelFile(file);
      } else {
        alert('Excel形式のファイル（.xlsx, .xls, .xlsm）をアップロードしてください。');
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.match(/\.(xlsx|xls|xlsm)$/i)) {
        processExcelFile(file);
      } else {
        alert('Excel形式のファイル（.xlsx, .xls, .xlsm）をアップロードしてください。');
      }
    }
  };

  const updateCellConfig = (key: string, field: keyof CellConfig, value: string) => {
    setCellConfig(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      }
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Excel資金計画書インポート</CardTitle>
        <CardDescription>
          資金計画書のExcelファイルをドラッグ＆ドロップするか、クリックして選択してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-blue-500 bg-blue-50 scale-[1.02]'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('excel-upload')?.click()}
        >
          <input
            id="excel-upload"
            type="file"
            accept=".xlsx,.xls,.xlsm"
            onChange={handleFileInput}
            className="hidden"
          />

          {fileName ? (
            <div className="space-y-2">
              <Check className="w-12 h-12 mx-auto text-green-600" />
              <p className="text-lg font-medium text-green-600">インポート完了</p>
              <p className="text-sm text-gray-600">{fileName}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {isDragging ? (
                <FileSpreadsheet className="w-16 h-16 mx-auto text-blue-500" />
              ) : (
                <Upload className="w-16 h-16 mx-auto text-gray-400" />
              )}
              <p className="text-lg font-medium text-gray-700">
                {isDragging ? 'ここにドロップ' : 'Excelファイルをドロップまたはクリック'}
              </p>
              <p className="text-sm text-gray-500">
                対応形式: .xlsx, .xls, .xlsm
              </p>
            </div>
          )}
        </div>

        {/* Configuration Section */}
        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="config">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>セル設定</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sheet-name">シート名</Label>
                  <Input
                    id="sheet-name"
                    value={sheetName}
                    onChange={(e) => setSheetName(e.target.value)}
                    placeholder="資金計画書"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(cellConfig).map(([key, config]) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-xs">{config.label}</Label>
                      <Input
                        value={config.formula || config.cell}
                        onChange={(e) => updateCellConfig(key, config.formula ? 'formula' : 'cell', e.target.value)}
                        placeholder="セル番地"
                        className="h-8 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Extracted Data Preview */}
        {extractedData && (
          <div className="mt-6 space-y-4">
            <h3 className="font-medium text-sm text-gray-700">抽出データ</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(extractedData).map(([key, value]) => (
                <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">{cellConfig[key]?.label || key}:</span>
                  <span className="font-medium">
                    {key === '商品名'
                      ? value
                      : key === '坪数'
                      ? `${value}坪`
                      : key === '金利'
                      ? `${(value as number).toFixed(2)}%`
                      : key === '借入年数'
                      ? `${value}年`
                      : `¥${(value as number).toLocaleString()}`
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}