import { GraduationCap, Target, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CoursesSection = () => {
  const courses = [
    {
      title: "Mentoria Executiva em IA",
      description: "Programa personalizado para executivos que desejam implementar IA estrategicamente em seus negócios.",
      duration: "3 meses",
      format: "1:1 personalizado",
      highlights: [
        "Diagnóstico completo do negócio",
        "Roadmap estratégico de implementação", 
        "Acompanhamento semanal",
        "Acesso vitalício ao material"
      ]
    },
    {
      title: "Curso Prático de ChatGPT e IA",
      description: "Do básico ao avançado: domine as principais ferramentas de IA para aumentar sua produtividade.",
      duration: "6 semanas",
      format: "Online + Lives",
      highlights: [
        "40+ videoaulas práticas",
        "Templates e prompts prontos",
        "Lives semanais de Q&A",
        "Certificado de conclusão"
      ]
    },
    {
      title: "Consultoria para Empresas", 
      description: "Implementação completa de soluções de IA para transformar processos e resultados da sua empresa.",
      duration: "Sob demanda",
      format: "In-company",
      highlights: [
        "Análise de processos atuais",
        "Desenvolvimento de soluções customizadas",
        "Treinamento de equipes",
        "Suporte pós-implementação"
      ]
    }
  ];

  return (
    <section id="cursos" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Cursos & Mentorias
          </h2>
          <div className="w-24 h-1 gradient-accent mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Acelere sua jornada de transformação digital com conteúdo prático 
            e acompanhamento especializado
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course, index) => (
            <Card 
              key={index} 
              className="shadow-card hover:shadow-tech transition-all duration-300 border-0 animate-fade-in h-full"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 gradient-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-foreground">
                  {course.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                  {course.description}
                </p>
                
                <div className="flex justify-between items-center mb-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {course.format}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {course.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-accent flex-shrink-0" />
                      {highlight}
                    </div>
                  ))}
                </div>

                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={() => window.open('https://wa.me/5531975633080?text=Olá%20Ivan,%20vim%20pelo%20seu%20site%20e%20quero%20falar%20sobre%20um%20projeto.', '_blank')}
                >
                  Saiba Mais
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center bg-card p-8 rounded-2xl shadow-card">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Pronto para acelerar sua carreira com IA?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Entre em contato e descubra qual programa é ideal para o seu perfil e objetivos
          </p>
          <Button 
            variant="accent" 
            size="lg"
            onClick={() => window.open('https://wa.me/5531975633080?text=Olá%20Ivan,%20vim%20pelo%20seu%20site%20e%20quero%20falar%20sobre%20um%20projeto.', '_blank')}
            className="text-lg px-8 py-4 h-auto"
          >
            <GraduationCap className="w-5 h-5 mr-2" />
            Começar Agora
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;