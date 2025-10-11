import { Calendar, Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PalestrasSection = () => {
  const palestras = [
    {
      title: "O que é IA?",
      description: "Uma introdução completa e acessível ao mundo da Inteligência Artificial, explorando conceitos fundamentais e aplicações práticas no dia a dia.",
      image: "/lovable-uploads/fae8a34a-7541-4b6e-a92b-a50d289c38a2.png",
      audience: "Público geral",
      duration: "45-60 min"
    },
    {
      title: "IA no Setor Imobiliário", 
      description: "Como a Inteligência Artificial está revolucionando o mercado imobiliário, desde automação de processos até análise preditiva de mercado.",
      image: "/lovable-uploads/79f88611-826d-44cf-84d5-7162ba664346.png",
      audience: "Profissionais do setor",
      duration: "60-90 min"
    },
    {
      title: "Aplicações Práticas da Inteligência Artificial",
      description: "Casos reais de implementação de IA em negócios, ferramentas disponíveis e roadmap para transformação digital empresarial.",
      image: "/lovable-uploads/f67e421c-204b-438a-99af-4e0462ee0ed2.png", 
      audience: "Executivos e gestores",
      duration: "75-120 min"
    }
  ];

  return (
    <section id="palestras" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Palestras e Experiências
          </h2>
          <div className="w-24 h-1 gradient-accent mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transforme sua empresa ou evento com palestras inspiradoras sobre o futuro da tecnologia e inovação
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {palestras.map((palestra, index) => (
            <Card 
              key={index} 
              className="shadow-card hover:shadow-tech transition-all duration-300 border-0 animate-fade-in overflow-hidden group"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={palestra.image}
                  alt={palestra.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl text-foreground group-hover:text-accent transition-colors duration-300">
                  {palestra.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {palestra.description}
                </p>
                
                <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-accent" />
                    {palestra.audience}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-accent" />
                    {palestra.duration}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-card p-8 rounded-2xl shadow-card max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Interesse em uma palestra personalizada?
            </h3>
            <p className="text-muted-foreground mb-6">
              Entre em contato e vamos criar uma experiência única para seu evento ou empresa
            </p>
            <Button 
              variant="whatsapp" 
              size="lg"
              onClick={() => window.open('https://wa.me/5531975633080?text=Olá%20Ivan,%20vim%20pelo%20seu%20site%20e%20quero%20falar%20sobre%20um%20projeto.', '_blank')}
              className="text-lg px-8 py-4 h-auto"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Agende uma Palestra
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PalestrasSection;