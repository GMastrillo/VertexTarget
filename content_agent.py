# content_agent.py
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from pymongo import MongoClient

# --- 1. CONFIGURAÇÃO E CONEXÃO ---

print(">>> A iniciar o Agente de Conteúdo...")

# Carrega as variáveis de ambiente do ficheiro .env
# Garante que os ficheiros .env no root e no backend são carregados
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), 'backend', '.env'))

# Configuração da API do Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("❌ ERRO: A chave da API do Gemini (GEMINI_API_KEY) não foi encontrada no ficheiro .env")
    exit()
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-pro-latest')

# Configuração da Conexão com o MongoDB
MONGO_URI = os.getenv("MONGO_URL")
if not MONGO_URI:
    print("❌ ERRO: A chave de conexão do MongoDB (MONGO_URL) não foi encontrada.")
    exit()

try:
    print(">>> A conectar-se ao MongoDB Atlas...")
    client = MongoClient(MONGO_URI)
    db = client.vertex_target_db # Use o mesmo nome de base de dados do seu server.py
    # Testa a conexão
    client.admin.command('ping')
    print("✅ Conexão com o MongoDB estabelecida com sucesso!")
except Exception as e:
    print(f"❌ ERRO: Falha ao conectar com o MongoDB. Detalhe: {e}")
    exit()

# --- 2. PROMPT PARA GERAÇÃO DE CONTEÚDO ---

prompt_para_ia = """
Você é um Diretor de Marketing e Conteúdo da agência de tecnologia "Vertex Target".
A Vertex Target é especializada em 3 áreas:
1.  Marketing Digital de Performance
2.  Desenvolvimento Web/Mobile (FinTech, HealthTech, etc.)
3.  Automação com Inteligência Artificial

Sua tarefa é gerar conteúdo para o novo site da agência. O conteúdo deve ser profissional, realista e demonstrar expertise.

Gere uma resposta em formato JSON contendo duas listas: "portfolio_items" e "testimonials".

**1. portfolio_items:**
   - Crie 3 projetos de portfólio fictícios, um para cada área de especialização.
   - Para o campo "image", use URLs de placeholder do site `https://placehold.co/`. Formato: `https://placehold.co/600x400/5d3a9b/ffffff?text=Nome+Do+Projeto`.
   - Preencha todos os campos do modelo Pydantic `PortfolioItemCreate` do nosso backend. Os campos são: title, category, image, metric, description, technologies, results, challenge, solution, outcome.

**2. testimonials:**
   - Crie 2 depoimentos fictícios de clientes.
   - Os clientes e os projetos mencionados devem ser consistentes com os projetos criados acima.
   - Para o campo "avatar", use URLs de placeholder do site `https://i.pravatar.cc/150?u=email@cliente.com`.
   - Preencha todos os campos do modelo Pydantic `TestimonialCreate`. Os campos são: name, position, company, avatar, quote, rating, project.

O JSON final deve ser válido e pronto para ser usado. Não adicione nenhum texto ou explicação fora do bloco JSON.
"""

# --- 3. EXECUÇÃO E INSERÇÃO NA BASE DE DADOS ---

def popular_base_de_dados():
    """
    Função principal que gera o conteúdo e o insere na base de dados.
    """
    try:
        print("\n>>> A gerar conteúdo com a API do Gemini... Isto pode demorar um momento.")
        resposta = model.generate_content(prompt_para_ia)
        
        # Limpa a resposta para garantir que é um JSON válido
        json_text = resposta.text.strip().replace("```json", "").replace("```", "")
        dados = json.loads(json_text)
        
        portfolio_items = dados.get("portfolio_items", [])
        testimonials = dados.get("testimonials", [])
        
        if not portfolio_items or not testimonials:
            print("❌ ERRO: A IA não retornou o conteúdo esperado. A tentar novamente.")
            return

        print(f"✅ Conteúdo gerado com sucesso: {len(portfolio_items)} projetos e {len(testimonials)} depoimentos.")
        
        # Inserir na base de dados
        print(">>> A inserir conteúdo na base de dados...")
        
        # Limpa as coleções existentes para evitar duplicados
        db.portfolio.delete_many({})
        db.testimonials.delete_many({})
        print("    - Coleções antigas limpas.")
        
        # Insere os novos dados
        if portfolio_items:
            db.portfolio.insert_many(portfolio_items)
            print(f"    - {len(portfolio_items)} projetos inseridos na coleção 'portfolio'.")
        if testimonials:
            db.testimonials.insert_many(testimonials)
            print(f"    - {len(testimonials)} depoimentos inseridos na coleção 'testimonials'.")
            
        print("\n🎉 MISSÃO CUMPRIDA! A base de dados foi populada com sucesso.")
        print("Verifique o seu site. O novo conteúdo e as imagens devem estar a aparecer.")

    except Exception as e:
        print(f"\n❌ Ocorreu um erro durante a execução: {e}")

if __name__ == "__main__":
    popular_base_de_dados()