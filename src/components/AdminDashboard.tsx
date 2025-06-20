import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Eye, 
  Globe, 
  TrendingUp, 
  Calendar,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
  AlertTriangle
} from 'lucide-react';

interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: string;
  topPages: Array<{ page: string; views: number }>;
  deviceTypes: Array<{ type: string; percentage: number; icon: JSX.Element }>;
  visitsByHour: Array<{ hour: string; visits: number }>;
  topCountries: Array<{ country: string; visits: number; flag: string }>;
}

const AdminDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    // Simular dados de analytics mais realistas
    const generateAnalytics = () => {
      const baseVisits = timeRange === '1d' ? 45 : 
                        timeRange === '7d' ? 287 : 
                        timeRange === '30d' ? 1247 : 3891;
      
      const mockData: AnalyticsData = {
        totalVisits: baseVisits + Math.floor(Math.random() * 100),
        uniqueVisitors: Math.floor((baseVisits + Math.floor(Math.random() * 100)) * 0.68),
        pageViews: Math.floor((baseVisits + Math.floor(Math.random() * 100)) * 2.1),
        bounceRate: 28.5 + Math.random() * 10,
        avgSessionDuration: `${Math.floor(Math.random() * 3) + 2}m ${Math.floor(Math.random() * 60)}s`,
        topPages: [
          { page: 'Início', views: Math.floor(baseVisits * 0.35) },
          { page: 'Projetos', views: Math.floor(baseVisits * 0.28) },
          { page: 'Sobre', views: Math.floor(baseVisits * 0.22) },
          { page: 'Depoimentos', views: Math.floor(baseVisits * 0.18) },
          { page: 'Aulas Particulares', views: Math.floor(baseVisits * 0.15) }
        ],
        deviceTypes: [
          { type: 'Desktop', percentage: 58 + Math.floor(Math.random() * 10), icon: <Monitor className="w-4 h-4" /> },
          { type: 'Mobile', percentage: 32 + Math.floor(Math.random() * 8), icon: <Smartphone className="w-4 h-4" /> },
          { type: 'Tablet', percentage: 8 + Math.floor(Math.random() * 4), icon: <Tablet className="w-4 h-4" /> }
        ],
        visitsByHour: Array.from({ length: 24 }, (_, i) => ({
          hour: i.toString().padStart(2, '0'),
          visits: Math.floor(Math.random() * (baseVisits / 10)) + (i >= 9 && i <= 18 ? 15 : 5)
        })),
        topCountries: [
          { country: 'Brasil', visits: Math.floor(baseVisits * 0.72), flag: '🇧🇷' },
          { country: 'Estados Unidos', visits: Math.floor(baseVisits * 0.12), flag: '🇺🇸' },
          { country: 'Portugal', visits: Math.floor(baseVisits * 0.08), flag: '🇵🇹' },
          { country: 'Argentina', visits: Math.floor(baseVisits * 0.05), flag: '🇦🇷' },
          { country: 'Canadá', visits: Math.floor(baseVisits * 0.03), flag: '🇨🇦' }
        ]
      };

      setAnalyticsData(mockData);
    };

    generateAnalytics();
  }, [timeRange]);

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-cyan-400">Carregando dados de analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-cyan-400">Dashboard Analytics</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-3 py-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm">Dados Simulados</span>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-black border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-cyan-400 focus:outline-none"
          >
            <option value="1d">Últimas 24h</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
        </div>
      </div>

      {/* Aviso sobre dados simulados */}
      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">📊 Sobre os Dados de Analytics</h3>
        <p className="text-gray-300 text-sm mb-3">
          Os dados mostrados são simulados para demonstração. Para dados reais, você pode integrar com:
        </p>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>• Google Analytics 4</li>
          <li>• Plausible Analytics</li>
          <li>• Umami Analytics</li>
          <li>• Netlify Analytics (para sites hospedados no Netlify)</li>
        </ul>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900/50 p-6 rounded-lg border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Visitas</p>
              <p className="text-2xl font-bold text-cyan-400">{analyticsData.totalVisits.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{(Math.random() * 20 + 5).toFixed(1)}% vs período anterior
          </div>
        </div>

        <div className="bg-gray-900/50 p-6 rounded-lg border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Visitantes Únicos</p>
              <p className="text-2xl font-bold text-purple-400">{analyticsData.uniqueVisitors.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-purple-400" />
          </div>
          <div className="mt-2 flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{(Math.random() * 15 + 3).toFixed(1)}% vs período anterior
          </div>
        </div>

        <div className="bg-gray-900/50 p-6 rounded-lg border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Visualizações</p>
              <p className="text-2xl font-bold text-green-400">{analyticsData.pageViews.toLocaleString()}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-400" />
          </div>
          <div className="mt-2 flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{(Math.random() * 25 + 8).toFixed(1)}% vs período anterior
          </div>
        </div>

        <div className="bg-gray-900/50 p-6 rounded-lg border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Taxa de Rejeição</p>
              <p className="text-2xl font-bold text-yellow-400">{analyticsData.bounceRate.toFixed(1)}%</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="mt-2 flex items-center text-red-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
            -{(Math.random() * 5 + 1).toFixed(1)}% vs período anterior
          </div>
        </div>
      </div>

      {/* Gráficos e tabelas */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Páginas mais visitadas */}
        <div className="bg-gray-900/50 p-6 rounded-lg border border-cyan-500/30">
          <h3 className="text-lg font-bold text-cyan-400 mb-4">Páginas Mais Visitadas</h3>
          <div className="space-y-3">
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-300">{page.page}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="bg-cyan-400 h-2 rounded-full" 
                      style={{ width: `${(page.views / analyticsData.topPages[0].views) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-cyan-400 font-semibold w-16 text-right">{page.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tipos de dispositivo */}
        <div className="bg-gray-900/50 p-6 rounded-lg border border-purple-500/30">
          <h3 className="text-lg font-bold text-purple-400 mb-4">Dispositivos</h3>
          <div className="space-y-4">
            {analyticsData.deviceTypes.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-purple-400 mr-3">{device.icon}</div>
                  <span className="text-gray-300">{device.type}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="bg-purple-400 h-2 rounded-full" 
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-purple-400 font-semibold w-12 text-right">{device.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visitas por hora */}
        <div className="bg-gray-900/50 p-6 rounded-lg border border-green-500/30">
          <h3 className="text-lg font-bold text-green-400 mb-4">Visitas por Hora (Últimas 24h)</h3>
          <div className="flex items-end justify-between h-32 space-x-1">
            {analyticsData.visitsByHour.slice(0, 12).map((hour, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-green-400 w-full rounded-t"
                  style={{ height: `${(hour.visits / Math.max(...analyticsData.visitsByHour.map(h => h.visits))) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-400 mt-2">{hour.hour}h</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top países */}
        <div className="bg-gray-900/50 p-6 rounded-lg border border-yellow-500/30">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">Top Países</h3>
          <div className="space-y-3">
            {analyticsData.topCountries.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{country.flag}</span>
                  <span className="text-gray-300">{country.country}</span>
                </div>
                <span className="text-yellow-400 font-semibold">{country.visits}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="bg-gray-900/50 p-6 rounded-lg border border-cyan-500/30">
        <h3 className="text-lg font-bold text-cyan-400 mb-4">Resumo do Período</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Duração Média da Sessão</p>
            <p className="text-xl font-bold text-cyan-400">{analyticsData.avgSessionDuration}</p>
          </div>
          <div className="text-center">
            <Globe className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Países Alcançados</p>
            <p className="text-xl font-bold text-purple-400">{analyticsData.topCountries.length}</p>
          </div>
          <div className="text-center">
            <MapPin className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Taxa de Conversão</p>
            <p className="text-xl font-bold text-green-400">{(Math.random() * 3 + 2).toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;