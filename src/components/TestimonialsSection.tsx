import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Maria Silva",
      position: "CEO, TechCorp",
      company: "Empresa de Tecnologia",
      avatar: "MS",
      content: "O Ivan transformou completamente nossa visão sobre IA. Sua mentoria nos ajudou a implementar soluções que aumentaram nossa produtividade em 40%. Um profissional excepcional!",
      rating: 5
    },
    {
      name: "Carlos Mendes",
      position: "Diretor de Inovação", 
      company: "Grupo Empresarial ABC",
      avatar: "CM",
      content: "A palestra do Ivan sobre IA no setor imobiliário foi um divisor de águas. Implementamos as estratégias apresentadas e já vemos resultados concretos no nosso negócio.",
      rating: 5
    },
    {
      name: "Ana Costa",
      position: "Gestora de Projetos",
      company: "Consultoria Premium",
      avatar: "AC", 
      content: "O curso prático de ChatGPT superou todas as minhas expectativas. Material didático excelente e aplicação imediata no dia a dia. Recomendo sem reservas!",
      rating: 5
    },
    {
      name: "Roberto Lima",
      position: "Empreendedor",
      company: "Startup Digital",
      avatar: "RL",
      content: "A consultoria do Ivan foi fundamental para estruturarmos nossa estratégia de IA. Profissional competente, atualizado e com uma didática excepcional.",
      rating: 5
    }
  ];

  return (
    <section id="depoimentos" className="py-20 gradient-hero">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Depoimentos
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            O que dizem os profissionais e empresas que já transformaram 
            seus resultados com nosso acompanhamento
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="bg-white/10 border-white/20 backdrop-blur-sm shadow-card hover:shadow-accent transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Quote className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                  <p className="text-gray-300 leading-relaxed text-lg italic">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 gradient-accent rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {testimonial.position}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;