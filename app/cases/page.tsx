'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Plus, Filter, TrendingUp, Users, Home, Zap } from 'lucide-react';
import { getCustomers, searchCustomers } from '@/lib/sheets';
import { estimateHVACCapacity } from '@/lib/hvac';
import type { Customer, CaseSearchFilter, ProgressTag } from '@/types/domain';

// ダミーの進捗タグデータ（実際はAPIから取得）
const getDummyProgressTags = (customerId: string): ProgressTag[] => {
  const tags: ProgressTag[] = ['根拠準備', '実績提示'];

  if (customerId.includes('001') || customerId.includes('002')) {
    tags.push('負荷計算', '太陽光試算');
  }
  if (customerId.includes('001')) {
    tags.push('スクリプトOK');
  }

  return tags;
};

// 進捗タグの色
const getTagColor = (tag: ProgressTag) => {
  switch (tag) {
    case '根拠準備':
      return 'bg-blue-100 text-blue-800';
    case '実績提示':
      return 'bg-green-100 text-green-800';
    case '負荷計算':
      return 'bg-purple-100 text-purple-800';
    case '太陽光試算':
      return 'bg-yellow-100 text-yellow-800';
    case 'スクリプトOK':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function CasesPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState<CaseSearchFilter>({});

  // 統計データ
  const [stats, setStats] = useState({
    totalCases: 0,
    completedCases: 0,
    avgUA: 0,
    avgCValue: 0,
  });

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
        setFilteredCustomers(data);

        // 統計データの計算
        const totalCases = data.length;
        const completedCases = data.filter((c) =>
          getDummyProgressTags(c.customer_id).includes('スクリプトOK')
        ).length;
        const avgUA = data.reduce((sum, c) => sum + c.ua, 0) / totalCases;
        const avgCValue = data.reduce((sum, c) => sum + c.c_value, 0) / totalCases;

        setStats({
          totalCases,
          completedCases,
          avgUA: Math.round(avgUA * 100) / 100,
          avgCValue: Math.round(avgCValue * 100) / 100,
        });
      } catch (error) {
        console.error('Failed to load customers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  // 検索とフィルタリング
  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchCustomers(searchFilter);
      setFilteredCustomers(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilter = () => {
    setSearchFilter({});
    setFilteredCustomers(customers);
  };

  if (loading && customers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">案件データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">案件ダッシュボード</h1>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              新規案件
            </Button>
          </div>

          {/* 統計カード */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Home className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">総案件数</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCases}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">完了案件</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completedCases}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Zap className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">平均UA値</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.avgUA}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">平均C値</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.avgCValue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 検索・フィルター */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              検索・フィルター
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">案件名</label>
                <Input
                  placeholder="田中様邸"
                  value={searchFilter.case_name || ''}
                  onChange={(e) =>
                    setSearchFilter((prev) => ({ ...prev, case_name: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">案件ID</label>
                <Input
                  placeholder="CASE001"
                  value={searchFilter.customer_id || ''}
                  onChange={(e) =>
                    setSearchFilter((prev) => ({ ...prev, customer_id: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">年代</label>
                <Select
                  value={searchFilter.age_band || ''}
                  onValueChange={(value) =>
                    setSearchFilter((prev) => ({
                      ...prev,
                      age_band: value as Customer['age_band'],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="年代を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">すべて</SelectItem>
                    <SelectItem value="20s">20代</SelectItem>
                    <SelectItem value="30s">30代</SelectItem>
                    <SelectItem value="40s">40代</SelectItem>
                    <SelectItem value="50s">50代</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">共働き</label>
                <Select
                  value={searchFilter.dual_income?.toString() || ''}
                  onValueChange={(value) =>
                    setSearchFilter((prev) => ({ ...prev, dual_income: value === 'true' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="共働き" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">すべて</SelectItem>
                    <SelectItem value="true">共働き</SelectItem>
                    <SelectItem value="false">専業</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">地域区分</label>
                <Select
                  value={searchFilter.climate_region?.toString() || ''}
                  onValueChange={(value) =>
                    setSearchFilter((prev) => ({
                      ...prev,
                      climate_region: Number(value) as Customer['climate_region'],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="地域" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">すべて</SelectItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((region) => (
                      <SelectItem key={region} value={region.toString()}>
                        {region}地域
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end space-x-2">
                <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="w-4 h-4 mr-2" />
                  検索
                </Button>
                <Button variant="outline" onClick={resetFilter}>
                  リセット
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 案件一覧テーブル */}
        <Card>
          <CardHeader>
            <CardTitle>案件一覧（{filteredCustomers.length}件）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>案件名</TableHead>
                    <TableHead>家族構成</TableHead>
                    <TableHead>床面積</TableHead>
                    <TableHead>UA/C値</TableHead>
                    <TableHead>空調推奨容量</TableHead>
                    <TableHead>進捗タグ</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => {
                    const progressTags = getDummyProgressTags(customer.customer_id);
                    const hvacResult = estimateHVACCapacity({
                      floor_area_m2: customer.floor_area_m2,
                      ua: customer.ua,
                      c_value: customer.c_value,
                      climate_region: customer.climate_region,
                      ventilation_rate_m3h: customer.floor_area_m2 * 0.5,
                      layout_confirmed: true,
                    });

                    return (
                      <TableRow key={customer.customer_id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/cases/${customer.customer_id}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {customer.case_name}
                          </Link>
                          <div className="text-sm text-gray-500">{customer.customer_id}</div>
                        </TableCell>

                        <TableCell>
                          <div className="text-sm">
                            大人{customer.family_adults}人・子供{customer.family_kids}人
                          </div>
                          <div className="text-xs text-gray-500">
                            {customer.dual_income ? '共働き' : '専業'}・{customer.age_band}
                          </div>
                        </TableCell>

                        <TableCell>
                          {customer.floor_area_m2}㎡
                          {customer.site_area_tsubo && (
                            <div className="text-xs text-gray-500">
                              敷地{customer.site_area_tsubo}坪
                            </div>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="text-sm">
                            UA: <span className="font-mono">{customer.ua}</span>
                          </div>
                          <div className="text-sm">
                            C: <span className="font-mono">{customer.c_value}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="font-bold text-lg">{hvacResult.recommended_kW}kW</span>
                          <div className="text-xs text-gray-500">
                            {hvacResult.recommended_kW <= 2.8
                              ? '6畳用1台'
                              : hvacResult.recommended_kW <= 4.0
                                ? '10畳用1台'
                                : '大容量機'}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {progressTags.map((tag) => (
                              <Badge key={tag} className={`text-xs ${getTagColor(tag)}`}>
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/cases/${customer.customer_id}`)}
                          >
                            詳細
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
