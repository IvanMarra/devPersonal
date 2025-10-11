import { Terminal, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const DetailHeader = () => {
  const scrollToSection = (sectionId: string) => {
    // Navigate to home page with section hash
    window.location.href = `/#${sectionId}`;
  };

  const handleWhatsAppContact = () => {
    const whatsappUrl = "https://wa.me/5531975633080?text=Olá%20Ivan,%20vim%20pelo%20seu%20site%20e%20quero%20falar%20sobre%20um%20projeto.";
    window.open(whatsappUrl, '_blank');
  };

  const navItems = [
    { label: 'início', id: 'inicio' },
    { label: 'sobre', id: 'sobre' },
    { label: 'palestras', id: 'palestras' },
    { label: 'portfólio', id: 'portfolio' },
    { label: 'cursos', id: 'cursos' },
    { label: 'blog', id: 'blog' },
    { label: 'depoimentos', id: 'depoimentos' },
    { label: 'contato', id: 'contato' },
  ];

  return (
    <header className="sticky top-0 z-50 terminal-bg neon-border border-b backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Terminal className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground font-mono">
              <span className="text-primary">{'>_'}</span> root@ivan-marra
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Navegação principal">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors duration-200 hover:neon-glow"
                aria-label={`Ir para seção ${item.label}`}
              >
                <span className="text-primary">./</span>{item.label}
              </button>
            ))}
          </nav>

          {/* WhatsApp CTA */}
          <Button
            onClick={handleWhatsAppContact}
            variant="terminal"
            size="sm"
            className="gap-2"
            aria-label="Entrar em contato via WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline font-mono">WhatsApp</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DetailHeader;