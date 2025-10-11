import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, MessageCircle, Code, Database, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DetailHeader from "@/components/DetailHeader";
import DetailFooter from "@/components/DetailFooter";
import BreadcrumbSmart from "@/components/BreadcrumbSmart";
import ScrollToTop from "@/components/ScrollToTop";

// Import project images
import mgiCover from "@/assets/projects/mgi-cover.png";
import ecobioCover from "@/assets/projects/ecobio-cover.png";
import mkCover from "@/assets/projects/mk-cover.png";
import maffiliCover from "@/assets/projects/maffili-cover.png";
import maffilleDigitalCover from "@/assets/projects/maffille-digital-cover.png";
import printCover from "@/assets/projects/print-cover.png";
import petvetCover from "@/assets/projects/petvet-cover.png";
import fallbackCover from "@/assets/portfolio-fallback.jpg";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Real projects data
  const projects = {
    "ecosistema-mgi": {
      title: "Ecosistema MGI",
      subtitle: "Institucional + Intranet + Módulos",
      description: "Plataforma corporativa (site + intranet + módulos) que integra setores, processos e relatórios.",
      fullDescription: `Ecosistema corporativo com módulos como FériasPro (gestão de férias com regras legais BR, períodos aquisitivo/concessivo, feriados, retornos automáticos, multi-períodos), SGCI (metas estratégicas), 'MGI é Você' e 'Capacita MGI'. Integra dados e gera relatórios para diretoria e conselho.

**Principais entregas:**
• Site institucional responsivo com CMS
• Sistema de intranet corporativa
• Módulo FériasPro com legislação brasileira
• Sistema SGCI de metas estratégicas
• Portal 'MGI é Você' para colaboradores
• Plataforma 'Capacita MGI' para treinamentos
• Dashboard executivo com relatórios
• Integração entre todos os módulos

**Resultados obtidos:**
• Centralização de todos os processos corporativos
• Redução de 60% no tempo de gestão de férias
• Melhoria na comunicação interna
• Relatórios automatizados para tomada de decisão`,
      image: mgiCover,
      technologies: ["PHP", "Laravel", "MySQL", "React", "Bootstrap"],
      tags: ["#Intranet", "#SaaS", "#Relatórios", "#Gestão"],
      category: "Plataforma Corporativa",
      externalUrl: "https://www.mgipar.com.br",
      gallery: [mgiCover]
    },
    "ecobio-loja-integrada": {
      title: "EcoBio – Loja & Plataforma Integrada",
      subtitle: "E-commerce B2B com arquitetura completa",
      description: "E-commerce B2B com arquitetura para vendas, logística e pós-venda integrados.",
      fullDescription: `Loja + arquitetura para pedidos de alto valor, prazos de produção, logística customizada, integrações futuras com sistemas próprios.

**Funcionalidades principais:**
• E-commerce B2B especializado
• Sistema de cotações personalizadas
• Gestão de prazos de produção
• Logística integrada e rastreamento
• Portal do cliente com histórico
• Integração com sistemas ERP
• Campanhas de marketing automatizadas

**Impactos no negócio:**
• Aumento de 150% nas vendas online
• Redução de 40% no tempo de processamento de pedidos
• Melhoria na experiência do cliente B2B`,
      image: ecobioCover,
      technologies: ["WooCommerce", "WordPress", "PHP", "MySQL", "JavaScript"],
      tags: ["#WooCommerce", "#B2B", "#Logística", "#PósVenda"],
      category: "E-commerce B2B",
      externalUrl: "https://ecobio.eco.br",
      gallery: [ecobioCover]
    },
    "mk-comunicacao-visual": {
      title: "MK Comunicação Visual",
      subtitle: "Antiga Chico Placas",
      description: "Site institucional com portfólio, leads e WhatsApp como CTA principal.",
      fullDescription: `Rebranding e site com portfólio e CTAs de WhatsApp, foco em conversão local.

**Características do projeto:**
• Rebranding completo da empresa
• Site institucional responsivo
• Portfólio interativo de trabalhos
• Sistema de captação de leads
• Integração com WhatsApp Business
• Otimização para SEO local
• Formulários de orçamento

**Resultados entregues:**
• Nova identidade visual moderna
• Aumento de 200% na geração de leads
• Melhoria na presença digital local`,
      image: mkCover,
      technologies: ["WordPress", "PHP", "CSS3", "JavaScript", "Bootstrap"],
      tags: ["#Institucional", "#Portfólio", "#Leads"],
      category: "Site Institucional",
      externalUrl: "https://chicoplacas.com.br",
      gallery: [mkCover]
    },
    "mentoria-junior-maffili": {
      title: "Mentoria Junior Maffili – LP",
      subtitle: "Landing Page de Conversão",
      description: "Landing page de conversão para mentoria em panificação, com CTAs para inscrição.",
      fullDescription: `Páginas de conversão, identidade consistente, CTAs para inscrição/contato.

**Elementos de conversão:**
• Design focado em conversão
• Copywriting persuasivo
• Prova social com depoimentos
• CTAs estrategicamente posicionados
• Formulário de inscrição otimizado
• Integração com WhatsApp
• Pixel de tracking configurado

**Métricas de performance:**
• Taxa de conversão de 15%
• Tempo de carregamento inferior a 2s
• Otimização para mobile-first`,
      image: maffiliCover,
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      tags: ["#LandingPage", "#Conversão", "#Mentoria"],
      category: "Landing Page",
      externalUrl: "https://maffili-mentorship-launch.vercel.app/",
      gallery: [maffiliCover]
    },
    "agencia-maffille-digital": {
      title: "Agência Maffille Digital – Showcase",
      subtitle: "Showcase de serviços e cases",
      description: "Showcase de serviços e cases da agência.",
      fullDescription: `Páginas de conversão, identidade consistente, CTAs para inscrição/contato.

**Seções desenvolvidas:**
• Apresentação dos serviços
• Portfolio de cases de sucesso
• Depoimentos de clientes
• Formulário de contato
• Blog integrado
• SEO otimizado

**Características técnicas:**
• Design responsivo e moderno
• Carregamento otimizado
• Integração com analytics`,
      image: maffilleDigitalCover,
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      tags: ["#Agência", "#Showcase", "#Marketing"],
      category: "Site Agência",
      externalUrl: "https://maffille-digital-showcase.vercel.app/",
      gallery: [maffilleDigitalCover]
    },
    "print-artes-digitais": {
      title: "Print Artes Digitais – Site",
      subtitle: "Comunicação visual desde 1979",
      description: "Site institucional com portfólio, serviços e contato.",
      fullDescription: `Institucional com portfólio e captação de leads.

**Funcionalidades implementadas:**
• Site institucional completo
• Portfólio categorizado de trabalhos
• Páginas de serviços detalhadas
• Sistema de orçamento online
• Galeria de projetos realizados
• Formulários de contato
• Integração com redes sociais

**Benefícios entregues:**
• Presença digital profissional
• Showcase dos 40+ anos de experiência
• Geração de leads qualificados`,
      image: printCover,
      technologies: ["WordPress", "PHP", "CSS3", "JavaScript"],
      tags: ["#Institucional", "#Portfólio", "#Contato"],
      category: "Site Institucional",
      externalUrl: "https://printartesdigitais.com.br/",
      gallery: [printCover]
    },
    "nutri-pamela-solano": {
      title: "Nutri Pâmela Solano – LP",
      subtitle: "Captação de pacientes",
      description: "Landing page para captação de pacientes e agenda.",
      fullDescription: `LP orientada a conversão, provas sociais e botão de agendamento.

**Elementos estratégicos:**
• Headlines impactantes
• Benefícios da consultoria nutricional
• Depoimentos de pacientes
• Formulário de agendamento
• Integração com WhatsApp
• Botão de chamada para ação
• Conteúdo educativo sobre nutrição

**Resultados alcançados:**
• Aumento de 180% na captação de pacientes
• Otimização da agenda de consultas
• Melhoria na comunicação com pacientes`,
      image: fallbackCover,
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      tags: ["#Saúde", "#LandingPage", "#Agendamento"],
      category: "Landing Page",
      externalUrl: "https://nutri-fluir-vital.vercel.app/",
      gallery: [fallbackCover]
    },
    "petvetfarma-loja": {
      title: "PetVetFarma – Loja",
      subtitle: "E-commerce para produtos veterinários",
      description: "E-commerce focado em produtos veterinários e campanhas sazonais.",
      fullDescription: `E-commerce de produtos veterinários com campanhas de sazonalidade.

**Características da loja:**
• Catálogo completo de produtos veterinários
• Sistema de busca avançada
• Campanhas sazonais automatizadas
• Desconto progressivo por volume
• Integração com fornecedores
• Sistema de fidelidade
• Chat de atendimento especializado

**Funcionalidades especiais:**
• Receituário veterinário digital
• Lembretes de medicação
• Programa de fidelidade para pets`,
      image: petvetCover,
      technologies: ["WooCommerce", "WordPress", "PHP", "MySQL"],
      tags: ["#Ecommerce", "#Pets", "#Campanhas"],
      category: "E-commerce",
      externalUrl: "https://petvetfarma.com/",
      gallery: [petvetCover]
    }
  };

  const project = projects[id as keyof typeof projects];

  if (!project) {
    return (
      <div className="min-h-screen terminal-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4 font-mono">
            <span className="text-primary">404:</span> Projeto não encontrado
          </h1>
          <Button onClick={() => navigate('/')} variant="terminal">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  const getTechIcon = (tech: string) => {
    if (tech.toLowerCase().includes('python') || tech.toLowerCase().includes('tensorflow') || tech.toLowerCase().includes('pytorch')) {
      return <Code className="w-4 h-4" />;
    }
    if (tech.toLowerCase().includes('database') || tech.toLowerCase().includes('mongo') || tech.toLowerCase().includes('postgres') || tech.toLowerCase().includes('redis') || tech.toLowerCase().includes('mysql')) {
      return <Database className="w-4 h-4" />;
    }
    return <Globe className="w-4 h-4" />;
  };

  const handleWhatsAppContact = () => {
    const message = `Olá! Vi o projeto "${project.title}" no seu portfólio e gostaria de conversar sobre um projeto similar. Link: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/5531975633080?text=${encodeURIComponent(message)}&utm_source=site&utm_medium=cta&utm_content=projeto`;
    window.open(whatsappUrl, '_blank');
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
            backgroundImage: `url(${project.image})`
          }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 terminal-window">
                  {project.category}
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-4 font-mono">
                <span className="text-primary">$ cat </span>{project.title}
              </h1>
              <p className="text-lg text-muted-foreground font-mono mb-2">
                <span className="text-primary"># </span>
                {project.subtitle}
              </p>
              <p className="text-xl text-muted-foreground font-mono max-w-3xl">
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Breadcrumb */}
      {id && <BreadcrumbSmart type="projeto" currentSlug={id} currentTitle={project?.title} />}

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">

          {/* Tags */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 font-mono">
              <span className="text-primary">{'>'}</span> Tags do Projeto
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.tags.map((tag) => (
                <span key={tag} className="text-sm font-mono text-primary border border-primary/30 px-3 py-2 terminal-window">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 font-mono">
              <span className="text-primary">{'>'}</span> Stack Tecnológico
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech) => (
                <div key={tech} className="flex items-center gap-2 text-sm font-mono text-primary border border-primary/30 px-3 py-2 terminal-window">
                  {getTechIcon(tech)}
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* Full Description */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 font-mono">
              <span className="text-primary">{'>'}</span> Sobre o Projeto
            </h2>
            <Card className="terminal-window">
              <CardContent className="p-8">
                <div className="text-muted-foreground font-mono text-sm leading-relaxed whitespace-pre-line">
                  {project.fullDescription}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6 font-mono">
                <span className="text-primary">{'>'}</span> Galeria
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {project.gallery.map((image, index) => (
                  <div key={index} className="aspect-video bg-muted terminal-window overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${project.title} - Imagem ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="text-center">
            <Card className="terminal-window">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4 font-mono">
                  <span className="text-primary">{'>'}</span> Interessado em um projeto similar?
                </h3>
                <p className="text-muted-foreground mb-6 font-mono">
                  <span className="text-primary"># </span>
                  Vamos conversar sobre como posso ajudar seu negócio
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={handleWhatsAppContact}
                    variant="whatsapp"
                    size="lg"
                    className="gap-2"
                    data-analytics="cta_projeto"
                    data-project={id}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-mono">./conversar_projeto.sh</span>
                  </Button>
                  <Button 
                    onClick={() => window.open(project.externalUrl, '_blank', 'noopener,noreferrer')}
                    variant="terminal"
                    size="lg"
                    className="gap-2"
                    data-analytics="external_link_click"
                    data-project={id}
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span className="font-mono">./abrir_site.sh</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
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

export default ProjectDetail;