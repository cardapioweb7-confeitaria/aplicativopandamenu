import React from 'react';

interface Category {
  name: string;
}

interface RecipeCategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export function RecipeCategoryFilter({ categories, selectedCategory, onCategorySelect }: RecipeCategoryFilterProps) {
  const allCategories = [{ name: 'Todos' }, ...categories];

  return (
    <div style={{ marginBottom: '24px' }}>
      <div 
        style={{ 
          display: 'flex', 
          gap: '16px', 
          padding: '4px 0',
          justifyContent: 'flex-start',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}
      >
        {allCategories.map((category, index) => {
          const isSelected = category.name === 'Todos' 
            ? selectedCategory === null 
            : selectedCategory === category.name;

          // Usando um ícone padrão 
          const iconToUse = category.name === 'Todos' ? '/icons/TODOS.png' : '/icons/1.png';

          return (
            <button
              key={category.name}
              onClick={() => onCategorySelect(category.name === 'Todos' ? null : category.name)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: isSelected ? '#2E2E2E' : '#fe62a6',
                border: '3px solid #DBDFE4',
                outline: '3px solid white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: '8px',
                flexShrink: 0,
                minWidth: '72px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                marginLeft: index === 0 ? '24px' : '0',
                marginRight: index === allCategories.length - 1 ? '24px' : '0',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2E2E2E';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = isSelected ? '#2E2E2E' : '#fe62a6';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <img 
                src={iconToUse} 
                alt={category.name}
                style={{ 
                  width: '36px', 
                  height: '36px',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icons/1.png';
                }}
              />
            </button>
          );
        })}
      </div>
      
      {allCategories.length > 4 && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '8px',
          fontSize: '12px',
          color: 'white'
        }}>
          ← Arraste para ver mais categorias →
        </div>
      )}
    </div>
  );
}