import { FileText, LogOut, Coins, Package, Handshake } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { documentTemplates, type DocumentTemplate } from '../documentTemplates';

interface TemplateSelectorProps {
  selectedId: string | null;
  onSelect: (template: DocumentTemplate) => void;
}

export const TemplateSelector = ({ selectedId, onSelect }: TemplateSelectorProps) => {
  // Map icons dynamically
  const getIcon = (id: string) => {
    switch (id) {
      case 'general-petition':
        return <FileText className="h-6 w-6 stroke-[1.5]" />;
      case 'resignation-letter':
        return <LogOut className="h-6 w-6 stroke-[1.5]" />;
      case 'refund-request':
        return <Coins className="h-6 w-6 stroke-[1.5]" />;
      case 'handover-protocol':
        return <Package className="h-6 w-6 stroke-[1.5]" />;
      case 'debt-settlement':
        return <Handshake className="h-6 w-6 stroke-[1.5]" />;
      default:
        return <FileText className="h-6 w-6 stroke-[1.5]" />;
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1">
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          Bir Evrak Şablonu Seçin
        </h3>
        <p className="text-xs text-slate-400 font-normal">
          Doldurmak istediğiniz döküman tipini seçerek hemen düzenlemeye başlayın.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentTemplates.map((template) => {
          const isSelected = selectedId === template.id;
          
          return (
            <Card
              key={template.id}
              hoverable
              onClick={() => onSelect(template)}
              className={`flex flex-col gap-3.5 border transition-all duration-200 ${
                isSelected 
                  ? 'border-blue-600 bg-blue-50/20 shadow-md ring-2 ring-blue-500/10' 
                  : 'border-slate-100 hover:border-blue-100 bg-white'
              }`}
            >
              <CardHeader className="flex flex-row items-center gap-3 pb-0 space-y-0">
                <div className={`flex items-center justify-center w-11 h-11 rounded-xl transition-colors ${
                  isSelected 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-50 text-slate-500 hover:text-blue-600'
                }`}>
                  {getIcon(template.id)}
                </div>
                <CardTitle className="text-sm font-bold text-slate-800">
                  {template.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-2 text-xs text-slate-500 leading-relaxed">
                {template.description}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
export default TemplateSelector;
