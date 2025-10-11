import { Code, Brain, Users, Zap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  const highlights = [
    {
      icon: Code,
      title: "15+ Anos de Experiência",
      description: "Sólida trajetória em inovação, gestão estratégica e transformação digital em grandes empresas."
    },
    {
      icon: Brain,
      title: "Especialista em IA",
      description: "Aplicação prática de Inteligência Artificial para resolver problemas reais de negócio."
    },
    {
      icon: Users,
      title: "Mentorias & Palestras",
      description: "Mais de 500 profissionais impactados através de mentorias personalizadas e palestras inspiradoras."
    },
    {
      icon: Zap,
      title: "Resultados Comprovados",
      description: "Projetos implementados com ROI mensurável e impacto direto na produtividade empresarial."
    }
  ];

  return (
    <section id="sobre" className="py-20 terminal-bg">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="terminal-prompt mb-6 flex justify-center">
            <span className="text-primary font-mono text-lg">ivan@terminal:~$</span>
            <span className="ml-2 font-mono text-lg text-muted-foreground">cat about.md</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 font-mono neon-glow">
            # Sobre Mim
          </h2>
          
          <div className="terminal-window p-8 text-left max-w-3xl mx-auto">
            <div className="pt-8 space-y-4 font-mono text-muted-foreground">
              <p className="text-lg">
                <span className="text-primary">{'>'}</span> Mais de 15 anos transformando ideias em soluções práticas e escaláveis.
              </p>
              <p className="text-lg">
                <span className="text-primary">{'>'}</span> Especialista em Inteligência Artificial aplicada ao mundo real.
              </p>
              <p className="text-lg">
                <span className="text-primary">{'>'}</span> Combinando visão estratégica com execução técnica impecável.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Button 
              variant="neon" 
              size="lg" 
              onClick={() => window.open('https://wa.me/5531975633080?text=Olá%20Ivan,%20vim%20pelo%20seu%20site%20e%20quero%20falar%20sobre%20um%20projeto.', '_blank')}
              className="font-mono"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              ./contact.sh --whatsapp
            </Button>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((highlight, index) => (
            <Card key={index} className="terminal-window border-0 bg-card/50 hover:neon-glow transition-all duration-300">
              <CardContent className="p-6 pt-12 text-center">
                <div className="w-12 h-12 mx-auto mb-4 neon-border rounded-none flex items-center justify-center">
                  <highlight.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 font-mono">
                  {highlight.title}
                </h3>
                <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                  {highlight.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;