-- Tabela de produtos
CREATE TABLE produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco NUMERIC(10,2) NOT NULL,
    preco_promocional NUMERIC(10,2),
    imagem_url TEXT,
    categoria TEXT,
    disponivel BOOLEAN DEFAULT true,
    promocao BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    forma_venda TEXT DEFAULT 'unidade' CHECK (forma_venda IN ('unidade', 'fatia', 'kg', 'cento', 'tamanho-p', 'tamanho-m', 'tamanho-g', 'tamanho-xg', 'kit-caixa', 'sob-encomenda', 'outros')),
    selected_massa TEXT,
    selected_recheio TEXT,
    selected_cobertura TEXT,
    CONSTRAINT preco_promocional_menor_que_preco CHECK (preco_promocional IS NULL OR preco_promocional <= preco)
);