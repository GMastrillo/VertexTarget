# VERTEX TARGET - Portfolio Website

## 📖 Descrição do Projeto

VERTEX TARGET é um website de portfólio premium para uma agência de tecnologia especializada em Marketing, Desenvolvimento e Inteligência Artificial. O site apresenta um design sofisticado com foco em ambição, precisão e sofisticação tecnológica, utilizando uma paleta de cores em preto profundo, roxo/azul/índigo vibrante e branco.

### 🎯 Objetivos

- Apresentar os serviços da agência de forma impactante e profissional
- Demonstrar cases de sucesso através de um portfólio interativo
- Capturar leads qualificados através de formulários estratégicos
- Oferecer demonstração interativa de soluções de IA

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19.0.0** - Framework principal para interface do usuário
- **React Router DOM 7.5.1** - Roteamento e navegação
- **Tailwind CSS 3.4.17** - Framework CSS utilitário
- **Radix UI** - Biblioteca de componentes acessíveis
- **Axios 1.8.4** - Cliente HTTP para comunicação com API
- **Lucide React** - Biblioteca de ícones
- **Zod** - Validação de esquemas
- **React Hook Form** - Gerenciamento de formulários

### Backend
- **FastAPI 0.110.1** - Framework web moderno para Python
- **Motor 3.3.1** - Driver assíncrono para MongoDB
- **Pydantic 2.6.4+** - Validação de dados e settings
- **JWT** - Autenticação e autorização
- **Uvicorn** - Servidor ASGI
- **Python-dotenv** - Gerenciamento de variáveis de ambiente

### Banco de Dados
- **MongoDB** - Banco de dados NoSQL para armazenamento

### Ferramentas de Desenvolvimento
- **Yarn** - Gerenciador de pacotes (Frontend)
- **pip** - Gerenciador de pacotes (Backend)
- **ESLint** - Linting para JavaScript/React
- **Black/isort** - Formatação de código Python
- **Pytest** - Testes automatizados

## 🚀 Instalação e Execução Local

### Pré-requisitos

- Node.js 18+ e Yarn
- Python 3.9+
- MongoDB (local ou na nuvem)
- Git

### 1. Clonando o Repositório

```bash
git clone <url-do-repositorio>
cd vertex-target
```

### 2. Configuração do Backend

```bash
# Navegar para a pasta do backend
cd backend

# Criar ambiente virtual Python (recomendado)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\\Scripts\\activate  # Windows

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Editar o arquivo .env com suas configurações
```

### 3. Configuração do Frontend

```bash
# Navegar para a pasta do frontend (a partir da raiz)
cd frontend

# Instalar dependências
yarn install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar o arquivo .env com suas configurações
```

### 4. Executando o Projeto

#### Executar o Backend
```bash
cd backend
python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

#### Executar o Frontend
```bash
cd frontend
yarn start
```

O frontend estará disponível em `http://localhost:3000` e o backend em `http://localhost:8001`.

## 📁 Estrutura do Projeto

```
/
├── backend/                    # API FastAPI
│   ├── .env                   # Variáveis de ambiente (backend)
│   ├── .env.example          # Template de variáveis
│   ├── requirements.txt      # Dependências Python
│   ├── server.py            # Aplicação principal FastAPI
│   └── seed.py              # Script para popular banco (futuro)
├── frontend/                  # Aplicação React
│   ├── public/               # Arquivos públicos
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   │   ├── ui/          # Componentes base (Radix UI)
│   │   │   ├── Hero.jsx     # Seção Hero ("No Cume")
│   │   │   ├── Services.jsx # Nossos Serviços
│   │   │   ├── Portfolio.jsx# Portfólio de projetos
│   │   │   ├── Methodology.jsx # Nossa Metodologia
│   │   │   ├── AIDemo.jsx   # Demonstração de IA
│   │   │   ├── Testimonials.jsx # Depoimentos
│   │   │   └── Contact.jsx  # Formulário de contato
│   │   ├── hooks/           # Custom hooks
│   │   ├── mockData.js      # Dados de exemplo
│   │   ├── App.js          # Componente principal
│   │   ├── App.css         # Estilos globais
│   │   └── index.css       # Estilos base do Tailwind
│   ├── package.json        # Dependências e scripts
│   ├── tailwind.config.js  # Configuração do Tailwind
│   └── .env               # Variáveis de ambiente (frontend)
├── tests/                  # Testes automatizados
├── README.md              # Este arquivo
└── docker-compose.yml     # Orquestração Docker (futuro)
```

## 🔌 Documentação da API

### Endpoints Principais

#### Status e Saúde
- `GET /api/` - Health check da API
- `GET /api/status` - Lista verificações de status
- `POST /api/status` - Cria nova verificação de status

#### Autenticação (Planejado)
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login de usuário

#### Portfólio (Planejado)
- `GET /api/portfolio` - Lista projetos do portfólio
- `POST /api/portfolio` - Cria novo projeto (autenticado)
- `PUT /api/portfolio/{id}` - Atualiza projeto (autenticado)
- `DELETE /api/portfolio/{id}` - Remove projeto (autenticado)

#### Depoimentos (Planejado)
- `GET /api/testimonials` - Lista depoimentos
- `POST /api/testimonials` - Cria novo depoimento (autenticado)

#### Contato (Planejado)
- `POST /api/contact` - Envio de formulário de contato

### Formato de Resposta da API

```json
{
  "id": "uuid-v4",
  "data": { ... },
  "timestamp": "2025-01-01T00:00:00Z"
}
```

## 🎨 Seções do Website

### 1. Hero Section ("No Cume")
- Animação de montanha/alvo
- Call-to-action principal
- Gradiente purple-blue

### 2. Nossos Serviços ("Arsenal de Precisão")
- Marketing de Alvo
- Desenvolvimento Sob Medida  
- Inteligência Artificial
- Efeitos hover neon
- Descrições expansíveis

### 3. Portfólio ("Expedições de Sucesso")
- Grid responsivo de projetos
- Hover effects elaborados
- Links para cases detalhados
- Métricas de sucesso

### 4. Nossa Metodologia ("A Escalada")
- Timeline vertical animada
- 4 etapas: Basecamp → Acampamento 1 → Acampamento 2 → Cume
- Ícones de alvo para cada etapa

### 5. Demonstração de IA ("Calibre seu Alvo")
- Seleção interativa de indústria/objetivo
- Sugestões de estratégia baseadas em IA
- Resultados dinâmicos

### 6. Depoimentos e Parceiros
- Testimonials em cards
- Background com textura de montanha
- Logos de parceiros em monocromático

### 7. Contato ("Fale com um Estrategista")
- Formulário de contato estratégico
- Validação em tempo real
- Micro-interações no botão

## 🎯 Design System

### Paleta de Cores
- **Preto Profundo**: #000000, #0f0f0f, #1a1a1a
- **Purple/Blue/Indigo**: #6366f1, #8b5cf6, #a855f7
- **Branco**: #ffffff, #f8fafc, #f1f5f9

### Tipografia
- Fonte geométrica e forte
- Hierarquia clara de títulos
- Espaçamento otimizado para leitura

### Animações
- Micro-animações obrigatórias
- Transições suaves
- Efeitos de hover elaborados
- Animações de scroll

## 🧪 Testes

### Executar Testes do Frontend
```bash
cd frontend
yarn test
```

### Executar Testes do Backend
```bash
cd backend
python -m pytest tests/ -v
```

## 🚀 Deploy

### Variáveis de Ambiente Necessárias

#### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=vertex_target_db
JWT_SECRET=seu-jwt-secret-super-seguro
```

#### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Comandos Docker (Futuro)
```bash
# Construir e executar todos os serviços
docker-compose up --build

# Executar em background
docker-compose up -d

# Parar todos os serviços
docker-compose down
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

VERTEX TARGET - [contato@vertextarget.com](mailto:contato@vertextarget.com)

Link do Projeto: [https://github.com/vertex-target/portfolio](https://github.com/vertex-target/portfolio)

---

Desenvolvido com 💜 pela equipe VERTEX TARGET