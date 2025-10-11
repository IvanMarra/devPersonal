import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center gradient-hero">
      <div className="text-center animate-fade-in">
        <h1 className="mb-4 text-8xl font-bold text-white">404</h1>
        <p className="mb-8 text-2xl text-gray-300">Oops! Página não encontrada</p>
        <p className="mb-8 text-lg text-gray-400 max-w-md mx-auto">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => window.location.href = '/'}
            className="h-auto px-8 py-4 text-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Voltar ao Início
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.history.back()}
            className="border-white text-white hover:bg-white hover:text-primary h-auto px-8 py-4 text-lg"
          >
            <Search className="w-5 h-5 mr-2" />
            Página Anterior
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
