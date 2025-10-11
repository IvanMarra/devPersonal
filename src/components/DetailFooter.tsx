import { Facebook, Instagram, Linkedin, Mail, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const DetailFooter = () => {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppContact = () => {
    const whatsappUrl = "https://wa.me/5531975633080?text=Olá%20Ivan,%20vim%20pelo%20seu%20site%20e%20quero%20falar%20sobre%20um%20projeto.";
    window.open(whatsappUrl, '_blank');
  };

  const socialLinks = [
    { 
      icon: Facebook, 
      href: "https://web.facebook.com/ivan.marra.3/", 
      label: "Facebook"
    },
    { 
      icon: Instagram, 
      href: "https://www.instagram.com/marramozart/", 
      label: "Instagram"
    },
    { 
      icon: Linkedin, 
      href: "https://www.linkedin.com/in/ivanmarra/", 
      label: "LinkedIn"
    }
  ];

  return (
    <footer className="terminal-bg border-t border-primary/30 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 font-mono">
              <span className="text-primary">{'>'}</span> Contato
            </h3>
            <div className="space-y-3">
              <a 
                href="tel:+5531975633080"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono"
              >
                <Phone className="w-4 h-4" />
                (31) 97563-3080
              </a>
              <a 
                href="mailto:ivan.marra@deviem.com.br"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono"
              >
                <Mail className="w-4 h-4" />
                ivan.marra@deviem.com.br
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 font-mono">
              <span className="text-primary">{'>'}</span> Redes Sociais
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:neon-glow"
                  onClick={() => window.open(social.href, '_blank')}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </Button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 font-mono">
              <span className="text-primary">{'>'}</span> Ação Rápida
            </h3>
            <Button
              onClick={handleWhatsAppContact}
              variant="terminal"
              size="sm"
              className="gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="font-mono">Falar no WhatsApp</span>
            </Button>
          </div>

          {/* Copyright */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 font-mono">
              <span className="text-primary">{'>'}</span> Direitos
            </h3>
            <p className="text-muted-foreground text-sm font-mono">
              © {currentYear} Ivan Marra.<br />
              Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DetailFooter;