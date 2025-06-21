import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Book, DollarSign, Clock, Users, Link, Check } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { useClassSettings, useClassPlans } from '../hooks/useSupabaseData';

const ClassesManager: React.FC = () => {
  // Hooks para dados do Supabase
  const { 
    classSettings, 
    loading: settingsLoading, 
    updateClassSettings 
  } = useClassSettings();
  
  const { 
    classPlans, 
    loading: plansLoading, 
    addClassPlan, 
    updateClassPlan, 
    deleteClassPlan 
  } = useClassPlans();

  // Estados para edição
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [editingSettings, setEditingSettings] = useState<boolean>(false);
  const [newPlan, setNewPlan] = useState<any>({
    title: '',
    description: '',
    price: 0,
    duration: '',
    features: [],
    is_featured: false
  });

  // Estado para mensagens
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Inicializar estados com dados do Supabase
  useEffect(() => {
    if (classSettings) {
      // Já temos os dados, não precisamos fazer nada
    }
  }, [classSettings]);

  const showMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Funções para gerenciar planos
  const handleAddPlan = async () => {
    if (!newPlan.title || !newPlan.description) {
      showMessage('❌ Título e descrição são obrigatórios');
      return;
    }

    try {
      setLoading(true);
      
      // Criar novo plano
      const plan = {
        title: newPlan.title || '',
        description: newPlan.description || '',
        price: newPlan.price || 0,
        duration: newPlan.duration || '1 hora',
        features: Array.isArray(newPlan.features) ? newPlan.features : 
                typeof newPlan.features === 'string' ? newPlan.features.split('\n').map(f => f.trim()).filter(f => f) : [],
        image_url: newPlan.image_url,
        is_featured: newPlan.is_featured || false
      };
      
      await addClassPlan(plan);
      
      setNewPlan({
        title: '',
        description: '',
        price: 0,
        duration: '',
        features: [],
        is_featured: false
      });
      
      showMessage('✅ Plano adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar plano:', error);
      showMessage('❌ Erro ao adicionar plano');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async () => {
    if (!editingPlan) return;
    
    try {
      setLoading(true);
      
      // Atualizar plano
      await updateClassPlan(editingPlan.id, {
        title: editingPlan.title,
        description: editingPlan.description,
        price: editingPlan.price,
        duration: editingPlan.duration,
        features: Array.isArray(editingPlan.features) ? editingPlan.features : 
                 typeof editingPlan.features === 'string' ? editingPlan.features.split('\n').filter(line => line.trim()) : [],
        image_url: editingPlan.image_url,
        is_featured: editingPlan.is_featured
      });
      
      setEditingPlan(null);
      showMessage('✅ Plano atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      showMessage('❌ Erro ao atualizar plano');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este plano?')) {
      try {
        await deleteClassPlan(id);
        showMessage('✅ Plano excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir plano:', error);
        showMessage('❌ Erro ao excluir plano');
      }
    }
  };

  // Função para atualizar configurações
  const handleUpdateSettings = async () => {
    if (!classSettings) return;
    
    try {
      setLoading(true);
      
      await updateClassSettings({
        title: classSettings.title,
        subtitle: classSettings.subtitle,
        description: classSettings.description,
        cta_text: classSettings.cta_text,
        cta_link: classSettings.cta_link,
        methodology: classSettings.methodology,
        areas: classSettings.areas
      });
      
      setEditingSettings(false);
      showMessage('✅ Configurações atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      showMessage('❌ Erro ao atualizar configurações');
    } finally {
      setLoading(false);
    }
  };

  if (settingsLoading || plansLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-cyan-400">Carregando dados...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">Gerenciar Aulas Particulares</h2>
        <div className="text-sm text-gray-400">
          Total: {classPlans.length} planos
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className={`p-4 rounded-lg border ${successMessage.startsWith('✅') 
          ? 'bg-green-500/20 border-green-500/30 text-green-400' 
          : 'bg-red-500/20 border-red-500/30 text-red-400'}`}>
          {successMessage}
        </div>
      )}

      {/* Configurações Gerais */}
      <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-cyan-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-cyan-400">Configurações da Seção</h3>
          {!editingSettings ? (
            <button
              onClick={() => setEditingSettings(true)}
              className="mt-2 sm:mt-0 px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 text-sm"
            >
              <Edit className="w-3 h-3 inline mr-2" />
              Editar
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleUpdateSettings}
                className="px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 text-sm"
              >
                <Save className="w-3 h-3 inline mr-2" />
                Salvar
              </button>
              <button
                onClick={() => setEditingSettings(false)}
                className="px-4 py-2 bg-gray-500/20 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all duration-300 text-sm"
              >
                <X className="w-3 h-3 inline mr-2" />
                Cancelar
              </button>
            </div>
          )}
        </div>

        {editingSettings && classSettings ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título da Seção
                </label>
                <input
                  type="text"
                  value={classSettings.title}
                  onChange={(e) => updateClassSettings({...classSettings, title: e.target.value})}
                  className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={classSettings.subtitle}
                  onChange={(e) => updateClassSettings({...classSettings, subtitle: e.target.value})}
                  className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição
              </label>
              <textarea
                rows={3}
                value={classSettings.description}
                onChange={(e) => updateClassSettings({...classSettings, description: e.target.value})}
                className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Texto do Botão CTA
                </label>
                <input
                  type="text"
                  value={classSettings.cta_text}
                  onChange={(e) => updateClassSettings({...classSettings, cta_text: e.target.value})}
                  className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Link do Botão CTA
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={classSettings.cta_link}
                    onChange={(e) => updateClassSettings({...classSettings, cta_link: e.target.value})}
                    placeholder="https://wa.me/5511999999999"
                    className="flex-1 p-3 bg-black border border-gray-600 rounded-lg text-white"
                  />
                  <Link className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Metodologia (uma por linha)
                </label>
                <textarea
                  rows={4}
                  value={Array.isArray(classSettings.methodology) ? classSettings.methodology.join('\n') : ''}
                  onChange={(e) => updateClassSettings({...classSettings, methodology: e.target.value.split('\n').filter(line => line.trim())})}
                  className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Áreas de Ensino (uma por linha)
                </label>
                <textarea
                  rows={4}
                  value={Array.isArray(classSettings.areas) ? classSettings.areas.join('\n') : ''}
                  onChange={(e) => updateClassSettings({...classSettings, areas: e.target.value.split('\n').filter(line => line.trim())})}
                  className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <strong className="text-cyan-400">Título:</strong> {classSettings?.title}
              </div>
              <div>
                <strong className="text-cyan-400">Subtítulo:</strong> {classSettings?.subtitle}
              </div>
              <div>
                <strong className="text-cyan-400">Descrição:</strong> {classSettings?.description}
              </div>
              <div>
                <strong className="text-cyan-400">Botão CTA:</strong> {classSettings?.cta_text}
              </div>
              <div>
                <strong className="text-cyan-400">Link CTA:</strong> {classSettings?.cta_link}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <strong className="text-cyan-400 block mb-2">Metodologia:</strong>
                <ul className="space-y-1 text-gray-300 text-sm">
                  {(classSettings?.methodology || []).map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <strong className="text-cyan-400 block mb-2">Áreas de Ensino:</strong>
                <ul className="space-y-1 text-gray-300 text-sm">
                  {(classSettings?.areas || []).map((area, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Adicionar/Editar Plano */}
      <div className="bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-purple-500/30">
        <h3 className="text-base sm:text-lg font-semibold text-purple-400 mb-4">
          {editingPlan ? 'Editar Plano' : 'Adicionar Novo Plano'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Título do plano"
            value={editingPlan?.title || newPlan.title || ''}
            onChange={(e) => editingPlan 
              ? setEditingPlan({...editingPlan, title: e.target.value})
              : setNewPlan({...newPlan, title: e.target.value})
            }
            className="p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400"
          />
          
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                placeholder="Preço"
                value={editingPlan?.price || newPlan.price || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  editingPlan
                    ? setEditingPlan({...editingPlan, price: value})
                    : setNewPlan({...newPlan, price: value});
                }}
                className="w-full pl-10 p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400"
              />
            </div>
            
            <div className="flex-1 relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Duração"
                value={editingPlan?.duration || newPlan.duration || ''}
                onChange={(e) => editingPlan
                  ? setEditingPlan({...editingPlan, duration: e.target.value})
                  : setNewPlan({...newPlan, duration: e.target.value})
                }
                className="w-full pl-10 p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <textarea
            placeholder="Descrição do plano"
            rows={2}
            value={editingPlan?.description || newPlan.description || ''}
            onChange={(e) => editingPlan
              ? setEditingPlan({...editingPlan, description: e.target.value})
              : setNewPlan({...newPlan, description: e.target.value})
            }
            className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Características (uma por linha)
          </label>
          <textarea
            rows={4}
            value={Array.isArray(editingPlan?.features || newPlan.features) 
              ? (editingPlan?.features || newPlan.features || []).join('\n')
              : ''
            }
            onChange={(e) => {
              const featuresArray = e.target.value.split('\n').filter(line => line.trim());
              editingPlan
                ? setEditingPlan({...editingPlan, features: featuresArray})
                : setNewPlan({...newPlan, features: featuresArray});
            }}
            placeholder="Ex: 2 aulas semanais&#10;Suporte por WhatsApp&#10;Material didático"
            className="w-full p-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Imagem do Plano
            </label>
            <ImageUpload
              currentImage={editingPlan?.image_url || newPlan.image_url || ''}
              onImageUploaded={(url) => editingPlan
                ? setEditingPlan({...editingPlan, image_url: url})
                : setNewPlan({...newPlan, image_url: url})
              }
              folder="classes"
              recommendedSize="600x400px"
            />
          </div>
          
          <div className="flex items-center space-x-3 h-10 mt-8">
            <input
              type="checkbox"
              id="is_featured"
              checked={editingPlan?.is_featured || newPlan.is_featured || false}
              onChange={(e) => editingPlan
                ? setEditingPlan({...editingPlan, is_featured: e.target.checked})
                : setNewPlan({...newPlan, is_featured: e.target.checked})
              }
              className="w-4 h-4 bg-black border border-gray-600 rounded"
            />
            <label htmlFor="is_featured" className="text-gray-300">
              Destacar este plano
            </label>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          {editingPlan ? (
            <>
              <button
                onClick={handleUpdatePlan}
                disabled={loading}
                className="px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-300 disabled:opacity-50"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Salvar Alterações
              </button>
              <button
                onClick={() => setEditingPlan(null)}
                className="px-4 py-2 bg-gray-500/20 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all duration-300"
              >
                <X className="w-4 h-4 inline mr-2" />
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={handleAddPlan}
              disabled={loading}
              className="px-4 py-2 bg-purple-500/20 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-300 disabled:opacity-50"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Adicionar Plano
            </button>
          )}
        </div>
      </div>

      {/* Lista de Planos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classPlans.map(plan => (
          <div 
            key={plan.id} 
            className={`bg-gray-900/50 p-4 rounded-lg border ${
              plan.is_featured 
                ? 'border-cyan-500/50 shadow-lg shadow-cyan-900/20' 
                : 'border-gray-700'
            } relative`}
          >
            {plan.is_featured && (
              <div className="absolute -top-3 -right-3 bg-cyan-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                Destaque
              </div>
            )}
            
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-lg font-bold text-purple-400">{plan.title}</h4>
              <div className="text-xl font-bold text-cyan-400">R$ {plan.price}</div>
            </div>
            
            <p className="text-gray-300 text-sm mb-3">{plan.description}</p>
            
            <div className="flex items-center text-gray-400 text-sm mb-3">
              <Clock className="w-4 h-4 mr-2" />
              {plan.duration} por aula
            </div>
            
            <ul className="space-y-2 mb-4">
              {(Array.isArray(plan.features) ? plan.features : []).map((feature, index) => (
                <li key={index} className="flex items-start text-sm">
                  <Check className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingPlan(plan)}
                className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs hover:bg-cyan-500/30 transition-all duration-300"
              >
                <Edit className="w-3 h-3 inline mr-1" />
                Editar
              </button>
              <button
                onClick={() => handleDeletePlan(plan.id)}
                className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition-all duration-300"
              >
                <Trash2 className="w-3 h-3 inline mr-1" />
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassesManager;