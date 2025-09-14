'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useStore } from '@/lib/store';
import type { OptionMaster } from '@/types';

export default function MasterPage() {
  const { optionMasters, addOptionMaster, updateOptionMaster, deleteOptionMaster } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newOption, setNewOption] = useState<Partial<OptionMaster>>({
    category: '',
    name: '',
    unit: 'fixed',
    unitPrice: 0,
    defaultQuantity: 1,
  });
  const [editingOption, setEditingOption] = useState<Partial<OptionMaster>>({});

  const handleAddOption = () => {
    if (newOption.category && newOption.name && newOption.unitPrice) {
      const option: OptionMaster = {
        id: `option-${Date.now()}`,
        category: newOption.category,
        name: newOption.name,
        unit: newOption.unit as 'fixed' | 'area' | 'quantity',
        unitPrice: newOption.unitPrice,
        defaultQuantity: newOption.defaultQuantity,
      };
      addOptionMaster(option);
      setNewOption({
        category: '',
        name: '',
        unit: 'fixed',
        unitPrice: 0,
        defaultQuantity: 1,
      });
    }
  };

  const handleEditStart = (option: OptionMaster) => {
    setEditingId(option.id);
    setEditingOption(option);
  };

  const handleEditSave = () => {
    if (editingId && editingOption) {
      updateOptionMaster(editingId, editingOption);
      setEditingId(null);
      setEditingOption({});
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingOption({});
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedId) {
      deleteOptionMaster(selectedId);
      setSelectedId(null);
    }
    setDeleteDialogOpen(false);
  };

  const groupedOptions = optionMasters.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, OptionMaster[]>);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              戻る
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">オプションマスタ管理</h1>
        </div>
        <Link href="/admin/presentation2">
          <Button variant="outline">
            プレゼンテーション2管理
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>新規オプション追加</CardTitle>
          <CardDescription>
            新しいオプション項目を追加します
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <Label htmlFor="newCategory">カテゴリ</Label>
              <Input
                id="newCategory"
                value={newOption.category}
                onChange={(e) => setNewOption({ ...newOption, category: e.target.value })}
                placeholder="例: 外装"
              />
            </div>
            <div>
              <Label htmlFor="newName">オプション名</Label>
              <Input
                id="newName"
                value={newOption.name}
                onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
                placeholder="例: タイル外壁"
              />
            </div>
            <div>
              <Label htmlFor="newUnit">単位</Label>
              <Select
                value={newOption.unit}
                onValueChange={(value) => setNewOption({ ...newOption, unit: value as any })}
              >
                <SelectTrigger id="newUnit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">一式</SelectItem>
                  <SelectItem value="area">㎡</SelectItem>
                  <SelectItem value="quantity">個</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="newPrice">単価</Label>
              <Input
                id="newPrice"
                type="number"
                value={newOption.unitPrice}
                onChange={(e) => setNewOption({ ...newOption, unitPrice: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="newQuantity">初期数量</Label>
              <Input
                id="newQuantity"
                type="number"
                value={newOption.defaultQuantity}
                onChange={(e) => setNewOption({ ...newOption, defaultQuantity: parseInt(e.target.value) || 1 })}
                placeholder="1"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleAddOption}>
              <Plus className="mr-2 h-4 w-4" />
              追加
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>オプション一覧</CardTitle>
          <CardDescription>
            登録されているオプション項目の一覧
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>カテゴリ</TableHead>
                <TableHead>オプション名</TableHead>
                <TableHead>単位</TableHead>
                <TableHead>単価</TableHead>
                <TableHead>初期数量</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedOptions).map(([category, options]) => (
                <>
                  <TableRow key={`category-${category}`}>
                    <TableCell colSpan={6} className="bg-gray-50 font-semibold">
                      {category}
                    </TableCell>
                  </TableRow>
                  {options.map((option) => (
                    <TableRow key={option.id}>
                      {editingId === option.id ? (
                        <>
                          <TableCell>
                            <Input
                              value={editingOption.category}
                              onChange={(e) => setEditingOption({ ...editingOption, category: e.target.value })}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editingOption.name}
                              onChange={(e) => setEditingOption({ ...editingOption, name: e.target.value })}
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={editingOption.unit}
                              onValueChange={(value) => setEditingOption({ ...editingOption, unit: value as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fixed">一式</SelectItem>
                                <SelectItem value="area">㎡</SelectItem>
                                <SelectItem value="quantity">個</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={editingOption.unitPrice}
                              onChange={(e) => setEditingOption({ ...editingOption, unitPrice: parseInt(e.target.value) || 0 })}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={editingOption.defaultQuantity}
                              onChange={(e) => setEditingOption({ ...editingOption, defaultQuantity: parseInt(e.target.value) || 1 })}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={handleEditSave}>
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={handleEditCancel}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell></TableCell>
                          <TableCell>{option.name}</TableCell>
                          <TableCell>
                            {option.unit === 'fixed' ? '一式' :
                             option.unit === 'area' ? '㎡' : '個'}
                          </TableCell>
                          <TableCell>¥{option.unitPrice.toLocaleString()}</TableCell>
                          <TableCell>{option.defaultQuantity}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditStart(option)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(option.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </>
              ))}
              {optionMasters.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    オプションが登録されていません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>オプションを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消すことができません。このオプションを使用している案件にも影響する可能性があります。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>削除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}