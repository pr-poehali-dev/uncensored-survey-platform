import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ProfileStat {
  profile: string;
  count: number;
}

interface QuestionStat {
  answer: string;
  count: number;
}

interface Stats {
  totalResponses: number;
  profileStats: ProfileStat[];
  questionStats: {
    q1: QuestionStat[];
    q2: QuestionStat[];
    q3: QuestionStat[];
    q4: QuestionStat[];
    q5: QuestionStat[];
  };
}

const questionTexts = [
  'Насколько важна для вас полная анонимность в социальных сетях?',
  'Как вы относитесь к хранению ваших личных данных?',
  'Готовы ли вы пожертвовать удобством ради отсутствия цензуры?',
  'Как должна модерироваться социальная сеть без цензуры?',
  'Что для вас важнее в свободной соцсети?'
];

export default function Stats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/f11a26fc-ab81-469e-96c5-b9dc6da5e5a0');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (count: number, total: number) => {
    return total > 0 ? (count / total) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen cyber-grid flex items-center justify-center">
        <div className="text-primary text-xl animate-pulse">Загрузка статистики...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen cyber-grid flex items-center justify-center">
        <div className="text-destructive">Ошибка загрузки данных</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-grid p-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center animate-fade-in">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="mb-6 border-primary/30 hover:bg-primary/10"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Вернуться к опросу
          </Button>
          
          <h1 className="text-5xl md:text-6xl font-bold text-primary neon-text mb-4">
            Статистика Опроса
          </h1>
          <p className="text-xl text-foreground/70">
            Анализ ответов участников
          </p>
        </div>

        <Card className="bg-card/90 backdrop-blur-xl border-primary/30 neon-glow animate-fade-in">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 neon-glow mb-4">
                <Icon name="Users" size={40} className="text-primary" />
              </div>
              <h2 className="text-4xl font-bold text-primary mb-2">
                {stats.totalResponses}
              </h2>
              <p className="text-foreground/70">
                Всего ответов
              </p>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Icon name="PieChart" size={32} className="text-primary" />
            Типы пользователей
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {stats.profileStats.map((profile, index) => (
              <Card
                key={index}
                className="bg-card/90 backdrop-blur-xl border-primary/30 hover:neon-glow transition-all animate-fade-in"
              >
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold text-foreground">
                      {profile.profile}
                    </h3>
                    <div className="text-4xl font-bold text-primary neon-text">
                      {profile.count}
                    </div>
                    <Progress
                      value={getPercentage(profile.count, stats.totalResponses)}
                      className="h-2"
                    />
                    <p className="text-sm text-muted-foreground">
                      {getPercentage(profile.count, stats.totalResponses).toFixed(1)}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {Object.entries(stats.questionStats).map(([key, questionData], qIndex) => {
          const questionNumber = parseInt(key.replace('q', ''));
          return (
            <Card
              key={key}
              className="bg-card/90 backdrop-blur-xl border-primary/30 animate-fade-in"
            >
              <CardHeader>
                <CardTitle className="text-2xl text-foreground flex items-start gap-3">
                  <Icon name="MessageCircle" size={24} className="text-primary mt-1" />
                  <span>
                    Вопрос {questionNumber}: {questionTexts[questionNumber - 1]}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {questionData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/80 text-sm flex-1">
                        {item.answer}
                      </span>
                      <span className="text-primary font-semibold ml-4">
                        {item.count} ({getPercentage(item.count, stats.totalResponses).toFixed(1)}%)
                      </span>
                    </div>
                    <Progress
                      value={getPercentage(item.count, stats.totalResponses)}
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}

        <div className="text-center pt-8">
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Пройти опрос
          </Button>
        </div>
      </div>
    </div>
  );
}
