# content_seeder.py
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import uuid

# --- 1. CONFIGURAÇÃO E CONEXÃO ---

print(">>> A iniciar o Agente de Conteúdo Manual...")

# Carrega as variáveis de ambiente
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), 'backend', '.env'))

# Configuração da Conexão com o MongoDB
MONGO_URI = os.getenv("MONGO_URL")
if not MONGO_URI:
    print("❌ ERRO: A chave de conexão do MongoDB (MONGO_URL) não foi encontrada.")
    exit()

try:
    print(">>> A conectar-se ao MongoDB...")
    client = MongoClient(MONGO_URI)
    db = client.vertex_target_db
    # Testa a conexão
    client.admin.command('ping')
    print("✅ Conexão com o MongoDB estabelecida com sucesso!")
except Exception as e:
    print(f"❌ ERRO: Falha ao conectar com o MongoDB. Detalhe: {e}")
    exit()

# --- 2. CONTEÚDO ESTRUTURADO DE ALTA QUALIDADE ---

portfolio_items = [
    {
        "id": str(uuid.uuid4()),
        "title": "EcommerceBoost - Plataforma de Marketing Digital",
        "category": "Marketing Digital de Performance",
        "image": "https://placehold.co/600x400/5d3a9b/ffffff?text=EcommerceBoost+Marketing",
        "metric": "+347% ROI em 6 meses",
        "description": "Implementação completa de estratégia de marketing digital para e-commerce de moda, incluindo campanhas de Google Ads, Facebook Ads, SEO técnico e automação de marketing por email.",
        "technologies": ["Google Ads", "Facebook Ads", "Google Analytics", "Mailchimp", "SEO", "Conversion Optimization"],
        "results": {"roi": "+347%", "trafego": "+189%", "conversoes": "+245%", "cac": "-28%"},
        "challenge": "Cliente com baixo ROI (apenas 67% de retorno), alto CAC e dependência excessiva de tráfego pago sem estratégia orgânica.",
        "solution": "Desenvolvemos uma estratégia omnichannel integrando SEO técnico, campanhas de remarketing inteligentes, automação de email marketing e otimização de conversão.",
        "outcome": "Transformamos um negócio com dependência de tráfego pago em uma máquina de vendas sustentável com 70% do tráfego vindo de fontes orgânicas."
    },
    {
        "id": str(uuid.uuid4()),
        "title": "FinanceFlow - Aplicativo de Gestão Financeira",
        "category": "Desenvolvimento Web/Mobile",
        "image": "https://placehold.co/600x400/5d3a9b/ffffff?text=FinanceFlow+FinTech",
        "metric": "50.000+ usuários ativos",
        "description": "Desenvolvimento completo de aplicativo FinTech para gestão financeira pessoal e empresarial, com recursos de orçamento inteligente, análise de gastos e integração bancária.",
        "technologies": ["React Native", "Node.js", "MongoDB", "Stripe API", "Open Banking", "Machine Learning", "AWS"],
        "results": {"usuarios": "50.000+", "avaliacao": "4.8", "transacoes": "R$ 2.5M"},
        "challenge": "Criar um aplicativo FinTech completo que fosse seguro, intuitivo e competitivo em um mercado saturado de soluções similares.",
        "solution": "Implementamos arquitetura robusta com segurança bancária, UX/UI intuitiva, algoritmos de machine learning para insights financeiros e integração com Open Banking.",
        "outcome": "Aplicativo reconhecido como 'Melhor FinTech do Ano' pela Associação Brasileira de Fintechs, com crescimento orgânico de 15% ao mês."
    },
    {
        "id": str(uuid.uuid4()),
        "title": "MedAssist - Automação Inteligente para Clínicas",
        "category": "Automação com Inteligência Artificial",
        "image": "https://placehold.co/600x400/5d3a9b/ffffff?text=MedAssist+IA+Clinicas",
        "metric": "89% redução no tempo de atendimento",
        "description": "Sistema de automação inteligente para clínicas médicas, incluindo agendamento automatizado, triagem por IA, lembretes inteligentes e análise preditiva de demanda.",
        "technologies": ["Python", "TensorFlow", "GPT-4", "WhatsApp API", "PostgreSQL", "Docker", "Kubernetes"],
        "results": {"tempo_atendimento": "-89%", "faltas": "-67%", "satisfacao": "+234%", "economia": "R$ 45.000/mês"},
        "challenge": "Clínica com alta taxa de faltas (35%), atendimento manual sobrecarregado e falta de insights sobre demanda de serviços.",
        "solution": "Desenvolvemos IA conversacional para WhatsApp, sistema de triagem inteligente, lembretes automatizados e dashboard preditivo para gestão de agenda.",
        "outcome": "Transformação digital completa que permitiu à clínica expandir de 2 para 5 unidades mantendo a mesma equipe administrativa."
    }
]

testimonials = [
    {
        "id": str(uuid.uuid4()),
        "name": "Carolina Mendes",
        "position": "CEO",
        "company": "ModaStyle E-commerce",
        "avatar": "https://i.pravatar.cc/150?u=carolina@modastyle.com",
        "quote": "A Vertex Target transformou completamente nosso negócio. Em 6 meses, saímos de um ROI de 67% para 347%. A equipe não apenas entrega resultados, mas também educa nossa equipe interna. Hoje somos líderes no nosso segmento graças à estratégia omnichannel que eles desenvolveram.",
        "rating": 5,
        "project": "EcommerceBoost - Plataforma de Marketing Digital"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Ricardo Santos",
        "position": "Fundador",
        "company": "FinanceFlow Startup",
        "avatar": "https://i.pravatar.cc/150?u=ricardo@financeflow.com",
        "quote": "A Vertex Target foi fundamental para materializar nossa visão de FinTech. Eles entenderam nossa necessidade de segurança bancária e experiência do usuário. O resultado? 50.000 usuários ativos em 3 meses e reconhecimento como 'Melhor FinTech do Ano'. Parceria que recomendo sem hesitar.",
        "rating": 5,
        "project": "FinanceFlow - Aplicativo de Gestão Financeira"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Dr. Luiza Oliveira",
        "position": "Diretora Médica",
        "company": "Clínica Bem-Estar",
        "avatar": "https://i.pravatar.cc/150?u=dra.luiza@clinicabemestar.com",
        "quote": "A automação inteligente da Vertex Target revolucionou nossa operação. Reduzimos 89% do tempo de atendimento e aumentamos 234% a satisfação dos pacientes. O sistema de IA para WhatsApp é simplesmente incrível. Conseguimos expandir para 5 unidades mantendo a mesma equipe administrativa.",
        "rating": 5,
        "project": "MedAssist - Automação Inteligente para Clínicas"
    }
]

# --- 3. INSERÇÃO NA BASE DE DADOS ---

def popular_base_de_dados():
    """
    Função que insere o conteúdo estruturado na base de dados.
    """
    try:
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
            
        print("\n🎉 MISSÃO CUMPRIDA! A base de dados foi populada com conteúdo de alta qualidade.")
        print("Verifique o seu site. O novo conteúdo e as imagens devem estar a aparecer.")
        
        # Estatísticas da inserção
        portfolio_count = db.portfolio.count_documents({})
        testimonials_count = db.testimonials.count_documents({})
        print(f"\n📊 Estatísticas finais:")
        print(f"    - Projetos no portfolio: {portfolio_count}")
        print(f"    - Depoimentos: {testimonials_count}")

    except Exception as e:
        print(f"\n❌ Ocorreu um erro durante a execução: {e}")

if __name__ == "__main__":
    popular_base_de_dados()