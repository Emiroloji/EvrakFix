import * as React from 'react';
import { Merge, Scissors, Image, Signature, Layers, LayoutGrid, Sliders, FileText, ArrowRight, Search, ShieldCheck } from 'lucide-react';
import { toolList } from '../lib/constants/toolList';

const iconMap: Record<string, any> = {
  Merge,
  Scissors,
  Image,
  Signature,
  Layers,
  LayoutGrid,
  Sliders,
  FileText
};
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { navigateTo } from '../lib/utils/navigation';

type CategoryFilter = 'all' | 'pdf' | 'document' | 'other';

export const ToolsPage = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<CategoryFilter>('all');

  const filteredTools = React.useMemo(() => {
    return toolList.filter((tool) => {
      const matchesSearch = 
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        activeCategory === 'all' || 
        tool.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Tüm PDF ve Evrak Araçları</h1>
          <p className="text-slate-500 text-sm max-w-lg">
            İhtiyacınız olan aracı arayın veya kategorilere göre göz atın. Tüm işlemler cihazınızda gerçekleştirilir.
          </p>
        </div>
        
        {/* Search Input */}
        <div className="w-full md:w-80 relative shrink-0">
          <Input
            placeholder="Araç ismi veya özellik ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 text-sm border-slate-200"
          />
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Category Tabs & Trust Notice */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Categories Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200/50 rounded-xl overflow-x-auto max-w-full no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Tüm Araçlar
          </button>
          <button
            onClick={() => setActiveCategory('pdf')}
            className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === 'pdf'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            PDF İşlemleri
          </button>
          <button
            onClick={() => setActiveCategory('document')}
            className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === 'document'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Dilekçe & Evrak
          </button>
          <button
            onClick={() => setActiveCategory('other')}
            className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === 'other'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Görsel & Diğer
          </button>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100/55 text-emerald-800 text-xs font-semibold self-start lg:self-auto shrink-0 shadow-sm shadow-emerald-500/2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Sıfır Sunucu Aktarımı, %100 Cihaz Güvenliği</span>
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const IconComponent = iconMap[tool.icon] || FileText;
            
            return (
              <Card
                key={tool.id}
                hoverable
                onClick={() => { navigateTo(tool.path); }}
                className="flex flex-col justify-between group h-full relative p-6 border-slate-100 bg-white"
              >
                <div>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <IconComponent className="h-6 w-6 stroke-[1.75]" />
                    </div>
                    {tool.badge && (
                      <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold px-2.5 py-0.5">
                        {tool.badge}
                      </Badge>
                    )}
                    {!tool.badge && tool.isPopular && (
                      <Badge variant="primary" className="bg-blue-50 text-blue-600 border-blue-100 font-bold px-2.5 py-0.5">
                        Popüler
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="mt-4 flex flex-col gap-2 p-0">
                    <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-slate-500 text-sm leading-relaxed min-h-[40px]">
                      {tool.description}
                    </CardDescription>
                  </CardContent>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 mt-6 pt-4 border-t border-slate-50 group-hover:gap-2.5 transition-all">
                  <span>Hemen Kullan</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-400 mb-4 border border-dashed border-slate-200">
            <Search className="h-6 w-6 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">Aramanızla Eşleşen Araç Bulunamadı</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-xs leading-relaxed">
            "{searchQuery}" araması için herhangi bir sonuç bulamadık. Başka bir kelimeyle veya farklı kategoriyle aramayı deneyebilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
};
