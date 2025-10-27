import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  text: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: 'Насколько важна для вас полная анонимность в социальных сетях?',
    options: [
      'Критически важна - без анонимности не буду пользоваться',
      'Важна, но не критична',
      'Скорее не важна',
      'Совсем не важна'
    ]
  },
  {
    id: 2,
    text: 'Как вы относитесь к хранению ваших личных данных?',
    options: [
      'Данные должны храниться только на моем устройстве',
      'Допускаю шифрованное хранение на серверах',
      'Доверяю компаниям хранить мои данные',
      'Не думал об этом'
    ]
  },
  {
    id: 3,
    text: 'Готовы ли вы пожертвовать удобством ради отсутствия цензуры?',
    options: [
      'Да, свобода слова важнее удобства',
      'Готов к небольшим неудобствам',
      'Хочу и свободу, и удобство',
      'Предпочитаю удобство'
    ]
  },
  {
    id: 4,
    text: 'Как должна модерироваться социальная сеть без цензуры?',
    options: [
      'Вообще никак - полная свобода',
      'Только удаление незаконного контента',
      'Сообщество само решает что допустимо',
      'Нужны четкие правила и модераторы'
    ]
  },
  {
    id: 5,
    text: 'Что для вас важнее в свободной соцсети?',
    options: [
      'Невозможность отследить мою личность',
      'Отсутствие алгоритмов и рекламы',
      'Возможность говорить что угодно',
      'Защита от утечек данных'
    ]
  }
];

export default function Index() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const { toast } = useToast();

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = () => {
    if (!selectedAnswer) {
      toast({
        title: 'Выберите ответ',
        description: 'Пожалуйста, выберите один из вариантов ответа',
        variant: 'destructive'
      });
      return;
    }

    const newAnswers = { ...answers, [questions[currentQuestion].id]: selectedAnswer };
    setAnswers(newAnswers);
    setSelectedAnswer('');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[questions[currentQuestion - 1].id] || '');
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setSelectedAnswer('');
  };

  const getResultProfile = () => {
    const answerValues = Object.values(answers);
    
    const privacyFocused = answerValues.filter(a => 
      a.includes('Критически важна') || 
      a.includes('только на моем устройстве') ||
      a.includes('Невозможность отследить')
    ).length;

    const freedomFocused = answerValues.filter(a =>
      a.includes('свобода слова') ||
      a.includes('полная свобода') ||
      a.includes('говорить что угодно')
    ).length;

    if (privacyFocused >= 3) {
      return {
        title: '🛡️ Защитник Приватности',
        description: 'Для вас конфиденциальность - превыше всего. Вы хотите полный контроль над своими данными и максимальную анонимность.',
        recommendation: 'Рекомендуем: P2P сети, end-to-end шифрование, децентрализованные платформы.'
      };
    }

    if (freedomFocused >= 3) {
      return {
        title: '🗽 Борец за Свободу',
        description: 'Свобода слова для вас - основная ценность. Вы готовы к отсутствию модерации ради возможности высказываться.',
        recommendation: 'Рекомендуем: Платформы с минимальной модерацией, blockchain-based социальные сети.'
      };
    }

    return {
      title: '⚖️ Сторонник Баланса',
      description: 'Вы ищете золотую середину между свободой, безопасностью и удобством использования.',
      recommendation: 'Рекомендуем: Федеративные сети с модерацией сообществом, open-source платформы.'
    };
  };

  if (showResults) {
    const profile = getResultProfile();

    return (
      <div className="min-h-screen cyber-grid flex items-center justify-center p-4">
        <div className="w-full max-w-3xl animate-fade-in">
          <Card className="bg-card/90 backdrop-blur-xl border-primary/30 neon-glow">
            <CardContent className="p-8 md:p-12">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 neon-glow mb-4">
                  <Icon name="ShieldCheck" size={40} className="text-primary" />
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-primary neon-text">
                  {profile.title}
                </h1>

                <p className="text-xl text-foreground/80">
                  {profile.description}
                </p>

                <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mt-8">
                  <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                    <Icon name="Lightbulb" size={20} />
                    Рекомендация
                  </h3>
                  <p className="text-foreground/70">
                    {profile.recommendation}
                  </p>
                </div>

                <div className="space-y-4 mt-8">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Ваши ответы
                  </h3>
                  {questions.map((q) => (
                    <div key={q.id} className="text-left bg-muted/20 rounded-lg p-4 border border-primary/10">
                      <p className="text-sm font-medium text-foreground/60 mb-2">
                        {q.text}
                      </p>
                      <p className="text-foreground font-medium flex items-start gap-2">
                        <Icon name="ArrowRight" size={16} className="text-primary mt-1 flex-shrink-0" />
                        {answers[q.id]}
                      </p>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={handleRestart}
                  size="lg"
                  className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground neon-glow"
                >
                  <Icon name="RotateCcw" size={20} className="mr-2" />
                  Пройти опрос заново
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-primary neon-text mb-4">
            Свободная Сеть
          </h1>
          <p className="text-xl text-foreground/70">
            Опрос о социальных сетях без цензуры
          </p>
        </div>

        <div className="mb-6 animate-slide-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground/60">
              Вопрос {currentQuestion + 1} из {questions.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2 animate-glow-pulse" />
        </div>

        <Card className="bg-card/90 backdrop-blur-xl border-primary/30 neon-glow animate-fade-in">
          <CardContent className="p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              {questions[currentQuestion].text}
            </h2>

            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${
                    selectedAnswer === option
                      ? 'border-primary bg-primary/10 neon-glow'
                      : 'border-border'
                  }`}
                  onClick={() => setSelectedAnswer(option)}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex gap-4 mt-8">
              {currentQuestion > 0 && (
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  size="lg"
                  className="flex-1 border-primary/30 hover:bg-primary/10"
                >
                  <Icon name="ChevronLeft" size={20} className="mr-2" />
                  Назад
                </Button>
              )}
              <Button
                onClick={handleNext}
                size="lg"
                className={`flex-1 bg-primary hover:bg-primary/90 text-primary-foreground neon-glow ${
                  currentQuestion === 0 ? 'w-full' : ''
                }`}
              >
                {currentQuestion === questions.length - 1 ? 'Завершить' : 'Далее'}
                <Icon name="ChevronRight" size={20} className="ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Icon name="Lock" size={16} />
            Ваши ответы анонимны и не сохраняются
          </p>
        </div>
      </div>
    </div>
  );
}
