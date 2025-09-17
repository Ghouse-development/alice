'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import type { Project } from '@/types';
import { ThemeToggle } from '@/components/ThemeToggle';

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  presented: 'bg-blue-100 text-blue-800',
  contracted: 'bg-green-100 text-green-800',
  archived: 'bg-yellow-100 text-yellow-800',
};

const statusLabels = {
  draft: '作成中',
  presented: '提案済',
  contracted: '契約済',
  archived: 'アーカイブ',
};

export default function DashboardPage() {
  const router = useRouter();
  const { projects, addProject, deleteProject, initializeSampleData } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Hydrate the store after mounting
    (useStore as any).persist?.rehydrate?.();
    setIsHydrated(true);

    // Initialize sample data if needed
    if (projects.length === 0) {
      initializeSampleData();
    }
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.salesPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      projectName: `新規案件-${new Date().toLocaleDateString('ja-JP')}`,
      customerName: '未設定',
      salesPerson: '未設定',
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addProject(newProject);
    router.push(`/project/${newProject.id}/edit`);
  };

  const handleDeleteProject = (id: string) => {
    setSelectedProjectId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProjectId) {
      deleteProject(selectedProjectId);
      setSelectedProjectId(null);
    }
    setDeleteDialogOpen(false);
  };

  // Wait for hydration to avoid SSR issues
  if (!isHydrated) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-screen">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">案件管理ダッシュボード</h1>
          <p className="text-gray-600">
            Gハウス営業プレゼンテーションシステム
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">全案件数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">作成中</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter((p) => p.status === 'draft').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">提案済</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter((p) => p.status === 'presented').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">契約済</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter((p) => p.status === 'contracted').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>案件一覧</CardTitle>
            <div className="flex gap-2">
              <Link href="/master/index">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  マスタ管理
                </Button>
              </Link>
              <Button onClick={handleCreateProject}>
                <Plus className="mr-2 h-4 w-4" />
                新規案件作成
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="案件名、顧客名、営業担当者で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>案件名</TableHead>
                <TableHead>顧客名</TableHead>
                <TableHead>営業担当者</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>更新日</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    案件がありません
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      {project.projectName}
                    </TableCell>
                    <TableCell>{project.customerName}</TableCell>
                    <TableCell>{project.salesPerson}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[project.status]}>
                        {statusLabels[project.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(project.updatedAt).toLocaleDateString('ja-JP')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/project/${project.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/project/${project.id}/present`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>案件を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消すことができません。案件に関連するすべてのデータが削除されます。
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