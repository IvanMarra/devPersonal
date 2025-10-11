import { Calendar, ArrowRight, Bookmark, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const BlogSection = () => {
  const navigate = useNavigate();
  const posts = [
    {
      id: 1,
      title: "O Futuro da Inteligência Artificial nos Negócios",
      excerpt: "Como a IA está revolucionando a forma como as empresas operam e se relacionam com seus clientes...",
      date: "15 de Novembro, 2024",
      category: "Tendências",
      readTime: "5 min",
      slug: "futuro-ia-negocios"
    },
    {
      id: 2,
      title: "10 Ferramentas de IA que Todo Profissional Deveria Conhecer",
      excerpt: "Uma lista prática das principais ferramentas de inteligência artificial para aumentar a produtividade...",
      date: "12 de Novembro, 2024", 
      category: "Produtividade",
      readTime: "8 min",
      slug: "ferramentas-ia-profissional"
    },
    {
      id: 3,
      title: "Como Implementar ChatGPT na sua Empresa: Guia Prático",
      excerpt: "Passo a passo para integrar soluções de IA generativa nos processos da sua organização...",
      date: "8 de Novembro, 2024",
      category: "Tutorial",
      readTime: "12 min",
      slug: "implementar-chatgpt-empresa"
    },
    {
      id: 4,
      title: "IA Ética: Desafios e Oportunidades para 2025",
      excerpt: "Reflexões sobre o uso responsável da inteligência artificial e seu impacto na sociedade...",
      date: "5 de Novembro, 2024",
      category: "Reflexão", 
      readTime: "7 min",
      slug: "ia-etica-2025"
    }
  ];

  return (
    <section id="blog" className="py-20 terminal-bg">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <Terminal className="w-6 h-6 text-primary" />
            <span className="text-primary font-mono">~/blog$</span>
            <div className="w-2 h-6 bg-primary animate-terminal-blink"></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 font-mono">
            <span className="text-primary">{'>'}</span> Blog / Artigos
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8 neon-glow"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-mono">
            <span className="text-primary"># </span>
            Insights, tendências e conhecimento prático sobre IA, inovação e transformação digital
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {posts.map((post, index) => (
            <Card 
              key={post.id} 
              className="terminal-window group cursor-pointer hover:neon-glow transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 terminal-window">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Bookmark className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300 font-mono">
                  <span className="text-primary">$ cat </span>{post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4 font-mono text-sm">
                  <span className="text-primary"># </span>
                  {post.excerpt}
                </p>
                <Button 
                  variant="terminal" 
                  className="p-0 h-auto group"
                >
                  <span className="font-mono">./ler_mais.sh</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            variant="terminal" 
            size="lg"
          >
            <span className="font-mono">$ ls -la artigos/</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;