import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { aiDemoData } from '../mockData';
import { generateStrategy } from '../services/aiService';

const AIDemo = () => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [showStrategy, setShowStrategy] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStrategy, setCurrentStrategy] = useState(null);
  const [error, setError] = useState(null);

  // Icons mapping
  const iconMap = {
    'shopping-cart': '🛒',
    'credit-card': '💳',
    'heart-pulse': '❤️‍🩹',
    'graduation-cap': '🎓',
    'cloud': '☁️',
    'settings': '⚙️',
    'target': '🎯',
    'trending-up': '📈',
    'users': '👥',
    'zap': '⚡',
    'bar-chart': '📊',
    'message-circle': '💬'
  };

  const generateAIStrategy = async () => {
    if (!selectedIndustry || !selectedObjective) {
      console.warn('Missing industry or objective:', { selectedIndustry, selectedObjective });
      return;
    }
    
    console.log('Generating AI strategy for:', { 
      industry: selectedIndustry.label, 
      objective: selectedObjective.label 
    });
    
    setIsAnalyzing(true);
    setShowStrategy(false);
    setError(null);
    
    try {
      // Chamar a API real de IA
      console.log('Calling generateStrategy API...');
      const response = await generateStrategy(selectedIndustry.label, selectedObjective.label);
      console.log('Received AI response:', response);
      
      // Processar a resposta da IA
      const aiStrategy = {
        title: `Estratégia IA para ${selectedIndustry.label} - ${selectedObjective.label}`,
        description: response.strategy,
        // Manter métricas de impacto para apresentação visual
        impact: {
          eficiência: `+${Math.floor(Math.random() * 200 + 150)}%`,
          crescimento: `+${Math.floor(Math.random() * 150 + 100)}%`,
          roi: `+${Math.floor(Math.random() * 250 + 200)}%`
        },
        tactics: [] // A IA já inclui táticas na descrição
      };
      
      console.log('Setting current strategy:', aiStrategy);
      setCurrentStrategy(aiStrategy);
      setShowStrategy(true);
      
    } catch (error) {
      console.error('Erro ao gerar estratégia:', error);
      setError(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetDemo = () => {
    setSelectedIndustry(null);
    setSelectedObjective(null);
    setShowStrategy(false);
    setCurrentStrategy(null);
    setError(null);
  };

  return (
    <section id="ai-demo" className="py-24 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Radar Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent"></div>
        <svg className="w-full h-full" viewBox="0 0 800 600">
          <defs>
            <pattern id="radarGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8B5CF6" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#radarGrid)" />
          
          {/* Radar Circles */}
          <g className="animate-pulse">
            <circle cx="400" cy="300" r="50" fill="none" stroke="#8B5CF6" strokeWidth="1" opacity="0.3" />
            <circle cx="400" cy="300" r="100" fill="none" stroke="#6366F1" strokeWidth="1" opacity="0.2" />
            <circle cx="400" cy="300" r="150" fill="none" stroke="#8B5CF6" strokeWidth="1" opacity="0.1" />
          </g>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Calibre seu <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Alvo</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Descubra estratégias de IA personalizadas para seu setor e objetivo. Nossa inteligência artificial analisa e sugere a melhor abordagem.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto mt-8 rounded-full"></div>
        </div>

        {!showStrategy ? (
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Industry Selection */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                <span className="mr-2">🏭</span>
                Selecione seu Setor
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {aiDemoData.industries.map((industry) => (
                  <Card
                    key={industry.value}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedIndustry?.value === industry.value
                        ? 'bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-purple-500 shadow-lg shadow-purple-500/25 scale-105'
                        : 'bg-gray-900/50 border-gray-800 hover:border-purple-500/50 hover:bg-gray-800/50'
                    }`}
                    onClick={() => setSelectedIndustry(industry)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl mb-3">
                        {iconMap[industry.icon] || '🎯'}
                      </div>
                      <h4 className={`font-semibold ${
                        selectedIndustry?.value === industry.value 
                          ? 'text-white' 
                          : 'text-gray-300'
                      }`}>
                        {industry.label}
                      </h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Objective Selection */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                <span className="mr-2">🎯</span>
                Defina seu Objetivo
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {aiDemoData.objectives.map((objective) => (
                  <Card
                    key={objective.value}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedObjective?.value === objective.value
                        ? 'bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-indigo-500 shadow-lg shadow-indigo-500/25 scale-105'
                        : 'bg-gray-900/50 border-gray-800 hover:border-indigo-500/50 hover:bg-gray-800/50'
                    }`}
                    onClick={() => setSelectedObjective(objective)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl mb-3">
                        {iconMap[objective.icon] || '🎯'}
                      </div>
                      <h4 className={`font-semibold ${
                        selectedObjective?.value === objective.value 
                          ? 'text-white' 
                          : 'text-gray-300'
                      }`}>
                        {objective.label}
                      </h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Strategy Results
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-500/50 shadow-2xl">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-2xl animate-pulse">
                    🎯
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  {currentStrategy?.title}
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  {currentStrategy?.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Estratégia Principal */}
                <div>
                  <h4 className="text-purple-400 font-semibold mb-4 text-center text-lg">
                    Estratégia Gerada pela IA:
                  </h4>
                  <div className="bg-gray-800/30 p-6 rounded-lg">
                    <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {currentStrategy?.description}
                    </div>
                  </div>
                </div>

                {/* Impact Metrics */}
                <div>
                  <h4 className="text-indigo-400 font-semibold mb-4 text-center text-lg">
                    Impacto Projetado:
                  </h4>
                  <div className="grid grid-cols-3 gap-6">
                    {Object.entries(currentStrategy?.impact || {}).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="bg-gray-800/50 p-6 rounded-lg">
                          <div className="text-3xl font-bold text-white mb-2">{value}</div>
                          <div className="text-gray-400 capitalize">{key}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tactics (if available) */}
                {currentStrategy?.tactics && currentStrategy.tactics.length > 0 && (
                  <div>
                    <h4 className="text-green-400 font-semibold mb-4 text-center text-lg">
                      Táticas Recomendadas:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentStrategy.tactics.map((tactic, index) => (
                        <div key={index} className="flex items-center space-x-3 bg-gray-800/30 p-4 rounded-lg">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-300">{tactic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={resetDemo}
                    variant="outline" 
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Nova Análise
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                  >
                    Implementar Estratégia
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Generate Strategy Button */}
        {!showStrategy && (
          <div className="text-center mt-12">
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-red-400">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            <Button 
              size="lg"
              disabled={!selectedIndustry || !selectedObjective || isAnalyzing}
              className={`px-12 py-6 text-lg font-semibold rounded-lg transition-all duration-300 ${
                selectedIndustry && selectedObjective && !isAnalyzing
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl transform hover:scale-105'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              onClick={generateAIStrategy}
            >
              {isAnalyzing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Analisando com IA Gemini...</span>
                </div>
              ) : (
                <>
                  <span className="mr-2">🤖</span>
                  Gerar Estratégia com IA
                </>
              )}
            </Button>
            
            {(!selectedIndustry || !selectedObjective) && (
              <p className="text-gray-500 mt-4 text-sm">
                Selecione seu setor e objetivo para gerar uma estratégia personalizada
              </p>
            )}
          </div>
        )}

        {/* Demo Note */}
        <div className="text-center mt-16">
          <Badge variant="outline" className="border-purple-500/50 text-purple-300 px-4 py-2">
            <span className="mr-2">🤖</span>
            Powered by Gemini AI - Estratégias geradas em tempo real
          </Badge>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  );
};

export default AIDemo;