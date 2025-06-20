import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
const ImageUpload = ({ currentImage, onImageUploaded, folder = 'general', className = '' }) => {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const uploadImage = async (file) => {
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
                const result = e.target?.result;
                onImageUploaded(result);
            };
            reader.readAsDataURL(file);
        }
        catch (error) {
            console.error('Error uploading image:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer upload da imagem';
            setError(errorMessage);
        }
        finally {
            setUploading(false);
        }
    };
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadImage(file);
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            uploadImage(file);
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };
    const removeImage = () => {
        onImageUploaded('');
        setError(null);
    };
    return (_jsxs("div", { className: `space-y-4 ${className}`, children: [error && (_jsx("div", { className: "bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-400 text-sm", children: error })), currentImage ? (_jsxs("div", { className: "relative", children: [_jsx("img", { src: currentImage, alt: "Preview", className: "w-full h-48 object-cover rounded-lg border border-gray-600" }), _jsx("button", { onClick: removeImage, className: "absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors", children: _jsx(X, { className: "w-4 h-4" }) })] })) : (_jsx("div", { className: `border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragOver
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : 'border-gray-600 hover:border-gray-500'}`, onDrop: handleDrop, onDragOver: handleDragOver, onDragLeave: handleDragLeave, children: uploading ? (_jsxs("div", { className: "flex flex-col items-center", children: [_jsx(Loader, { className: "w-8 h-8 text-cyan-400 animate-spin mb-2" }), _jsx("p", { className: "text-gray-400", children: "Fazendo upload..." })] })) : (_jsxs("div", { className: "flex flex-col items-center", children: [_jsx(ImageIcon, { className: "w-12 h-12 text-gray-400 mb-4" }), _jsx("p", { className: "text-gray-400 mb-2", children: "Arraste uma imagem aqui ou clique para selecionar" }), _jsx("p", { className: "text-xs text-gray-500 mb-4", children: "PNG, JPG, GIF at\u00E9 5MB" }), _jsxs("button", { type: "button", onClick: () => fileInputRef.current?.click(), className: "px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300", children: [_jsx(Upload, { className: "w-4 h-4 inline mr-2" }), "Selecionar Imagem"] })] })) })), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleFileSelect, className: "hidden" })] }));
};
export default ImageUpload;
