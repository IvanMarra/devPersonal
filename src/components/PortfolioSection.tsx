import { ExternalLink, Code, Database, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// Import project images
import mgiCover from "@/assets/projects/mgi-cover.png";
import ecobioCover from "@/assets/projects/ecobio-cover.png";
import mkCover from "@/assets/projects/mk-cover.png";
import maffiliCover from "@/assets/projects/maffili-cover.png";
import maffilleDigitalCover from "@/assets/projects/maffille-digital-cover.png";
import printCover from "@/assets/projects/print-cover.png";
import petvetCover from "@/assets/projects/petvet-cover.png";
import fallbackCover from "@/assets/portfolio-fallback.jpg";

const PortfolioSection = () => {
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      slug: "ecosistema-mgi",
      title: "Ecosistema MGI",
      subtitle: "Institucional + Intranet + Módulos",
      description: "Plataforma corporativa (site + intranet + módulos) que integra setores, processos e relatórios.",
      image: mgiCover,
      technologies: ["PHP", "Laravel", "MySQL", "React"],
      tags: ["#Intranet", "#SaaS", "#Relatórios", "#Gestão"],
      category: "Plataforma Corporativa",
      externalUrl: "https://www.mgipar.com.br"
    },
    {
      id: 2,
      slug: "ecobio-loja-integrada",
      title: "EcoBio – Loja & Plataforma Integrada",
      subtitle: "E-commerce B2B com arquitetura completa",
      description: "E-commerce B2B com arquitetura para vendas, logística e pós-venda integrados.",
      image: ecobioCover,
      technologies: ["WooCommerce", "WordPress", "PHP", "MySQL"],
      tags: ["#WooCommerce", "#B2B", "#Logística", "#PósVenda"],
      category: "E-commerce B2B",
      externalUrl: "https://ecobio.eco.br"
    },
    {
      id: 3,
      slug: "mk-comunicacao-visual",
      title: "MK Comunicação Visual",
      subtitle: "Antiga Chico Placas",
      description: "Site institucional com portfólio, leads e WhatsApp como CTA principal.",
      image: mkCover,
      technologies: ["WordPress", "PHP", "CSS3", "JavaScript"],
      tags: ["#Institucional", "#Portfólio", "#Leads"],
      category: "Site Institucional",
      externalUrl: "https://chicoplacas.com.br"
    },
    {
      id: 4,
      slug: "mentoria-junior-maffili",
      title: "Mentoria Junior Maffili – LP",
      subtitle: "Landing Page de Conversão",
      description: "Landing page de conversão para mentoria em panificação, com CTAs para inscrição.",
      image: maffiliCover,
      technologies: ["React", "Next.js", "TypeScript", "Tailwind"],
      tags: ["#LandingPage", "#Conversão", "#Mentoria"],
      category: "Landing Page",
      externalUrl: "https://maffili-mentorship-launch.vercel.app/"
    },
    {
      id: 5,
      slug: "agencia-maffille-digital",
      title: "Agência Maffille Digital – Showcase",
      subtitle: "Showcase de serviços e cases",
      description: "Showcase de serviços e cases da agência.",
      image: maffilleDigitalCover,
      technologies: ["React", "Next.js", "TypeScript", "Tailwind"],
      tags: ["#Agência", "#Showcase", "#Marketing"],
      category: "Site Agência",
      externalUrl: "https://maffille-digital-showcase.vercel.app/"
    },
    {
      id: 6,
      slug: "print-artes-digitais",
      title: "Print Artes Digitais – Site",
      subtitle: "Comunicação visual desde 1979",
      description: "Site institucional com portfólio, serviços e contato.",
      image: printCover,
      technologies: ["WordPress", "PHP", "CSS3", "JavaScript"],
      tags: ["#Institucional", "#Portfólio", "#Contato"],
      category: "Site Institucional",
      externalUrl: "https://printartesdigitais.com.br/"
    },
    {
      id: 7,
      slug: "nutri-pamela-solano",
      title: "Nutri Pâmela Solano – LP",
      subtitle: "Captação de pacientes",
      description: "Landing page para captação de pacientes e agenda.",
      image: fallbackCover,
      technologies: ["React", "Next.js", "TypeScript", "Tailwind"],
      tags: ["#Saúde", "#LandingPage", "#Agendamento"],
      category: "Landing Page",
      externalUrl: "https://nutri-fluir-vital.vercel.app/"
    },
    {
      id: 8,
      slug: "petvetfarma-loja",
      title: "PetVetFarma – Loja",
      subtitle: "E-commerce para produtos veterinários",
      description: "E-commerce focado em produtos veterinários e campanhas sazonais.",
      image: petvetCover,
      technologies: ["WooCommerce", "WordPress", "PHP", "MySQL"],
      tags: ["#Ecommerce", "#Pets", "#Campanhas"],
      category: "E-commerce",
      externalUrl: "https://petvetfarma.com/"
    }
  ];

  const getTechIcon = (tech: string) => {
    if (tech.toLowerCase().includes('python') || tech.toLowerCase().includes('tensorflow') || tech.toLowerCase().includes('pytorch')) {
      return <Code className="w-4 h-4" />;
    }
    if (tech.toLowerCase().includes('database') || tech.toLowerCase().includes('mongo') || tech.toLowerCase().includes('postgres') || tech.toLowerCase().includes('redis')) {
      return <Database className="w-4 h-4" />;
    }
    return <Globe className="w-4 h-4" />;
  };

  return (
    <section id="portfolio" className="py-20 terminal-bg">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="text-primary font-mono">~/projetos$</span>
            <div className="w-2 h-6 bg-primary animate-terminal-blink"></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 font-mono">
            <span className="text-primary">{'>'}</span> Trabalhos Realizados
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8 neon-glow"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-mono">
            <span className="text-primary"># </span>
            Projetos desenvolvidos com foco em inovação, tecnologia e resultados práticos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={project.id}
              className="terminal-window group cursor-pointer hover:neon-glow transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => navigate(`/projeto/${project.slug}`)}
              data-analytics="portfolio_card_click"
              data-project={project.slug}
            >
              <CardHeader className="pb-4">
                <div className="aspect-video bg-muted rounded overflow-hidden mb-4">
                  <img 
                    src={project.image} 
                    alt={`${project.title} - ${project.subtitle}`}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 terminal-window">
                    {project.category}
                  </span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300 font-mono">
                  <span className="text-primary">$ cat </span>{project.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground font-mono mt-1">
                  <span className="text-primary"># </span>{project.subtitle}
                </p>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4 font-mono text-sm">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs font-mono text-primary border border-primary/30 px-2 py-1 terminal-window">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="terminal" 
                    className="flex-1 group"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/projeto/${project.slug}`);
                    }}
                    data-analytics="cta_projeto"
                    data-project={project.slug}
                  >
                    <span className="font-mono">./ver_detalhes.sh</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="group"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(project.externalUrl, '_blank', 'noopener,noreferrer');
                    }}
                    data-analytics="external_link_click"
                    data-project={project.slug}
                  >
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;