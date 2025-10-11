import { Linkedin, Instagram, Facebook, Twitter, Github, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { 
      icon: Linkedin, 
      href: "https://www.linkedin.com/in/ivanmarra/", 
      label: "LinkedIn",
      color: "hover:text-primary"
    },
    { 
      icon: Instagram, 
      href: "https://www.instagram.com/marramozart/", 
      label: "Instagram",
      color: "hover:text-primary"
    },
    { 
      icon: Facebook, 
      href: "https://web.facebook.com/ivan.marra.3/", 
      label: "Facebook",
      color: "hover:text-primary"
    },
    { 
      icon: Github, 
      href: "https://github.com/IvanMarra", 
      label: "GitHub",
      color: "hover:text-primary"
    },
    { 
      icon: Twitter, 
      href: "#", 
      label: "X (Twitter)",
      color: "hover:text-primary"
    }
  ];

  return (
    <footer className="gradient-primary text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-bold mb-4">Ivan Marra</h3>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Especialista em Inteligência Artificial, Mentorias e Palestras. 
              Transformando pessoas e negócios através da inovação e tecnologia.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span>(31) 97563-3080</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>ivan.marra@deviem.com.br</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Navegação</h4>
            <nav className="space-y-2">
              <a 
                href="#sobre" 
                className="block text-gray-300 hover:text-white transition-colors duration-300"
              >
                Sobre Mim
              </a>
              <a 
                href="#palestras" 
                className="block text-gray-300 hover:text-white transition-colors duration-300"
              >
                Palestras
              </a>
              <a 
                href="#cursos" 
                className="block text-gray-300 hover:text-white transition-colors duration-300"
              >
                Cursos & Mentorias
              </a>
              <a 
                href="#blog" 
                className="block text-gray-300 hover:text-white transition-colors duration-300"
              >
                Blog
              </a>
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Serviços</h4>
            <div className="space-y-2 text-gray-300">
              <p>Mentoria Executiva</p>
              <p>Palestras Corporativas</p>
              <p>Consultoria em IA</p>
              <p>Cursos Online</p>
              <p>Treinamentos In-company</p>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-300 text-sm">
              © {currentYear} Ivan Marra. Todos os direitos reservados.
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm">Conecte-se:</span>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    className={`text-gray-300 ${social.color} transition-all duration-300 hover:bg-white/10`}
                    onClick={() => window.open(social.href, '_blank')}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;