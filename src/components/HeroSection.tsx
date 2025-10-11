import { Terminal, Code2, User, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section 
      id="inicio"
      className="relative min-h-screen flex items-center justify-center terminal-bg pt-20"
    >
      {/* Hero Overlay for Matrix contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 to-black/70 z-0"></div>
      
      {/* Terminal Grid Background */}
      <div className="absolute inset-0 opacity-5 z-[1]">
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-primary/10"></div>
          ))}
        </div>
      </div>

      {/* Floating Terminal Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-terminal-blink"></div>
        <div className="absolute top-40 right-20 text-primary animate-pulse font-mono text-xs">{'>'}</div>
        <div className="absolute bottom-32 left-1/4 text-primary animate-terminal-blink font-mono text-sm">_</div>
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-primary/80 animate-glow-pulse"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left animate-fade-in">
            <div className="terminal-prompt mb-4">
              <span className="text-primary font-mono text-lg">ivan@terminal:~$</span>
              <span className="ml-2 typing-effect font-mono text-lg text-muted-foreground">whoami</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight font-mono">
              <span className="block neon-glow">Ivan Marra</span>
              <span className="block text-xl lg:text-2xl font-normal text-muted-foreground mt-4">
                <span className="text-primary"># </span>IA, Inovação & Mentorias
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl font-mono">
              <span className="text-primary">{'>'}</span> Conectando inovação e estratégia para transformar pessoas e negócios
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                variant="neon" 
                size="lg" 
                className="text-lg px-8 py-4 h-auto"
                onClick={() => window.open('https://wa.me/5531975633080?text=Olá%20Ivan,%20vim%20pelo%20seu%20site%20e%20quero%20falar%20sobre%20um%20projeto.', '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                ./whatsapp.sh
              </Button>
              
              <Button 
                variant="terminal" 
                size="lg" 
                className="text-lg px-8 py-4 h-auto"
                onClick={() => {
                  const cursosSection = document.getElementById('cursos');
                  if (cursosSection) {
                    cursosSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Code2 className="w-5 h-5 mr-2" />
                ls /cursos
              </Button>
            </div>
          </div>

          {/* Profile Image with Terminal Style */}
          <div className="flex-shrink-0 animate-slide-in-right">
            <div className="terminal-window p-8 rounded-none">
              <div className="p-4 relative group">
                <img
                  src="/lovable-uploads/te-tech-gemini.png"
                  alt="Ivan Marra - Especialista em IA"
                  className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-none object-cover neon-border grayscale group-hover:opacity-0 transition-all duration-500"
                />
                <img
                  src="/lovable-uploads/ivan-colored-photo.png"
                  alt="Ivan Marra - Especialista em IA"
                  className="absolute top-4 left-4 w-80 h-80 lg:w-96 lg:h-96 rounded-none object-cover neon-border opacity-0 group-hover:opacity-100 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;