'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Edit,
  Maximize2,
  Home,
  Building,
  Wrench,
  DollarSign,
  Shield,
  X,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { Presentation1View } from '@/components/Presentation1View';
import { Presentation2Wrapper, Presentation3Wrapper, Presentation5Wrapper } from '@/components/PresentationWrappers';
import { Presentation4View } from '@/components/Presentation4View';

const steps = [
  { id: 1, label: 'デザイン', icon: Home, component: Presentation1View },
  { id: 2, label: '標準装備', icon: Building, component: Presentation2Wrapper },
  { id: 3, label: 'オプション', icon: Wrench, component: Presentation3Wrapper },
  { id: 4, label: '資金計画', icon: DollarSign, component: Presentation4View },
  { id: 5, label: '光熱費', icon: Shield, component: Presentation5Wrapper },
];

export default function ProjectPresentPage() {
  const params = useParams();
  const router = useRouter();
  const { projects, currentProject, setCurrentProject, setPresentationMode, currentStep, setCurrentStep } = useStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(true);

  useEffect(() => {
    const project = projects.find((p) => p.id === params.id);
    if (project) {
      setCurrentProject(project);
      setPresentationMode(true);
    } else {
      router.push('/dashboard');
    }

    return () => {
      setPresentationMode(false);
    };
  }, [params.id, projects, setCurrentProject, setPresentationMode, router]);

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as any);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as any);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step as any);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };


  if (!currentProject) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <p className="text-gray-500">プロジェクトが見つかりません</p>
          <Link href="/dashboard">
            <Button className="mt-4">ダッシュボードに戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps.find((s) => s.id === currentStep)?.component;

  return (
    <>

      <div className={`min-h-screen bg-gray-50 ${isFullscreen ? 'p-0' : 'py-4'} no-print`}>
      {!isFullscreen && (
        <div className="container mx-auto px-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  戻る
                </Button>
              </Link>
              <h1 className="text-xl font-bold">{currentProject.projectName}</h1>
              <Badge variant="secondary">{currentProject.customerName}様</Badge>
            </div>
            <div className="flex gap-2">
              <Link href={`/project/${params.id}/present-flow`}>
                <Button variant="default" size="sm">
                  <Play className="mr-2 h-4 w-4" />
                  フロー表示
                </Button>
              </Link>
              <Link href={`/project/${currentProject.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  編集モード
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                <Maximize2 className="mr-2 h-4 w-4" />
                {isPresentationMode ? '全画面表示' : '全画面'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={`${isFullscreen ? 'h-screen flex flex-col' : 'container mx-auto px-4'}`}>
        {isFullscreen && (
          <div className="bg-white border-b px-4 py-2 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-bold">{currentProject.projectName}</h1>
              <Badge variant="secondary">{currentProject.customerName}様</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className={`${isFullscreen ? 'px-4 py-2' : 'mb-6'}`}>
          <div className="flex items-center justify-center gap-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <Button
                    variant={currentStep === step.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStepClick(step.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{step.label}</span>
                    <span className="lg:hidden">{step.id}</span>
                  </Button>
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={`${isFullscreen ? 'flex-1 overflow-auto px-4 pb-4' : ''}`}>
          <Card className={isFullscreen ? 'h-full' : ''}>
            <CardContent className="p-6">
              {CurrentStepComponent && (
                <CurrentStepComponent projectId={currentProject.id} />
              )}
            </CardContent>
          </Card>
        </div>

        <div className={`${isFullscreen ? 'border-t bg-white px-4 py-3' : 'mt-6'} flex justify-between`}>
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            前へ
          </Button>
          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full ${
                  currentStep === step.id ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <Button
            variant="outline"
            onClick={handleNextStep}
            disabled={currentStep === 5}
          >
            次へ
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}