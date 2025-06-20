import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader, Info } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageUploaded: (url: string) => void;
  folder?: string;
  className?: string;
  recommendedSize?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  currentImage, 
  onImageUploaded, 
  folder = 'general',
  className = '',
  recommendedSize = '800x600px'
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione apenas arquivos de imagem');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('A imagem deve ter no máximo 5MB');
      }

      // Simular upload - em produção usaria Supabase Storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageUploaded(result);
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer upload da imagem';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = () => {
    onImageUploaded('');
    setError(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm text-gray-400 mr-2">Tamanho recomendado: {recommendedSize}</span>
          <button 
            className="text-gray-400 hover:text-cyan-400 transition-colors"
            onClick={() => setShowInfo(!showInfo)}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
        <span className="text-xs text-gray-500">Máx: 5MB</span>
      </div>

      {showInfo && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-gray-300">
          <h4 className="font-medium text-blue-400 mb-1">Dicas para imagens:</h4>
          <ul className="space-y-1 text-xs">
            <li>• Perfil: 400x400px (quadrada)</li>
            <li>• Projetos: 800x600px (paisagem 4:3)</li>
            <li>• Palestras: 800x400px (paisagem 2:1)</li>
            <li>• Avatares: 200x200px (quadrada)</li>
            <li>• Formatos: JPG, PNG ou WebP (recomendado)</li>
            <li>• Otimize suas imagens antes do upload para melhor performance</li>
          </ul>
        </div>
      )}

      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-600"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? 'border-cyan-400 bg-cyan-500/10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
              <p className="text-gray-400">Fazendo upload...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-400 mb-2">
                Arraste uma imagem aqui ou clique para selecionar
              </p>
              <p className="text-xs text-gray-500 mb-4">
                PNG, JPG, GIF até 5MB
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300"
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Selecionar Imagem
              </button>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;