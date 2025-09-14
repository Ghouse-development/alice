'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, FileText, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MasterIndexPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            ダッシュボードに戻る
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">マスタ管理</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/master')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              オプションマスタ
            </CardTitle>
            <CardDescription>
              オプション項目と価格の管理
            </CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/admin/presentation2')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              プレゼン2 コンテンツ管理
            </CardTitle>
            <CardDescription>
              住宅性能説明スライドの内容管理
            </CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer opacity-50 pointer-events-none"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              顧客マスタ
            </CardTitle>
            <CardDescription>
              顧客情報の管理（準備中）
            </CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer opacity-50 pointer-events-none"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              システム設定
            </CardTitle>
            <CardDescription>
              システム全体の設定（準備中）
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}