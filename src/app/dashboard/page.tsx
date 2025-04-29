"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import Sidebar from '@/components/ui/Sidebar';
import FilterBar from '@/components/ui/FilterBar';
import MetricCard from '@/components/dashboard/MetricCard';
import TimelineChart from '@/components/dashboard/TimelineChart';
import DonutChart from '@/components/dashboard/DonutChart';
import PeriodBarChart from '@/components/dashboard/PeriodBarChart';
import DataTable from '@/components/dashboard/DataTable';
import AdPreview from '@/components/dashboard/AdPreview';
import ClientTabSelector from '@/components/dashboard/ClientTabSelector';
import AccountSelector from '@/components/dashboard/AccountSelector';
import BestContents from '@/components/dashboard/BestContents';
import { campaignsApi } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { DateRangePicker } from '@/components/dashboard/DateRangeSelector';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Interface para os dados de métricas
interface MetricsData {
  invested: string;
  result: string;
  costPerResult: string;
  returnRate: string;
  impressions: string;
  clicks: string;
  cpc: string;
  cpm: string;
  timelineData: Array<{date: string, value: number}>;
  deviceData: Array<{name: string, value: number, color: string}>;
  periodData: Array<{period: string, value: number}>;
  campaignData: Array<{
    campaign: string;
    invested: string;
    results: number;
    costPerResult: string;
    returnRate: string;
  }>;
  adsData: Array<{
    id: string;
    name: string;
    imageUrl: string;
    metrics: {
      impressions: number;
      clicks: number;
      conversions: number;
    }
  }>;
  bestContents: Array<{
    id: string;
    title: string;
    platform: 'meta' | 'google';
    imageUrl?: string;
    metrics: {
      impressions: number;
      clicks: number;
      ctr: number;
      costPerResult: number;
      frequency: number;
      conversions: number;
    };
  }>;
}

// Dados simulados para o modo de demonstração
const demoData: MetricsData = {
  invested: "R$ 6.302,07",
  result: "28",
  costPerResult: "R$ 225,07",
  returnRate: "1,42%",
  impressions: "137.567",
  clicks: "1.973",
  cpc: "R$ 3,19",
  cpm: "R$ 45,81",
  timelineData: Array.from({ length: 30 }, (_, i) => ({
    date: `${i + 1}/04`,
    value: Math.floor(Math.random() * 300) + 100
  })),
  deviceData: [
    { name: 'Desktop', value: 1062, color: '#FF6384' },
    { name: 'Mobile Web', value: 6918, color: '#FFDD00' }
  ],
  periodData: [
    { period: 'seg', value: 8 },
    { period: 'ter', value: 6 },
    { period: 'qua', value: 7 },
    { period: 'qui', value: 5 },
    { period: 'sex', value: 4 },
    { period: 'sáb', value: 3 },
    { period: 'dom', value: 2 }
  ],
  campaignData: [
    {
      campaign: 'V - [STR] [GTR] - [Vendas] - [C-S] - [Adv+] - Público Frio Campanha',
      invested: 'R$ 2.835,59',
      results: 11,
      costPerResult: 'R$ 257,78',
      returnRate: '1,39%'
    },
    {
      campaign: 'V - [34] [GTR] - [Compras Advantage] [C-S] - Públicos Frios',
      invested: 'R$ 692,09',
      results: 4,
      costPerResult: 'R$ 173,02',
      returnRate: '1,86%'
    },
    {
      campaign: 'V - [45] [STR] - [Vendas] - [C-S] - [ABO] - Públicos Frios',
      invested: 'R$ 1.030,51',
      results: 3,
      costPerResult: 'R$ 343,5',
      returnRate: '1,17%'
    },
    {
      campaign: '[42] [STR] - [Vendas] - [C-S] - [ABO] - Público Frio',
      invested: 'R$ 979,01',
      results: 3,
      costPerResult: 'R$ 326,34',
      returnRate: '1,06%'
    },
    {
      campaign: '[33] [STR] - [Vendas] - [C-S] - [ABO] - RMKT',
      invested: 'R$ 139,53',
      results: 2,
      costPerResult: 'R$ 69,77',
      returnRate: '5%'
    }
  ],
  adsData: [
    {
      id: '1',
      name: 'Anúncio 1 - Venda Direta',
      imageUrl: '',
      metrics: {
        impressions: 53939,
        clicks: 1973,
        conversions: 4
      }
    },
    {
      id: '2',
      name: 'Anúncio 2 - Promoção Especial',
      imageUrl: '',
      metrics: {
        impressions: 37567,
        clicks: 1173,
        conversions: 4
      }
    }
  ],
  bestContents: [
    {
      id: '1',
      title: 'Vídeo - Apresentação do Produto Premium',
      platform: 'meta',
      imageUrl: '',
      metrics: {
        impressions: 42500,
        clicks: 1275,
        ctr: 0.03,
        costPerResult: 85.25,
        frequency: 1.8,
        conversions: 15
      }
    },
    {
      id: '2',
      title: 'Carrossel - Benefícios do Serviço',
      platform: 'meta',
      imageUrl: '',
      metrics: {
        impressions: 38200,
        clicks: 956,
        ctr: 0.025,
        costPerResult: 120.75,
        frequency: 2.1,
        conversions: 8
      }
    },
    {
      id: '3',
      title: 'Imagem - Promoção Especial',
      platform: 'google',
      imageUrl: '',
      metrics: {
        impressions: 25600,
        clicks: 640,
        ctr: 0.025,
        costPerResult: 160.30,
        frequency: 1.5,
        conversions: 4
      }
    },
    {
      id: '4',
      title: 'Vídeo - Depoimento de Cliente',
      platform: 'meta',
      imageUrl: '',
      metrics: {
        impressions: 18900,
        clicks: 378,
        ctr: 0.02,
        costPerResult: 195.50,
        frequency: 2.4,
        conversions: 2
      }
    },
    {
      id: '5',
      title: 'Texto - Anúncio de Pesquisa',
      platform: 'google',
      imageUrl: '',
      metrics: {
        impressions: 12300,
        clicks: 246,
        ctr: 0.02,
        costPerResult: 175.80,
        frequency: 1.2,
        conversions: 3
      }
    }
  ]
};

export default function Dashboard() {
  // Estado para o cliente selecionado
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>();
  
  // Estado para as contas selecionadas
  const [selectedAccounts, setSelectedAccounts] = useState<{
    meta: string[];
    google: string[];
  }>({
    meta: [],
    google: []
  });
  
  // Estado para o período selecionado
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(new Date().setDate(1)), // Primeiro dia do mês atual
    to: new Date() // Hoje
  });
  
  // Estado para o período de comparação
  const [compareWith, setCompareWith] = useState<{
    from: Date;
    to: Date;
  } | null>(null);
  
  // Estado para os filtros
  const [activeFilter, setActiveFilter] = useState({
    campaign: 'Todas',
    adSet: 'Todos',
    objective: 'Todos'
  });
  
  // Estado para os dados de métricas
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  
  // Estado para loading
  const [loading, setLoading] = useState(false);
  
  // Estado para erro
  const [error, setError] = useState<string | null>(null);
  
  // Estado para modo de demonstração
  const [demoMode, setDemoMode] = useState(false);

  // Função para lidar com a mudança de cliente
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    // Resetar contas selecionadas quando mudar de cliente
    setSelectedAccounts({
      meta: [],
      google: []
    });
  };

  // Função para lidar com a mudança de contas
  const handleAccountsChange = (accounts: {meta: string[], google: string[]}) => {
    setSelectedAccounts(accounts);
  };

  // Função para lidar com a mudança de filtros
  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilter(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Função para lidar com a mudança de período
  const handleDateRangeChange = (range: {from: Date, to: Date}) => {
    setDateRange(range);
  };

  // Função para lidar com a mudança de período de comparação
  const handleCompareWithChange = (range: {from: Date, to: Date} | null) => {
    setCompareWith(range);
  };

  // Função para alternar o modo de demonstração
  const toggleDemoMode = () => {
    setDemoMode(!demoMode);
    if (!demoMode) {
      // Ativar modo demo
      setMetricsData(demoData);
      setLoading(false);
      setError(null);
    } else {
      // Desativar modo demo
      setMetricsData(null);
      // Recarregar dados reais se houver cliente e contas selecionadas
      if (selectedClientId && (selectedAccounts.meta.length > 0 || selectedAccounts.google.length > 0)) {
        fetchData();
      }
    }
  };

  // Função para buscar dados
  const fetchData = async () => {
    if (!selectedClientId || (selectedAccounts.meta.length === 0 && selectedAccounts.google.length === 0)) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Formatar datas para a API
      const formattedDateRange = {
        start: format(dateRange.from, 'yyyy-MM-dd'),
        end: format(dateRange.to, 'yyyy-MM-dd')
      };
      
      // Formatar período de comparação se existir
      const formattedCompareWith = compareWith ? {
        start: format(compareWith.from, 'yyyy-MM-dd'),
        end: format(compareWith.to, 'yyyy-MM-dd')
      } : undefined;
      
      // Buscar dados de campanhas
      const campaignsResponse = await campaignsApi.listCampaigns(
        selectedClientId,
        formattedDateRange
      );
      
      // Buscar insights
      const insightsResponse = await campaignsApi.getInsights(
        selectedClientId,
        formattedDateRange,
        formattedCompareWith
      );
      
      if (campaignsResponse.success && insightsResponse.success) {
        // Processar dados para o formato esperado pelos componentes
        // Em uma implementação real, processaríamos os dados da API aqui
        // Por enquanto, vamos usar os dados simulados
        setMetricsData(demoData);
      } else {
        setError(campaignsResponse.error || insightsResponse.error || 'Erro ao buscar dados');
      }
    } catch (err) {
      setError('Erro ao buscar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para buscar dados quando mudar cliente, contas ou período
  useEffect(() => {
    if (demoMode) {
      // No modo demo, sempre usar dados simulados
      setMetricsData(demoData);
      return;
    }
    
    fetchData();
  }, [selectedClientId, selectedAccounts, dateRange, compareWith, activeFilter, demoMode]);

  return (
    <div className="min-h-screen bg-dark-blue">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          {/* Modo de Demonstração */}
          <div className="flex items-center justify-end mb-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="demo-mode" 
                checked={demoMode}
                onCheckedChange={toggleDemoMode}
              />
              <Label 
                htmlFor="demo-mode" 
                className="text-white cursor-pointer"
              >
                Modo Demonstração
              </Label>
            </div>
          </div>
          
          {!demoMode && (
            <>
              {/* Seletor de Cliente */}
              <ClientTabSelector 
                onClientChange={handleClientChange}
                selectedClientId={selectedClientId}
              />
              
              {/* Seletor de Contas */}
              {selectedClientId && (
                <AccountSelector 
                  clientId={selectedClientId}
                  onAccountsChange={handleAccountsChange}
                  selectedAccounts={selectedAccounts}
                />
              )}
            </>
          )}
          
          {/* Seletor de Período */}
          <div className="mb-6">
            <DateRangePicker 
              onChange={handleDateRangeChange}
              onCompareChange={handleCompareWithChange}
              value={dateRange}
              compareValue={compareWith}
            />
          </div>
          
          {/* Filtros */}
          <FilterBar 
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
          
          {/* Conteúdo do Dashboard */}
          {loading ? (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32 bg-gray-800/50" />
                ))}
              </div>
              <Skeleton className="h-64 bg-gray-800/50" />
              <Skeleton className="h-96 bg-gray-800/50" />
            </div>
          ) : error ? (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-700 rounded-md text-red-400">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-sm text-yellow-freaky hover:underline mt-2"
              >
                Tentar novamente
              </button>
            </div>
          ) : metricsData ? (
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                  title="Investido"
                  value={metricsData.invested}
                  change={{ value: "17,5%", isPositive: true }}
                  progressPercentage={100}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
                <MetricCard 
                  title="Resultado"
                  value={metricsData.result}
                  change={{ value: "22,2%", isPositive: true }}
                  progressPercentage={127}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
                <MetricCard 
                  title="Custo por Resultado"
                  value={metricsData.costPerResult}
                  change={{ value: "5,3%", isPositive: false }}
                  progressPercentage={78}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  }
                />
                <MetricCard 
                  title="Retorno"
                  value={metricsData.returnRate}
                  change={{ value: "11,9%", isPositive: true }}
                  progressPercentage={131}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  }
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                <div className="lg:col-span-2">
                  <TimelineChart 
                    title="Visão Temporal"
                    data={metricsData.timelineData}
                  />
                </div>
                <div>
                  <DonutChart 
                    title="Devices / Demográficos"
                    data={metricsData.deviceData}
                  />
                </div>
              </div>
              
              {/* Seção de Melhores Conteúdos */}
              <div className="mt-4">
                <BestContents 
                  data={metricsData.bestContents}
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                <div className="lg:col-span-2">
                  <DataTable 
                    title="Campaign"
                    data={metricsData.campaignData}
                  />
                </div>
                <div>
                  <div className="grid grid-cols-1 gap-4">
                    <AdPreview 
                      title="Melhores Anúncios"
                      ads={metricsData.adsData}
                    />
                    <PeriodBarChart 
                      title="Período"
                      data={metricsData.periodData}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <MetricCard 
                  title="Impressões"
                  value={metricsData.impressions}
                  change={{ value: "10,5%", isPositive: true }}
                />
                <MetricCard 
                  title="Cliques"
                  value={metricsData.clicks}
                  change={{ value: "8,8%", isPositive: true }}
                />
                <MetricCard 
                  title="CPC"
                  value={metricsData.cpc}
                  change={{ value: "4,9%", isPositive: false }}
                />
                <MetricCard 
                  title="CPM"
                  value={metricsData.cpm}
                  change={{ value: "1,2%", isPositive: false }}
                />
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-md text-yellow-400">
              <p>Selecione um cliente e contas de anúncios para visualizar os dados ou ative o modo de demonstração.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
