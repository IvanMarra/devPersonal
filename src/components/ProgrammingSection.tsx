import { Code2, Database, Server, MessageCircle, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProgrammingSection = () => {
  const languages = [
    {
      icon: Code2,
      name: "JavaScript",
      description: "Desenvolvimento fullstack com Node.js, React e frameworks modernos"
    },
    {
      icon: Server,
      name: "PHP",
      description: "Aplicações web robustas e sistemas de gestão empresarial"
    },
    {
      icon: Database,
      name: "SQL",
      description: "Otimização de banco de dados e análise de dados complexos"
    }
  ];

  const services = [
    {
      title: "Desenvolvimento Sob Medida",
      description: "Soluções personalizadas para suas necessidades específicas, desde websites até sistemas complexos.",
      icon: Code2
    },
    {
      title: "Consultoria Técnica",
      description: "Análise e otimização de projetos existentes, arquitetura de software e melhores práticas.",
      icon: MessageCircle
    },
    {
      title: "Cursos Personalizados",
      description: "Treinamentos práticos em programação, adaptados ao nível e objetivos da sua equipe.",
      icon: BookOpen
    }
  ];

  return (
    <section id="programming" className="py-20 terminal-bg">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="terminal-prompt mb-6 flex justify-center">
            <span className="text-primary font-mono text-lg">ivan@terminal:~$</span>
            <span className="ml-2 font-mono text-lg text-muted-foreground">ls programming-services/</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 font-mono neon-glow">
            # Serviços e Cursos de Programação
          </h2>
          
          <div className="terminal-window p-8 text-left max-w-3xl mx-auto mb-12">
            <div className="pt-8 space-y-4 font-mono text-muted-foreground">
              <p className="text-lg">
                <span className="text-primary">{'>'}</span> Experiência sólida em desenvolvimento com linguagens robustas e versáteis.
              </p>
              <p className="text-lg">
                <span className="text-primary">{'>'}</span> Capacito empresas e profissionais a desenvolverem soluções tecnológicas eficientes.
              </p>
              <p className="text-lg">
                <span className="text-primary">{'>'}</span> Desde automação simples até sistemas empresariais complexos.
              </p>
            </div>
          </div>

          {/* Linguagens */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {languages.map((lang, index) => (
              <Card key={index} className="terminal-window border-0 bg-card/50 hover:neon-glow transition-all duration-300">
                <CardContent className="p-6 pt-12 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 neon-border rounded-none flex items-center justify-center">
                    <lang.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 font-mono">
                    {lang.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                    {lang.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Serviços */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="shadow-card hover:shadow-tech transition-all duration-300 border-0 animate-fade-in overflow-hidden group"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardHeader>
                <div className="w-12 h-12 mb-4 neon-border rounded-none flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground group-hover:text-accent transition-colors duration-300">
                  {service.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTAs */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="terminal-window border-0 bg-card/50 hover:neon-glow transition-all duration-300">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2 font-mono">
                Precisa de uma solução?
              </h3>
              <p className="text-sm text-muted-foreground font-mono mb-4">
                Vamos conversar sobre seu projeto
              </p>
              <Button 
                variant="neon" 
                size="sm"
                onClick={() => window.open('https://wa.me/5531975633080?text=Olá%20Ivan,%20vim%20pelo%20seu%20site%20e%20quero%20falar%20sobre%20desenvolvimento.', '_blank')}
                className="font-mono w-full"
              >
                Contato Direto
              </Button>
            </CardContent>
          </Card>

          <Card className="terminal-window border-0 bg-card/50 hover:neon-glow transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2 font-mono">
                Consultoria Técnica
              </h3>
              <p className="text-sm text-muted-foreground font-mono mb-4">
                Agende uma sessão estratégica
              </p>
              <Button 
                variant="terminal" 
                size="sm"
                onClick={() => window.open('https://wa.me/5531975633080?text=Olá%20Ivan,%20gostaria%20de%20agendar%20uma%20consultoria%20técnica.', '_blank')}
                className="font-mono w-full"
              >
                Agendar Consultoria
              </Button>
            </CardContent>
          </Card>

          <Card className="terminal-window border-0 bg-card/50 hover:neon-glow transition-all duration-300">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2 font-mono">
                Cursos Personalizados
              </h3>
              <p className="text-sm text-muted-foreground font-mono mb-4">
                Treinamentos para sua equipe
              </p>
              <Button 
                variant="accent" 
                size="sm"
                onClick={() => window.open('https://wa.me/5531975633080?text=Olá%20Ivan,%20tenho%20interesse%20em%20cursos%20de%20programação.', '_blank')}
                className="font-mono w-full"
              >
                Saiba Mais
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProgrammingSection;