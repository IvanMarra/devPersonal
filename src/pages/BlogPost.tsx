import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Share2, MessageCircle, Linkedin, Github, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DetailHeader from "@/components/DetailHeader";
import DetailFooter from "@/components/DetailFooter";
import BreadcrumbSmart from "@/components/BreadcrumbSmart";
import ScrollToTop from "@/components/ScrollToTop";

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Mock data - na implementação real, isso viria de uma API ou contexto
  const posts = {
    "futuro-ia-negocios": {
      id: 1,
      title: "O Futuro da Inteligência Artificial nos Negócios",
      image: "/lovable-uploads/79f88611-826d-44cf-84d5-7162ba664346.png",
      content: `A Inteligência Artificial está transformando radicalmente o mundo dos negócios. Nos últimos anos, testemunhamos uma evolução sem precedentes nas capacidades da IA, desde assistentes virtuais até sistemas complexos de tomada de decisão.

## O Estado Atual da IA nos Negócios

Hoje, empresas de todos os tamanhos estão implementando soluções de IA para:

• **Automação de Processos**: Redução de tarefas repetitivas e melhoria da eficiência operacional
• **Análise de Dados**: Extração de insights valiosos de grandes volumes de informação
• **Atendimento ao Cliente**: Chatbots e assistentes virtuais disponíveis 24/7
• **Predição e Forecasting**: Antecipação de tendências de mercado e demanda

## Tendências para os Próximos Anos

### 1. IA Generativa Empresarial
A popularização de modelos como ChatGPT e Claude está levando as empresas a desenvolver suas próprias soluções de IA generativa, personalizadas para seus contextos específicos.

### 2. Automação Inteligente
Vamos além da RPA (Robotic Process Automation) tradicional, integrando IA para tomada de decisões complexas em fluxos automatizados.

### 3. IA Ética e Responsável
Crescente preocupação com transparência, viés algorítmico e responsabilidade nas decisões tomadas por sistemas de IA.

## Desafios e Oportunidades

**Principais Desafios:**
• Falta de profissionais qualificados
• Questões de privacidade e segurança
• Resistência à mudança organizacional
• Custos de implementação inicial

**Grandes Oportunidades:**
• Vantagem competitiva sustentável
• Novos modelos de negócio
• Melhoria da experiência do cliente
• Otimização de custos operacionais

## Preparando-se para o Futuro

Para se manter competitiva, sua empresa deve:

1. **Investir em Capacitação**: Treinar equipes em conceitos e ferramentas de IA
2. **Começar Pequeno**: Implementar projetos piloto antes de grandes transformações
3. **Parceria Estratégica**: Trabalhar com especialistas para acelerar a adoção
4. **Cultura Data-Driven**: Desenvolver uma mentalidade orientada por dados

## Conclusão

A IA não é mais uma tecnologia do futuro - é uma realidade presente que está redefinindo a forma como fazemos negócios. Empresas que abraçarem essas mudanças hoje terão vantagens significativas amanhã.

O futuro pertence àqueles que souberem combinar a potência da tecnologia com a criatividade humana, criando soluções que realmente agregam valor aos clientes e à sociedade.`,
      date: "15 de Novembro, 2024",
      author: "Ivan Marra",
      category: "Tendências",
      readTime: "5 min",
      tags: ["IA", "Negócios", "Inovação", "Futuro"]
    },
    "ferramentas-ia-profissional": {
      id: 2,
      title: "10 Ferramentas de IA que Todo Profissional Deveria Conhecer",
      image: "/lovable-uploads/c04ef8d5-afd6-40b7-8a00-e000c8a5a7b5.png",
      content: `No mundo atual, dominar ferramentas de IA tornou-se essencial para profissionais de todas as áreas. Aqui estão as 10 principais ferramentas que podem revolucionar sua produtividade.

## 1. ChatGPT (OpenAI)
**Uso principal**: Assistente conversacional para redação, brainstorming e resolução de problemas
**Por que usar**: Versatilidade e facilidade de uso para diversas tarefas profissionais

## 2. Midjourney
**Uso principal**: Geração de imagens e arte digital
**Por que usar**: Qualidade excepcional para criação de conteúdo visual profissional

## 3. Notion AI
**Uso principal**: Organização, escrita e gestão de projetos
**Por que usar**: Integração perfeita com workflows existentes

## 4. GitHub Copilot
**Uso principal**: Assistente de programação
**Por que usar**: Acelera significativamente o desenvolvimento de código

## 5. Jasper AI
**Uso principal**: Marketing de conteúdo e copywriting
**Por que usar**: Especificamente otimizado para conteúdo comercial

## 6. Synthesia
**Uso principal**: Criação de vídeos com avatares IA
**Por que usar**: Produção de conteúdo em vídeo sem necessidade de gravação

## 7. Otter.ai
**Uso principal**: Transcrição e resumo de reuniões
**Por que usar**: Economia de tempo e melhoria na documentação de meetings

## 8. Claude (Anthropic)
**Uso principal**: Análise de documentos e assistência em tarefas complexas
**Por que usar**: Excelente para trabalhos que requerem raciocínio profundo

## 9. Canva AI
**Uso principal**: Design gráfico automatizado
**Por que usar**: Criação rápida de materiais visuais profissionais

## 10. Zapier AI
**Uso principal**: Automação de workflows
**Por que usar**: Conecta diferentes aplicações de forma inteligente

## Como Começar

### Passo 1: Identifique suas Necessidades
Analise quais tarefas consomem mais tempo no seu dia a dia profissional.

### Passo 2: Comece com Ferramentas Gratuitas
Muitas dessas ferramentas oferecem versões gratuitas ou trials.

### Passo 3: Experimente e Itere
Teste diferentes abordagens até encontrar o que funciona melhor para você.

### Passo 4: Integre Gradualmente
Implemente uma ferramenta por vez em seu workflow.

## Dicas de Produtividade

• **Prompts Eficazes**: Aprenda a fazer perguntas específicas e claras
• **Combinação de Ferramentas**: Use diferentes IAs para diferentes etapas do processo
• **Revisão Humana**: Sempre revise e adapte os resultados gerados pela IA
• **Aprendizado Contínuo**: Mantenha-se atualizado com novas funcionalidades

## Conclusão

Estas ferramentas não substituem o julgamento humano, mas amplificam significativamente nossas capacidades. O profissional do futuro é aquele que sabe combinar IA com expertise humana para entregar resultados excepcionais.

Comece hoje mesmo a experimentar essas ferramentas e veja como elas podem transformar sua produtividade!`,
      date: "12 de Novembro, 2024",
      author: "Ivan Marra",
      category: "Produtividade",
      readTime: "8 min",
      tags: ["Ferramentas", "IA", "Produtividade", "Tecnologia"]
    },
    "implementar-chatgpt-empresa": {
      id: 3,
      title: "Como Implementar ChatGPT na sua Empresa: Guia Prático",
      image: "/lovable-uploads/f67e421c-204b-438a-99af-4e0462ee0ed2.png",
      content: `A implementação de ChatGPT ou outras soluções de IA generativa em empresas requer planejamento estratégico e execução cuidadosa. Este guia fornece um roadmap prático para essa transformação.

## Fase 1: Avaliação e Planejamento

### Análise de Necessidades
Antes de implementar qualquer solução de IA, é crucial entender:
• Quais processos podem ser otimizados?
• Onde há gargalos de produtividade?
• Que tipo de conteúdo é gerado frequentemente?
• Qual o nível de maturidade digital da empresa?

### Definição de Objetivos
Estabeleça metas claras e mensuráveis:
• Redução de tempo em tarefas específicas
• Melhoria na qualidade do atendimento ao cliente
• Aumento na produção de conteúdo
• Economia de custos operacionais

## Fase 2: Escolha da Solução

### Opções Disponíveis

**ChatGPT Enterprise**
• Maior privacidade e segurança
• Análise de dados da empresa
• Controles administrativos avançados

**Azure OpenAI Service**
• Integração com ecosistema Microsoft
• Controle total sobre dados
• Conformidade empresarial

**Soluções Custom**
• APIs próprias
• Modelos fine-tuned
• Máximo controle e personalização

## Fase 3: Implementação Gradual

### Projeto Piloto
Comece com um departamento ou caso de uso específico:
• Atendimento ao cliente
• Criação de conteúdo para marketing
• Análise de documentos
• Geração de relatórios

### Métricas de Sucesso
Defina KPIs para avaliar o impacto:
• Tempo médio de resposta
• Taxa de resolução
• Satisfação do usuário
• ROI (Retorno sobre Investimento)

## Fase 4: Capacitação da Equipe

### Treinamento Técnico
• Como usar as ferramentas
• Melhores práticas de prompting
• Limitações e cuidados necessários

### Mudança Cultural
• Benefícios da IA como assistente
• Superação do medo de substituição
• Foco na colaboração humano-IA

## Fase 5: Governança e Segurança

### Políticas de Uso
Estabeleça diretrizes claras:
• Que tipos de informação podem ser processadas
• Procedimentos de revisão humana
• Políticas de privacidade de dados
• Responsabilidades e limites

### Segurança de Dados
• Criptografia end-to-end
• Controle de acesso
• Auditoria de uso
• Backup e recovery

## Casos de Uso Práticos

### 1. Atendimento ao Cliente
**Implementação**: Chatbot integrado com sistema de tickets
**Benefícios**: Resposta 24/7, redução de tempo de espera
**Cuidados**: Escalação humana para casos complexos

### 2. Criação de Conteúdo
**Implementação**: Assistente para copywriters e designers
**Benefícios**: Maior velocidade na produção, ideias criativas
**Cuidados**: Revisão de marca e tom de voz

### 3. Análise de Documentos
**Implementação**: Processamento de contratos e relatórios
**Benefícios**: Extração rápida de insights, resumos automáticos
**Cuidados**: Validação de informações críticas

## Desafios Comuns e Soluções

### Resistência à Mudança
**Problema**: Funcionários receosos com nova tecnologia
**Solução**: Comunicação transparente sobre benefícios e treinamento adequado

### Qualidade Inconsistente
**Problema**: Respostas variáveis da IA
**Solução**: Refinamento de prompts e processo de revisão humana

### Custos Inesperados
**Problema**: Gastos além do orçamento inicial
**Solução**: Monitoramento contínuo de uso e otimização

## ROI e Métricas

### Cálculo do Retorno
• Tempo economizado × Custo hora do funcionário
• Redução de custos operacionais
• Aumento na produtividade
• Melhoria na satisfação do cliente

### Monitoramento Contínuo
• Dashboard de métricas em tempo real
• Relatórios semanais de impacto
• Feedback regular dos usuários
• Ajustes baseados em dados

## Próximos Passos

1. **Avalie** sua situação atual e defina objetivos
2. **Escolha** a solução mais adequada ao seu contexto
3. **Implemente** um projeto piloto
4. **Meça** resultados e ajuste conforme necessário
5. **Expanda** para outras áreas da empresa

## Conclusão

A implementação bem-sucedida de ChatGPT em empresas não é apenas sobre tecnologia - é sobre transformação organizacional. Com planejamento adequado, treinamento efetivo e governança apropriada, sua empresa pode colher os benefícios significativos que a IA generativa oferece.

Lembre-se: o objetivo não é substituir pessoas, mas capacitá-las para serem mais produtivas, criativas e estratégicas em suas funções.`,
      date: "8 de Novembro, 2024",
      author: "Ivan Marra",
      category: "Tutorial",
      readTime: "12 min",
      tags: ["ChatGPT", "Implementação", "Empresa", "Guia"]
    },
    "ia-etica-2025": {
      id: 4,
      title: "IA Ética: Desafios e Oportunidades para 2025",
      image: "/lovable-uploads/fae8a34a-7541-4b6e-a92b-a50d289c38a2.png",
      content: `À medida que a Inteligência Artificial se torna mais presente em nossas vidas, questões éticas tornam-se cada vez mais críticas. Este artigo explora os principais desafios e oportunidades da IA ética para 2025.

## O Cenário Atual da IA Ética

A discussão sobre ética em IA não é nova, mas ganhou urgência com o avanço de modelos de linguagem como GPT-4, Claude e Gemini. Questões que antes eram teóricas agora impactam milhões de usuários diariamente.

### Principais Preocupações Atuais
• **Viés Algorítmico**: Sistemas que perpetuam preconceitos sociais
• **Transparência**: Dificuldade em explicar decisões da IA
• **Privacidade**: Uso indevido de dados pessoais
• **Desinformação**: Geração de conteúdo falso ou enganoso
• **Impacto no Emprego**: Automação e deslocamento de trabalhadores

## Marcos Regulatórios Emergentes

### União Europeia - AI Act
A Europa lidera com regulamentação abrangente:
• Classificação de riscos por categoria
• Proibição de certas aplicações de IA
• Requisitos de transparência e auditoria
• Multas significativas por não conformidade

### Estados Unidos - Abordagem Setorial
• Executive Order sobre IA (Biden, 2023)
• Regulamentação por agências específicas
• Foco em pesquisa e desenvolvimento responsável
• Parcerias público-privadas

### Brasil - Projeto de Lei 2338/2023
• Marco legal brasileiro para IA
• Foco em direitos fundamentais
• Governança e responsabilização
• Sandbox regulatório para inovação

## Desafios para 2025

### 1. Implementação Prática da Regulamentação
**Desafio**: Transformar leis em práticas empresariais efetivas
**Impacto**: Necessidade de novas competências e processos

### 2. Auditoria e Explicabilidade
**Desafio**: Criar métodos para auditar sistemas de IA complexos
**Impacto**: Demanda por ferramentas de interpretabilidade

### 3. Governança Global
**Desafio**: Coordenar regulamentações entre diferentes países
**Impacto**: Fragmentação do mercado global de IA

### 4. Educação e Literacia Digital
**Desafio**: Capacitar sociedade para entender e usar IA responsavelmente
**Impacto**: Necessidade de programas educacionais massivos

## Oportunidades Estratégicas

### 1. Vantagem Competitiva Ética
Empresas que adotarem práticas éticas terão:
• Maior confiança dos consumidores
• Menor risco regulatório
• Melhor reputação de marca
• Acesso a investimentos ESG

### 2. Inovação em IA Responsável
Oportunidades emergentes:
• Ferramentas de detecção de viés
• Sistemas de explicabilidade
• Tecnologias de preservação de privacidade
• Auditoria automatizada de IA

### 3. Novos Modelos de Negócio
• Certificação ética de sistemas de IA
• Consultoria em conformidade regulatória
• Seguros para riscos de IA
• Plataformas de IA ética

## Framework para IA Ética

### Princípios Fundamentais

**1. Transparência**
• Explicabilidade das decisões
• Documentação de processos
• Comunicação clara com usuários

**2. Responsabilidade**
• Accountability humana
• Processos de revisão
• Mecanismos de correção

**3. Equidade**
• Tratamento justo para todos os grupos
• Mitigação de vieses
• Inclusão e diversidade

**4. Privacidade**
• Proteção de dados pessoais
• Consentimento informado
• Minimização de coleta

**5. Beneficência**
• Foco no bem-estar humano
• Consideração de impactos sociais
• Sustentabilidade ambiental

### Implementação Prática

**Governança Organizacional**
• Comitê de ética em IA
• Políticas e procedimentos claros
• Treinamento regular da equipe
• Monitoramento contínuo

**Processos Técnicos**
• Avaliação de impacto de IA
• Testes de viés e equidade
• Documentação de modelos
• Auditoria regular de sistemas

## Tendências para 2025

### 1. Regulamentação Mais Específica
Espera-se regulamentações mais detalhadas para:
• Sistemas de reconhecimento facial
• IA em saúde e educação
• Algoritmos de contratação
• Sistemas de pontuação social

### 2. Ferramentas de Conformidade
Crescimento no mercado de:
• Plataformas de auditoria automatizada
• Ferramentas de explicabilidade
• Sistemas de monitoramento de viés
• Soluções de privacidade diferencial

### 3. Certificações e Padrões
Desenvolvimento de:
• ISO/IEC standards para IA ética
• Certificações setoriais
• Selos de conformidade
• Benchmarks de avaliação

## Recomendações para Empresas

### Ação Imediata
1. **Audite** seus sistemas de IA atuais
2. **Estabeleça** comitê de ética em IA
3. **Desenvolva** políticas internas
4. **Treine** equipes em princípios éticos

### Preparação para 2025
1. **Invista** em ferramentas de explicabilidade
2. **Desenvolva** processos de auditoria
3. **Estabeleça** parcerias com especialistas em ética
4. **Monitore** desenvolvimentos regulatórios

## Conclusão

A IA ética não é apenas uma obrigação regulatória - é uma oportunidade estratégica. Organizações que abraçarem práticas éticas hoje estarão melhor posicionadas para prosperar no futuro regulado de 2025.

O desafio não é técnico, mas cultural: precisamos construir uma mentalidade que coloque valores humanos no centro do desenvolvimento tecnológico. Isso requer esforço coordenado entre desenvolvedores, empresas, reguladores e sociedade civil.

A IA do futuro será ética por design, não por acidente. E esse futuro começa agora.`,
      date: "5 de Novembro, 2024",
      author: "Ivan Marra",
      category: "Reflexão",
      readTime: "7 min",
      tags: ["IA Ética", "Regulamentação", "2025", "Responsabilidade"]
    }
  };

  const post = posts[slug as keyof typeof posts];

  if (!post) {
    return (
      <div className="min-h-screen terminal-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4 font-mono">
            <span className="text-primary">404:</span> Artigo não encontrado
          </h1>
          <Button onClick={() => navigate('/')} variant="terminal">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  const relatedPosts = Object.entries(posts).filter(([, p]) => p.id !== post.id).slice(0, 3).map(([slug, p]) => ({ ...p, slug }));

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `${post.title} - ${post.content.substring(0, 150)}...`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/5531975633080?text=${encodeURIComponent(`${text}\n\n${url}`)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'github':
        shareUrl = `https://github.com/`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen terminal-bg">
      {/* Header */}
      <DetailHeader />
      
      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${post.image || '/src/assets/ivan-profile.png'})`
          }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 terminal-window">
                  BLOG
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-4 font-mono">
                <span className="text-primary">$ cat </span>{post.title}
                <span className="animate-terminal-blink">|</span>
              </h1>
              <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Breadcrumb */}
      {slug && <BreadcrumbSmart type="blog" currentSlug={slug} currentTitle={post?.title} />}

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Article Header */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 terminal-window">
                  {post.category}
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 font-mono">
                <span className="text-primary">$ cat </span>
                <span className="animate-typing">{post.title}</span>
                <span className="animate-blink-cursor">|</span>
              </h1>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground font-mono mb-8">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </div>
                <div className="text-primary">
                  {post.readTime} de leitura
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-sm font-mono text-muted-foreground">
                  <span className="text-primary"># </span>Compartilhar:
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('whatsapp')}
                  className="text-muted-foreground hover:text-primary"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('linkedin')}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('github')}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Github className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Article Content */}
            <Card className="terminal-window">
              <CardContent className="p-8">
                <div className="prose prose-invert max-w-none font-mono text-sm leading-relaxed">
                  <div className="whitespace-pre-line text-muted-foreground">
                    {post.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-foreground mb-4 font-mono">
                <span className="text-primary">{'>'}</span> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs font-mono text-primary border border-primary/30 px-2 py-1 terminal-window">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Related Posts */}
              <Card className="terminal-window mb-8">
                <CardHeader>
                  <CardTitle className="text-lg font-mono">
                    <span className="text-primary">{'>'}</span> Outros Artigos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <div 
                      key={relatedPost.id}
                      className="cursor-pointer group"
                      onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                    >
                      <h4 className="font-mono text-sm group-hover:text-primary transition-colors duration-200 mb-1">
                        {relatedPost.title}
                      </h4>
                      <p className="text-xs text-muted-foreground font-mono">
                        {relatedPost.date} • {relatedPost.readTime}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Back to Blog */}
              <Button 
                onClick={() => navigate('/')}
                variant="terminal"
                className="w-full"
              >
                <span className="font-mono">$ cd ../blog</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <DetailFooter />
      
      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  );
};

export default BlogPost;