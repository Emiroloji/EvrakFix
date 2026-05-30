import * as React from 'react';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import type { DocumentTemplate } from '../documentTemplates';

interface DocumentFormProps {
  template: DocumentTemplate;
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}

export const DocumentForm = ({ template, values, onChange }: DocumentFormProps) => {
  // Sync fields default values on load
  React.useEffect(() => {
    const updatedValues = { ...values };
    let hasChanges = false;

    template.fields.forEach((field) => {
      // If date field and empty, default to today's date in YYYY-MM-DD
      if (field.type === 'date' && !updatedValues[field.id]) {
        const today = new Date().toISOString().split('T')[0];
        updatedValues[field.id] = today;
        hasChanges = true;
      } else if (!updatedValues[field.id]) {
        updatedValues[field.id] = '';
        hasChanges = true;
      }
    });

    if (hasChanges) {
      onChange(updatedValues);
    }
  }, [template]);

  const handleFieldChange = (id: string, val: string) => {
    onChange({
      ...values,
      [id]: val
    });
  };

  return (
    <div className="flex flex-col gap-4.5 p-5 rounded-2xl bg-slate-50 border border-slate-100 w-full">
      <div className="flex flex-col border-b border-slate-200/50 pb-3 mb-1">
        <h4 className="text-xs font-bold text-slate-500 tracking-wide uppercase">
          Form Bilgileri
        </h4>
        <p className="text-[11px] text-slate-400 font-normal">
          Dilekçe içeriği için lütfen aşağıdaki zorunlu alanları doldurun.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {template.fields.map((field) => {
          const value = values[field.id] || '';
          
          if (field.type === 'textarea') {
            return (
              <Textarea
                key={field.id}
                label={`${field.label}${field.required ? ' *' : ''}`}
                placeholder={field.placeholder}
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                required={field.required}
                rows={4}
              />
            );
          }

          if (field.type === 'date') {
            return (
              <Input
                key={field.id}
                type="date"
                label={`${field.label}${field.required ? ' *' : ''}`}
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                required={field.required}
              />
            );
          }

          return (
            <Input
              key={field.id}
              type="text"
              label={`${field.label}${field.required ? ' *' : ''}`}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
            />
          );
        })}
      </div>
    </div>
  );
};
export default DocumentForm;
