/**
 * Dynamic Field Editor
 * Automatically generates editing controls based on field definitions
 * No manual form configuration needed - analyzes data structure
 */

import React from 'react';
import { EditableField } from '../lib/componentAnalyzer';
import { Type, Image, Palette, Hash, ToggleLeft, List } from 'lucide-react';

interface DynamicFieldEditorProps {
  fields: EditableField[];
  data: any;
  onChange: (path: string, value: any) => void;
}

export default function DynamicFieldEditor({
  fields,
  data,
  onChange
}: DynamicFieldEditorProps) {
  const getValueAtPath = (obj: any, path: string): any => {
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    
    return value;
  };

  const handleChange = (field: EditableField, value: any) => {
    onChange(field.path, value);
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={`${field.path}-${index}`}>
          {renderField(field, getValueAtPath(data, field.path), (value) => handleChange(field, value))}
        </div>
      ))}
    </div>
  );
}

function renderField(
  field: EditableField,
  value: any,
  onChange: (value: any) => void
) {
  switch (field.type) {
    case 'text':
      return <TextField field={field} value={value} onChange={onChange} />;
    
    case 'textarea':
      return <TextAreaField field={field} value={value} onChange={onChange} />;
    
    case 'richtext':
      return <RichTextField field={field} value={value} onChange={onChange} />;
    
    case 'color':
      return <ColorField field={field} value={value} onChange={onChange} />;
    
    case 'image':
      return <ImageField field={field} value={value} onChange={onChange} />;
    
    case 'number':
      return <NumberField field={field} value={value} onChange={onChange} />;
    
    case 'toggle':
      return <ToggleField field={field} value={value} onChange={onChange} />;
    
    case 'select':
      return <SelectField field={field} value={value} onChange={onChange} />;
    
    case 'array':
      return <ArrayField field={field} value={value} onChange={onChange} />;
    
    default:
      return null;
  }
}

// Text Field
function TextField({ field, value, onChange }: { 
  field: EditableField; 
  value: any; 
  onChange: (value: any) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Type className="w-4 h-4 inline mr-2" />
        {field.label}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        style={{ color: '#000000' }}
      />
    </div>
  );
}

// Textarea Field
function TextAreaField({ field, value, onChange }: { 
  field: EditableField; 
  value: any; 
  onChange: (value: any) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Type className="w-4 h-4 inline mr-2" />
        {field.label}
      </label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={4}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        style={{ color: '#000000' }}
      />
    </div>
  );
}

// Rich Text Field (enhanced textarea with formatting hints)
function RichTextField({ field, value, onChange }: { 
  field: EditableField; 
  value: any; 
  onChange: (value: any) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Type className="w-4 h-4 inline mr-2" />
        {field.label}
      </label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-semibold"
        style={{ color: '#000000' }}
      />
      <p className="mt-1 text-xs text-gray-500">
        This text will be displayed prominently
      </p>
    </div>
  );
}

// Color Field
function ColorField({ field, value, onChange }: { 
  field: EditableField; 
  value: any; 
  onChange: (value: any) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Palette className="w-4 h-4 inline mr-2" />
        {field.label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || '#000000'}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          style={{ color: '#000000' }}
        />
      </div>
    </div>
  );
}

// Image Field
function ImageField({ field, value, onChange }: { 
  field: EditableField; 
  value: any; 
  onChange: (value: any) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Image className="w-4 h-4 inline mr-2" />
        {field.label}
      </label>
      <input
        type="url"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || 'https://...'}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        style={{ color: '#000000' }}
      />
      {value && (
        <div className="mt-3 relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={value}
            alt={field.label}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}

// Number Field
function NumberField({ field, value, onChange }: { 
  field: EditableField; 
  value: any; 
  onChange: (value: any) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Hash className="w-4 h-4 inline mr-2" />
        {field.label}
      </label>
      <input
        type="number"
        value={value || 0}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={field.min}
        max={field.max}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        style={{ color: '#000000' }}
      />
    </div>
  );
}

// Toggle Field
function ToggleField({ field, value, onChange }: { 
  field: EditableField; 
  value: any; 
  onChange: (value: any) => void;
}) {
  const isChecked = Boolean(value);
  
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-gray-700">
        <ToggleLeft className="w-4 h-4 inline mr-2" />
        {field.label}
      </label>
      <button
        onClick={() => onChange(!isChecked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isChecked ? 'bg-purple-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isChecked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

// Select Field
function SelectField({ field, value, onChange }: { 
  field: EditableField; 
  value: any; 
  onChange: (value: any) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <List className="w-4 h-4 inline mr-2" />
        {field.label}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        style={{ color: '#000000' }}
      >
        <option value="">Select {field.label}</option>
        {field.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

// Array Field (simple string array for now)
function ArrayField({ field, value, onChange }: { 
  field: EditableField; 
  value: any; 
  onChange: (value: any) => void;
}) {
  const arrayValue = Array.isArray(value) ? value : [];
  
  const handleAddItem = () => {
    onChange([...arrayValue, '']);
  };
  
  const handleRemoveItem = (index: number) => {
    const newArray = arrayValue.filter((_, i) => i !== index);
    onChange(newArray);
  };
  
  const handleItemChange = (index: number, newValue: string) => {
    const newArray = [...arrayValue];
    newArray[index] = newValue;
    onChange(newArray);
  };
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <List className="w-4 h-4 inline mr-2" />
        {field.label}
      </label>
      <div className="space-y-2">
        {arrayValue.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              style={{ color: '#000000' }}
            />
            <button
              onClick={() => handleRemoveItem(index)}
              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={handleAddItem}
          className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
        >
          + Add Item
        </button>
      </div>
    </div>
  );
}
