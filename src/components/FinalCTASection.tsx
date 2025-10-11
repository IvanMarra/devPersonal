import { MessageCircle, Code2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

const FinalCTASection = () => {
  return (
    <section id="contato" className="py-20 terminal-bg relative overflow-hidden">
      {/* Terminal Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="border border-primary/10"></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="terminal-prompt mb-6 flex justify-center">
              <span className="text-primary font-mono text-lg">ivan@terminal:~$</span>
              <span className="ml-2 font-mono text-lg text-muted-foreground">./transform --business</span>
            </div>
            
            <div className="w-20 h-20 neon-border mx-auto mb-6 flex items-center justify-center bg-primary/10">
              <Terminal className="w-10 h-10 text-primary" />
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight font-mono neon-glow">
              # Vamos transformar juntos?
            </h2>
            
            <div className="terminal-window p-8 max-w-2xl mx-auto mb-8">
              <div className="pt-8">
                <p className="text-xl font-mono text-muted-foreground">
                  <span className="text-primary">{'>'}</span> Entre em contato agora mesmo e dê o primeiro passo para<br />
                  <span className="text-primary">{'>'}</span> revolucionar seu negócio com Inteligência Artificial
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-in-right mb-12">
            <Button 
              variant="neon" 
              size="lg"
              onClick={() => window.open('https://wa.me/5531975633080?text=Olá%20Ivan,%20vim%20pelo%20seu%20site%20e%20quero%20falar%20sobre%20um%20projeto.', '_blank')}
              className="text-xl px-10 py-6 h-auto font-mono"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              ./whatsapp.sh
            </Button>
            
            <Button 
              variant="terminal" 
              size="lg"
              onClick={() => {
                document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xl px-10 py-6 h-auto font-mono"
            >
              <Code2 className="w-6 h-6 mr-3" />
              ls /cursos/mentorias
            </Button>
          </div>

          <div className="terminal-window p-8 animate-fade-in" style={{ animationDelay: '500ms' }}>
            <div className="pt-8">
              <h3 className="text-2xl font-semibold text-foreground mb-6 font-mono">
                <span className="text-primary"># </span>Por que escolher Ivan Marra?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2 font-mono neon-glow">15+</div>
                  <div className="text-muted-foreground font-mono">Anos de Experiência</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2 font-mono neon-glow">500+</div>
                  <div className="text-muted-foreground font-mono">Profissionais Impactados</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2 font-mono neon-glow">100+</div>
                  <div className="text-muted-foreground font-mono">Projetos Realizados</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;