'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, TrendingUp, BookOpen, Target } from 'lucide-react';
import { getCustomers } from '@/lib/sheets';
import type { Customer, RolePlayEvaluation } from '@/types/domain';

type ScoreType = '◎' | '○' | '△' | '×';

const SECTIONS = [
  { id: 'WHY', name: 'WHY（目的・根拠）', description: '数値は手段、省エネ×快適が目的' },
  { id: '性能', name: '性能・実績', description: '引渡し棟数、UA/C値実績の提示' },
  { id: '空調', name: '空調計画', description: '負荷計算、適正容量の説明' },
  { id: '太陽光', name: '太陽光', description: '容量中心、メーカー/パネル差の説明' },
  { id: 'コスト', name: 'コスト', description: '15年トータルコスト、実質負担額' },
  { id: 'メンテ', name: 'メンテナンス', description: '30年計画、削減効果の説明' },
] as const;

const SCORE_COLORS = {
  '◎': 'bg-green-100 text-green-800',
  '○': 'bg-blue-100 text-blue-800',
  '△': 'bg-yellow-100 text-yellow-800',
  '×': 'bg-red-100 text-red-800',
} as const;

const SCORE_LABELS = {
  '◎': '優秀',
  '○': '良好',
  '△': '要改善',
  '×': '不足',
} as const;

export default function EducationPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCase, setSelectedCase] = useState<Customer | null>(null);
  const [evaluation, setEvaluation] = useState<RolePlayEvaluation>({
    evaluator_id: 'evaluator_001',
    trainee_id: 'trainee_001',
    case_id: '',
    date: new Date().toISOString().split('T')[0],
    sections: SECTIONS.map((section) => ({
      section: section.id,
      score: '○' as ScoreType,
      notes: '',
    })),
    overall_notes: '',
  });

  // ダミーの過去評価データ
  const [pastEvaluations] = useState<RolePlayEvaluation[]>([
    {
      evaluator_id: 'evaluator_001',
      trainee_id: 'trainee_001',
      case_id: 'CASE001',
      date: '2024-01-15',
      sections: [
        { section: 'WHY', score: '◎', notes: 'WHYの説明が的確でした' },
        { section: '性能', score: '○', notes: '実績データの提示が良好' },
        { section: '空調', score: '△', notes: '負荷計算の説明をもう少し詳しく' },
        { section: '太陽光', score: '○', notes: '容量の重要性を理解している' },
        { section: 'コスト', score: '◎', notes: 'トータルコストの説明が明確' },
        { section: 'メンテ', score: '○', notes: 'メンテナンス計画の説明が良い' },
      ],
      overall_notes: '全体的に良好。空調の説明をより詳しくできるとよい。',
    },
  ]);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
        if (data.length > 0) {
          setSelectedCase(data[0]);
          setEvaluation((prev) => ({ ...prev, case_id: data[0].customer_id }));
        }
      } catch (error) {
        console.error('Failed to load customers:', error);
      }
    };

    loadCustomers();
  }, []);

  const handleScoreChange = (sectionIndex: number, score: ScoreType) => {
    setEvaluation((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex ? { ...section, score } : section
      ),
    }));
  };

  const handleNotesChange = (sectionIndex: number, notes: string) => {
    setEvaluation((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex ? { ...section, notes } : section
      ),
    }));
  };

  const handleSave = () => {
    // TODO: 実際のAPIに保存
    console.log('Evaluation saved:', evaluation);
    alert('評価を保存しました');
  };

  const calculateOverallScore = (sections: RolePlayEvaluation['sections']) => {
    const scorePoints = { '◎': 4, '○': 3, '△': 2, '×': 1 };
    const total = sections.reduce((sum, section) => sum + scorePoints[section.score], 0);
    const average = total / sections.length;

    if (average >= 3.5) return '◎';
    if (average >= 2.5) return '○';
    if (average >= 1.5) return '△';
    return '×';
  };

  const getScoreStats = () => {
    const allScores = pastEvaluations.flatMap((evaluation) =>
      evaluation.sections.map((s) => s.score)
    );
    const scorePoints = { '◎': 4, '○': 3, '△': 2, '×': 1 };
    const average =
      allScores.reduce((sum, score) => sum + scorePoints[score], 0) / allScores.length;

    return {
      totalEvaluations: pastEvaluations.length,
      averageScore: Math.round(average * 100) / 100,
      excellentCount: allScores.filter((s) => s === '◎').length,
      improvementNeeded: allScores.filter((s) => s === '△' || s === '×').length,
    };
  };

  const stats = getScoreStats();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">教育・ロールプレイ評価</h1>

          {/* 統計カード */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">評価回数</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalEvaluations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">平均スコア</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageScore}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">優秀評価</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.excellentCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">要改善</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.improvementNeeded}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 新規評価 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>新規ロールプレイ評価</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 案件選択 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    評価対象案件
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedCase?.customer_id || ''}
                    onChange={(e) => {
                      const selected = customers.find((c) => c.customer_id === e.target.value);
                      setSelectedCase(selected || null);
                      setEvaluation((prev) => ({ ...prev, case_id: e.target.value }));
                    }}
                  >
                    {customers.map((customer) => (
                      <option key={customer.customer_id} value={customer.customer_id}>
                        {customer.case_name} ({customer.customer_id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 評価チェックリスト */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">ロールプレイチェックリスト</h3>

                  {SECTIONS.map((section, index) => (
                    <div key={section.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{section.name}</h4>
                          <p className="text-sm text-gray-600">{section.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          {(['◎', '○', '△', '×'] as ScoreType[]).map((score) => (
                            <button
                              key={score}
                              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${
                                evaluation.sections[index].score === score
                                  ? `border-current ${SCORE_COLORS[score]}`
                                  : 'border-gray-300 text-gray-400 hover:border-gray-400'
                              }`}
                              onClick={() => handleScoreChange(index, score)}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Textarea
                        placeholder="メモ・改善点など"
                        value={evaluation.sections[index].notes}
                        onChange={(e) => handleNotesChange(index, e.target.value)}
                        className="mt-2"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>

                {/* 総合評価 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">総合所見</label>
                  <Textarea
                    placeholder="全体的な評価、今後の改善点など"
                    value={evaluation.overall_notes}
                    onChange={(e) =>
                      setEvaluation((prev) => ({ ...prev, overall_notes: e.target.value }))
                    }
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">総合評価:</span>
                    <Badge className={SCORE_COLORS[calculateOverallScore(evaluation.sections)]}>
                      {calculateOverallScore(evaluation.sections)}{' '}
                      {SCORE_LABELS[calculateOverallScore(evaluation.sections)]}
                    </Badge>
                  </div>
                  <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
                    評価を保存
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 過去の評価履歴 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>過去の評価履歴</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pastEvaluations.map((pastEvaluation, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{pastEvaluation.case_id}</h4>
                          <p className="text-sm text-gray-500">{pastEvaluation.date}</p>
                        </div>
                        <Badge
                          className={SCORE_COLORS[calculateOverallScore(pastEvaluation.sections)]}
                        >
                          {calculateOverallScore(pastEvaluation.sections)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {pastEvaluation.sections.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="flex items-center space-x-1">
                            <span className="text-xs text-gray-600">{section.section}:</span>
                            <Badge className={`text-xs ${SCORE_COLORS[section.score]}`}>
                              {section.score}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      {pastEvaluation.overall_notes && (
                        <p className="text-sm text-gray-600 italic">
                          &ldquo;{pastEvaluation.overall_notes}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* KPI連動 */}
            <Card>
              <CardHeader>
                <CardTitle>連動KPI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">契約率</span>
                    <span className="font-bold text-green-600">75%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">限定会員率</span>
                    <span className="font-bold text-blue-600">60%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">平均面談時間</span>
                    <span className="font-bold text-purple-600">90分</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">質問件数（月）</span>
                    <span className="font-bold text-orange-600">12件</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ロールプレイ評価の向上により、契約率・限定会員率の向上と、
                    質問件数の減少が期待されます。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
