// ============================================================================
// data.js — Base de dados compartilhada da codificação qualitativa
// Entrevista: gestor do programa de corporate venture capital de um grupo varejista
// Frameworks: Dedutivo | Indutivo | GATOS | CollabCoder | Bardin
// ============================================================================

const META = {
  estudo: "Estudo de caso da tese de doutorado (PUC Minas, defendida em agosto de 2025) — Transformação digital e inovação aberta em um grupo econômico do varejo (programa de corporate venture capital)",
  fonte: "Entrevista semiestruturada com o gestor do programa de inovação aberta (codinome: Júlio), 17 perguntas, ~1h08min",
  informante: "Gestor do programa de inovação aberta (anonimizado conforme TCLE)",
  modelo: "Claude (Opus 4.x) — assistência de codificação sob revisão humana",
  temperatura: "0.0–0.2 (codificação dedutiva e categorial); 0.0–0.3 (indutiva/GATOS)",
  data: "2026-06-30",
  unidadeRegistro: "Turno de fala temático do informante (paragrafação por mudança de tópico)",
  nSegmentos: 55,
  nCodigos: 37,
};

// --- Codebook a priori (37 códigos) -----------------------------------------
const CODEBOOK = {
  1:  ["Clientes", "Inteligência sobre necessidades/percepções de clientes."],
  2:  ["Concorrência", "Movimentos estratégicos/tecnológicos de rivais como referência."],
  3:  ["Crises", "Eventos disruptivos que afetam o setor."],
  4:  ["Estratégias Digitais Deliberadas", "Planos formais top-down de TD (roadmaps, OKRs, KPIs)."],
  5:  ["Estratégias Digitais Emergentes", "Estratégia formada por aprendizagem/experimentação (POCs, pivôs)."],
  6:  ["Eficiência Operacional", "Ganhos de produtividade/redução de custos via TD."],
  7:  ["Experiência do Cliente", "Melhorias perceptíveis ao usuário final habilitadas por TD."],
  8:  ["Novos Negócios", "Fluxos de receita inéditos ou plataformas digitais criadas."],
  9:  ["Automação de Processos", "Tecnologia substituindo tarefas humanas repetitivas (RPA, bots)."],
  10: ["Data Analytics", "BI, ML ou IA para gerar insights."],
  11: ["Exploração Contínua", "Busca sistemática de tecnologias emergentes e experimentação."],
  12: ["Motivador Organizacional", "Pressões internas (cultura, liderança) que impulsionam a TD."],
  13: ["Motivador Ético-legal", "Obrigação/incentivo regulatório-normativo (LGPD, ESG)."],
  14: ["Motivador Estratégico", "Busca de vantagem competitiva ou defesa de mercado."],
  15: ["Motivador Tecnológico", "Disponibilidade/maturação de novas tecnologias."],
  16: ["Barreira Organizacional", "Cultura/estruturas rígidas que dificultam a TD."],
  17: ["Barreira Ético-legal", "Riscos legais/reputacionais que inibem iniciativas digitais."],
  18: ["Barreira Estratégica", "Falta de visão/conflitos de portfólio que bloqueiam TD."],
  19: ["Barreira Tecnológica", "Infraestrutura legada ou falta de competências técnicas."],
  20: ["Open Sourcing", "Liberação de código/IP para comunidade ou parceiros."],
  21: ["Crowdsourcing", "Captação de ideias/capital/microtarefas de uma multidão."],
  22: ["Competições", "Hackathons, desafios ou chamadas abertas para solucionar problemas."],
  23: ["Prêmios", "Incentivos financeiros/simbólicos para reconhecer inovação aberta."],
  24: ["Intraorganizacional", "Inovação aberta no nível de equipes/indivíduos da firma."],
  25: ["Organizacional", "Iniciativas que abrangem a empresa como um todo (governança digital)."],
  26: ["Interorganizacional", "Colaborações formais entre duas ou mais organizações."],
  27: ["Sistemas de Inovação", "Redes regionais/setoriais amplas (parques, hubs, hélice quádrupla)."],
  28: ["Forma Interna", "Estruturas de IA controladas só pela empresa (labs, capacidades)."],
  29: ["Forma Externa", "Mecanismos de IA com parceiros externos (CVC, aquisições, consórcios)."],
  30: ["Propriedade Intelectual", "Gestão de patentes, marcas, copyrights e licenças."],
  31: ["Outside-in", "Fluxo de conhecimento/tecnologia que entra na organização."],
  32: ["Inside-out", "Compartilhamento deliberado de know-how para o exterior (spin-off, licença)."],
  33: ["Colaboração Aberta", "Processos bidirecionais de cocriação multilateral."],
  34: ["Oportunidades na Cadeia de Valor", "Lacunas/sinergias upstream e downstream para valor digital."],
  35: ["Novos e Revisitados Modelos de Negócios", "Criação/pivotagem de lógicas de captura de valor."],
  36: ["Barreira Interna – Inovação Aberta", "Fatores internos que retardam a adoção de práticas de IA."],
  37: ["Barreira Externa – Inovação Aberta", "Fatores de mercado/regulatórios que restringem o fluxo de conhecimento."],
};

// --- Segmentos codificados (dedutivo) ---------------------------------------
// id, t(timestamp), codes [primário, secundário?], ev(evidência verbatim), conf, obs
const SEGMENTS = [
  ["S01","00:01:52",[31,29],"“todas as iniciativas que nascem a partir de dores, temas de interesse do grupo, e que… se usa como estratégia um olhar para fora de casa… em busca de startups ou de soluções externas”",0.90,"Conceito de IA do informante = sourcing externo (outside-in)."],
  ["S02","00:02:26",[29,31],"“a tese do [Programa CVC] é justamente promover… me torno atraente para as startups… contrato a sexta etapa e, ao mesmo tempo, o [Grupo Varejista] gera um case”",0.85,"CVC como mecanismo de atração e geração de case."],
  ["S03","00:03:27",[22,26],"“o [Grupo Varejista] já fez… a chamada [Chamada do Programa]… participante do [Chamada Setorial], que é uma chamada voltada para o varejo”",0.80,"Chamadas como prática recorrente de IA."],
  ["S04","00:04:00",[11,31],"“nós temos uma espera contínua de avaliação de startups. Sempre que surge alguma solução interessante… a gente traz, envolve as áreas de negócio”",0.80,"Scouting contínuo."],
  ["S05","00:04:41",[12,31],"“você tem que ter um embasamento de cultura de inovação dentro de casa… a solução lá do [Empresa do Grupo], trouxe a conexão com uma outra empresa, que é uma startup… a cultura da inovação já está [enraizando]”",0.80,"Cultura como precondição + caso outside-in."],
  ["S06","00:05:15",[29,8],"“o [Programa CVC] protagoniza em alguns casos… resolver as dores dentro de casa… e o segundo que é explorar a oportunidade de negócio… investir naquele negócio, ter uma participação nele”",0.80,"Dupla lógica: resolver dor + investir."],
  ["S07","00:05:49",[12,31],"“a gente tem fácil acesso a toda a direção da empresa, aos decisores… Tem uma solução que é a NeoPro, que está rodando lá dentro hoje, está nas lojas”",0.80,"Acesso à liderança + adoção outside-in."],
  ["S08","00:06:24",[29,31],"“Teve uma iniciativa que não prosperou… de last mile… O [Programa CVC] também investiu na [Empresa Investida], que é uma boutique de desenvolvimento de produtos”",0.75,"Portfólio de investimentos; iniciativa fracassada."],
  ["S09","00:06:55",[29,8],"“A gente trouxe essa empresa para o portfólio e ela já tem alguns produtos pré-desenvolvidos e que precisam de uma ajuda de go to market”",0.75,"Empresa investida; apoio de go-to-market."],
  ["S10","00:07:29",[7,6],"“um aplicativo que eu estou chamando de Casa de Conecta, que ajuda na interação dos vendedores conectando as campanhas de marketing… oferecer essas campanhas para os clientes de uma maneira organizada”",0.65,"Produto digital interno; fronteira CX/eficiência (ambíguo)."],
  ["S11","00:08:01",[32,35],"“a ideia é que ele vire um spin-off disso, que ele nasça dentro ali, da [Empresa Investida]… a gente encapsule ele num produto”",0.85,"Spin-off / produtização (inside-out)."],
  ["S12","00:08:36",[11,12],"“Iniciativas como essa vêm acontecendo com um pouco mais de recorrência nos últimos dois anos… já há uns três anos o Grupo vem olhando”",0.70,"Recorrência crescente das iniciativas."],
  ["S13","00:09:13",[6,10],"“ele ajuda os gestores, os regionais, os gerentes de loja a fazerem a gestão das metas… cria um acompanhamento… uma espécie de [gamificação]”",0.70,"Ferramenta de gestão operacional; fronteira com analytics."],
  ["S14","00:10:00",[37,30],"“teve lá as dificuldades com um dos sócios… a inovação aberta tem isso também… o produto… é um patrimônio do [Grupo Varejista]”",0.75,"Fracasso de parceria; ativo retido."],
  ["S15","00:10:49",[30,37],"“A startup, ela não continuou, o founder… acabou desistindo… Então tem esse ativo dentro de casa”",0.70,"Founder desiste; código-fonte como ativo."],
  ["S16","00:11:23",[34,8],"“um WMS, uma ferramenta pra gestão de warehouses… acoplar uma ferramenta de tracking e gestão desses produtos. E até a venda no B2B”",0.75,"Oportunidade na cadeia de valor (logística/B2B)."],
  ["S17","00:12:01",[5],"“É uma iniciativa que não deu certo no seu core… mas não é de todo perdido. Gerou também alguns ganhos lá naquele momento”",0.50,"Aprendizado com fracasso; baixa saliência — revisão humana."],
  ["S18","00:12:58",[29,5],"“o produto está sendo desenvolvido pela [Empresa Investida]… mas numa POC dentro do [Grupo Varejista]… Por isso que nós trouxemos eles como investida do [Programa CVC]”",0.80,"Investida + POC (forma externa/experimentação)."],
  ["S19","00:13:31",[5,24],"“idealizarmos junto… com uma área de negócio ali dentro te dando os drives… já tem uma versão 1 feita… criando um módulo 2… roadmap depois pro 3, pro 4”",0.70,"Codesenvolvimento iterativo com área interna."],
  ["S20","00:14:36",[32,35],"“a gente oferecer pra alguns outros varejistas… gerar um [crescimento] do MVP… e aí partir pra um mercado mesmo, virar um spin-off”",0.80,"Escalonamento via MVP; spin-off."],
  ["S21","00:15:28",[19,18],"“É uma arquitetura monolítica, o mesmo problema… de alguns ERPs… a decisão lá do Board do [Grupo Varejista] foi de esperar… Tá meio que um weight essa ideia”",0.80,"Barreira tecnológica (legado) + decisão estratégica de adiar."],
  ["S22","00:17:43",[29,8],"“a gente investe e compra a participação nessas startups… A gente entrou como sócio… seja através de um mútuo, seja entrar no próprio quadro social… uma empresa de participações onde a gente pendura o portfólio”",0.85,"Estrutura de CVC (equity)."],
  ["S23","00:18:47",[26,29],"“a gente tem usado bastante o relacionamento dos caras… para desenvolver parcerias que tragam algum tipo de ganho… Não temos uma iniciativa como entrar juntos num [FINEP]… Tem espaço”",0.70,"Parcerias por relacionamento; lacuna em financiamento conjunto."],
  ["S24","00:19:55",[27,26],"“muito interessa se aproximar das universidades, dos parques… Agora chegou a PIT, mas a gente ainda não desenhou nada junto, mas tem interesse”",0.70,"Interesse em sistemas de inovação (ainda não estruturado)."],
  ["S25","00:20:44",[4,12],"“toda empresa… tem que se transformar. Ela parte de uma visão estratégica… um programa que é [Escola de Negócios]… que ajuda as empresas a estruturar uma visão estratégica”",0.80,"Estratégia como origem da TD."],
  ["S26","00:21:52",[6,31],"“como é que eu otimizo uma lapidação do que já tenho… resolvo questões de ineficiências… esse horizonte único, você não resolve ele somente com o seu time dentro de casa”",0.75,"Eficiência (horizonte 1) + necessidade do externo."],
  ["S27","00:22:55",[31,11],"“A transformação digital… engloba… um olhar também pra fora da inovação… os horizontes dois e três… estar antenado para o que vem surgindo de novo, que pode… disruptar… o seu negócio”",0.80,"TD e IA inseparáveis; horizontes 2-3, scanning."],
  ["S28","00:24:27",[22,26],"“organizando chamadas de inovação aberta… o que nós fazemos para o [Grupo Varejista] também serve de muita ajuda a outros grupos”",0.80,"Chamada com dupla conotação (compartilhável)."],
  ["S29","00:25:05",[26,22],"“juntamos quatro varejistas, identificamos dois temas de interesse em comum… atraímos 73 startups… a possibilidade de 11 POCs, no final 9 concretizaram”",0.85,"Consórcio multi-varejista com POCs."],
  ["S30","00:26:15",[31,5],"“vai para o mercado de inovação aberta, atrai startups, valida… vai até a fase de uma POC, um piloto para validar… o caminho de contratar startups e resolver aquele problema”",0.80,"Funil: sourcing → POC → contratação."],
  ["S31","00:26:49",[4,29],"“a gente trabalha medindo os OKRs… E o caminho dois, você pode também investir em startup… a gente pode fazer uma proposta de investimento”",0.75,"OKRs + caminho de investimento."],
  ["S32","00:27:59",[31,12],"“você tem muito próximo de você um time de negócio… e uma disposição de olhar para fora. Um programa de inovação aberto é um belo caminho, além das iniciativas internas”",0.70,"Time interno + disposição para fora."],
  ["S33","00:28:31",[22,4],"“cheguei com os quatro varejistas, nós fechamos cinco macro temas… dez sub temas… A gente cria uma [lâmina]… mostrando o que a gente pretende oferecer”",0.65,"Desenho do funil de chamada."],
  ["S34","00:29:01",[23,22],"“aqui não vai ser um programa para você ganhar um prêmio lá, um iPhone… O prêmio aqui é emissão de nota fiscal… queríamos já um produto que tivesse alguma validação de mercado”",0.70,"Caso negativo de ‘Prêmios’: foco em geração de negócio."],
  ["S35","00:30:04",[31,22],"“uma plataforma que tem umas 10 mil startups… A gente vai lá e filtra dentro do segmento… E aí você faz um trabalho de screening aí dentro… De busca ativa de startups”",0.70,"Maquinaria de sourcing/screening."],
  ["S36","00:31:07",[27,31],"“Aí vamos nos hubs, parceiros… Vamos nos eventos, fazer uma espécie de uma blitz… Então vamos nas universidades. Tem um trabalho de divulgação muito forte”",0.70,"Hubs, eventos e universidades no sourcing."],
  ["S37","00:32:07",[26,31],"“A gente tem uma [plataforma] que é parceira do [Programa CVC]… conhece os founders… Tem uma parceria já com eles de [outro tempo]… dá pra fazer um trabalho menos frio”",0.65,"Plataforma parceira para screening."],
  ["S38","00:33:05",[29,18],"“optamos por não estruturar um fundo… quando você cria um fundo você está com o rabo preso… A captação nossa a gente vai fazer primeiro em recursos próprios… co-investir com a gente… family offices”",0.70,"Modelo de captação: capital próprio + co-investimento; opção estratégica de não criar fundo."],
  ["S39","00:35:20",[29,8],"“eu estou entre um [seed], um Pre-[seed], um ANGEL… mais organizado… o que a gente quer é um cara depois desse ANGEL… a gente vai abrir portas para ele”",0.65,"Posicionamento de estágio (anjo com aporte de valor)."],
  ["S40","00:36:54",[23,33],"“A gente não previu e não tem ideia de premiar… O que dá para surgir é alguma cooperação… o [Grupo Varejista] pode ajudar demais esse cara a desenvolver, lapidar esse produto… o apoio do meu cara de TI”",0.65,"Sem prêmios; apoio/cooperação como contrapartida."],
  ["S41","00:38:28",[29,25],"“a gente submete a investida a uma governança mínima que a gente estabeleceu, é um padrão de governança… se você tem [mútuo] conversível… a necessidade de uma governança mais rígida é menor”",0.65,"Governança da investida proporcional ao grau de participação."],
  ["S42","00:39:00",[29,30],"“quando você… vira sócio… estabelece um conselho, escreve um acordo de acionistas que limita… as ações do diretor administrativo… reuniões bimestrais… a gente impõe uma governança”",0.65,"Acordo de acionistas, conselho, report."],
  ["S43","00:40:51",[21],"“[crowdsourcing para financiar] Não, hoje não. Não gosto, não quero. Não chegamos a pensar… Mas não quer dizer que é algo que não podemos pensar um dia”",0.70,"Caso negativo: crowdsourcing recusado."],
  ["S44","00:41:38",[30,37],"“Pela dívida troca-se o código fonte, beleza. Fiz o contrato e ficou acertado contratualmente… o direito autoral do produto desenvolvido é da empresa”",0.80,"Negociação de PI/código-fonte na saída do founder."],
  ["S45","00:44:06",[27,26],"“a gente tem algumas comunidades que a gente faz parte… o [Parque Empresarial], tem um clube de inovação aqui dentro… O [Programa CVC] é parceiro do [Parque Empresarial]”",0.75,"Comunidades, business park, clube de inovação."],
  ["S46","00:45:00",[27,26],"“[[Parque Empresarial]] é um centro [empresarial], mas também é um hub de inovação. Tem uma força grande no agronegócio… É um parceiro também nosso”",0.70,"Hub de inovação parceiro."],
  ["S47","00:45:44",[12,25],"“está em um bom caminho… o grupo… é um grupo empreendedor… já vem praticando ações de inovação há pelo menos uns três anos”",0.70,"Prontidão organizacional; grupo empreendedor."],
  ["S48","00:46:17",[12,25],"“A alta gestão incentiva e pratica, porque isso é fundamental. Se você não tem uma alta gestão que apoia… não vai pra frente… um time que gosta… empolgado com essa coisa de inovar”",0.85,"Apoio da alta gestão e cultura."],
  ["S49","00:46:51",[16,12],"“Ainda tem uma jornada boa pra se tornar… Esse aspecto de cultura e de inovação tem que continuar sendo feito, iniciativas de letramento e aculturamento”",0.65,"Barreira: cultura ainda em maturação."],
  ["S50","00:48:00",[37,27],"“não é uma parceria muito estreita [com o Parque Tecnológico]… percebi que há alguma dificuldade… de uma [corporate]… se estabelecer. Talvez até pelo segmento… A região é extremamente industrial”",0.65,"Barreira externa de IA; ecossistema desalinhado ao segmento."],
  ["S51","00:49:55",[30],"“Patente ainda não tivemos nenhum caso… o que a gente trabalha é essa questão de marca, então domínio… a parte de patente, nós não temos nada desenhado”",0.80,"Gestão de PI: marca/domínio sim, patente não."],
  ["S52","00:51:48",[26,31],"“A gente tem a [Escola de Negócios] como um pilar… os sócios pudessem trazer suas competências… colocando esse mercado à disposição da [startup de ESG], abrindo o mercado para ela”",0.75,"Parceiros de conhecimento; aporte de mercado a investida (ESG)."],
  ["S53","00:54:46",[28,5],"“eu sou um agilista de natureza… [Empresa Investida] também… trazem essa competência… um pilar especializado em design… materializar isso num protótipo”",0.60,"Capacidade interna de ágil/design/produto."],
  ["S54","00:56:38",[28],"“Uma competência disponível, hoje… eu tenho essa competência disponível à medida que eu precise”",0.50,"Capacidade disponível sob demanda."],
  ["S55","01:01:05",[14,18],"“O desafio é consolidar isso, trazer a inovação como algo que faça sentido, que traga retorno, que gera valor para as empresas”",0.55,"Desafio estratégico de consolidar valor (trecho de apresentação)."],
];

// --- CollabCoder: divergências antes do consenso ----------------------------
const DIVERGENCIAS = [
  ["S10","C07","C06","Fronteira pouco clara entre categorias","C07 (Experiência do Cliente)","Foco no usuário final prevalece sobre o ganho de eficiência interna.",false],
  ["S13","C06","C10","Foco interpretativo distinto","C06 (Eficiência Operacional)","Ferramenta de acompanhamento de metas é gestão operacional, não analytics preditivo.",false],
  ["S14","C37","C30","Foco interpretativo distinto","C37 (Barreira Externa – IA)","O ponto central é o fracasso da parceria; a PI é consequência (secundária).",false],
  ["S15","C30","C37","Foco interpretativo distinto","C30 (Propriedade Intelectual)","O ativo retido (código-fonte) é o significado dominante.",false],
  ["S17","C05","NC","Definição ambígua do código","Mantido em aberto","Saliência baixa; divergência genuína — decisão sênior.",true],
  ["S19","C05","C24","Fronteira pouco clara entre categorias","C05 (Estratégias Digitais Emergentes)","Iteração/roadmap prevalece sobre o nível intraorganizacional.",false],
  ["S21","C19","C18","Foco interpretativo distinto","C19 (Barreira Tecnológica)","Arquitetura monolítica é a causa-raiz; o adiamento do board é efeito.",false],
  ["S26","C06","C31","Definição ambígua do código","Mantido em aberto","Eficiência (horizonte 1) vs. abertura externa — divergência genuína.",true],
  ["S30","C31","C05","Fronteira pouco clara entre categorias","C31 (Outside-in)","O fluxo de entrada de soluções é o eixo; a POC é instrumento.",false],
  ["S33","C22","C04","Fronteira pouco clara entre categorias","C22 (Competições)","O desenho descreve a mecânica da chamada, não um plano estratégico formal.",false],
  ["S34","C23","C22","Definição ambígua do código","C23 (Prêmios — caso negativo)","Verbatim nega explicitamente prêmios; codifica-se como ausência relevante.",false],
  ["S38","C29","C18","Foco interpretativo distinto","C29 (Forma Externa)","O tema é o mecanismo de captação do CVC; a opção de não criar fundo é nuance.",false],
  ["S40","C23","C33","Foco interpretativo distinto","C23 (Prêmios — caso negativo)","Reitera a recusa de prêmios; a cooperação é o substituto.",false],
  ["S41","C29","C25","Fronteira pouco clara entre categorias","C29 (Forma Externa)","Governança da investida integra o mecanismo de CVC.",false],
  ["S49","C16","C12","Foco interpretativo distinto","C16 (Barreira Organizacional)","Ênfase na jornada cultural pendente (barreira), não no motivador.",false],
  ["S50","C37","C27","Fronteira pouco clara entre categorias","C37 (Barreira Externa – IA)","Dificuldade de inserção é barreira; o sistema de inovação é o contexto.",false],
  ["S53","C28","C05","Foco interpretativo distinto","C28 (Forma Interna)","Capacidade interna (ágil/design) é o significado; a experimentação é uso.",false],
  ["S55","C14","C18","Definição ambígua do código","C14 (Motivador Estratégico)","Consolidar valor é vetor estratégico, não barreira.",false],
];

const KAPPA = {
  antes: { n: 55, conc: 37, po: 0.6727, pe: 0.0678, kappa: 0.6489, interp: "substancial" },
  depois:{ n: 55, conc: 53, po: 0.9636, pe: 0.0760, kappa: 0.9606, interp: "quase perfeita" },
  residual: ["S17","S26"],
};

// --- Indutivo (Braun & Clarke): códigos emergentes e temas -------------------
const INDUTIVO = {
  codigos: [
    ["IND-01","O grupo econômico como ímã e gerador de case para startups","S01,S02,S07,S32"],
    ["IND-02","Dupla lógica: resolver a dor interna e investir no negócio","S06,S22,S31"],
    ["IND-03","Funil de chamada: tema → divulgação → screening → POC → contratação/investimento","S28,S29,S30,S33,S34,S35"],
    ["IND-04","Consórcio entre varejistas não concorrentes para ratear o custo da inovação","S28,S29"],
    ["IND-05","CVC ‘leve’, estilo anjo, com aporte de valor (abrir portas e lapidar produto)","S38,S39,S40"],
    ["IND-06","Captação sem fundo estruturado: capital próprio + co-investimento de family offices","S38"],
    ["IND-07","Spin-off de produto incubado dentro do cliente (POC no [Grupo Varejista])","S11,S18,S19,S20"],
    ["IND-08","Ativo retido apesar do fracasso da parceria (código-fonte vira patrimônio)","S14,S15,S44"],
    ["IND-09","Governança progressiva da investida conforme o grau de participação","S41,S42"],
    ["IND-10","Cultura e apoio da alta gestão como precondição da inovação","S05,S47,S48,S49"],
    ["IND-11","Conhecimento de inovação trazido pelos sócios ([Escola de Negócios], [Consultoria Parceira], design/ágil)","S52,S53,S54"],
    ["IND-12","Ecossistema regional incipiente (universidades/parques com laço fraco)","S24,S36,S45,S46,S50"],
    ["IND-13","Recusa deliberada de prêmios e de crowdsourcing","S34,S40,S43"],
  ],
  temas: [
    ["T1","O grupo econômico como ativo de atração e validação","IND-01, IND-02, IND-05","O diferencial competitivo do programa é usar a relevância do grupo varejista para atrair startups e validar soluções, oferecendo ‘case’ e mercado em vez de capital puro."],
    ["T2","Arquitetura operacional da inovação aberta","IND-03, IND-04, IND-06","O funil de chamadas, o consórcio inter-varejista e o modelo híbrido de captação organizam a prática de IA de forma replicável e de baixo custo fixo."],
    ["T3","Da POC ao produto: incubação e spin-off","IND-07, IND-08","Produtos nascem como POC dentro do cliente e amadurecem rumo a spin-off; mesmo parcerias fracassadas deixam ativos (código-fonte) reaproveitáveis."],
    ["T4","Governança e gestão do portfólio","IND-09, IND-13","A governança escala com a participação; o programa recusa prêmios e crowdsourcing, sinalizando opção por mecanismos de equity e cooperação."],
    ["T5","Capacidades e ecossistema","IND-10, IND-11, IND-12","Cultura, apoio da alta gestão e competências dos sócios sustentam a IA, mas o laço com o ecossistema regional de C&T ainda é frágil."],
  ],
};

// --- GATOS: desenvolvimento incremental do codebook + saturação -------------
// unidade -> nº de códigos novos criados naquela unidade (lógica GATOS)
const GATOS_GROWTH = [
  ["S01",2,"Outside-in; Forma Externa"],
  ["S03",1,"Competições (chamadas)"],
  ["S04",1,"Exploração Contínua"],
  ["S05",1,"Motivador Organizacional"],
  ["S06",1,"Novos Negócios (investir)"],
  ["S10",2,"Experiência do Cliente; Eficiência Operacional"],
  ["S11",2,"Inside-out; Novos Modelos de Negócio"],
  ["S13",1,"Data Analytics"],
  ["S14",2,"Barreira Externa – IA; Propriedade Intelectual"],
  ["S16",1,"Oportunidades na Cadeia de Valor"],
  ["S18",0,"(reutiliza Forma Externa / Emergentes)"],
  ["S19",1,"Intraorganizacional"],
  ["S21",2,"Barreira Tecnológica; Barreira Estratégica"],
  ["S24",1,"Sistemas de Inovação"],
  ["S25",1,"Estratégias Digitais Deliberadas"],
  ["S26",1,"Eficiência Operacional (horizonte 1)"],
  ["S29",1,"Interorganizacional"],
  ["S34",1,"Prêmios (caso negativo)"],
  ["S38",1,"Barreira Estratégica (opção de não criar fundo)"],
  ["S43",1,"Crowdsourcing (caso negativo)"],
  ["S49",1,"Barreira Organizacional"],
  ["S53",1,"Forma Interna (capacidade)"],
  ["S55",1,"Motivador Estratégico"],
];
const GATOS_SATURACAO = "Após S53 (Forma Interna) e S55 (Motivador Estratégico), as unidades restantes (incluindo o trecho de encerramento/negociação FINEP) reutilizaram códigos existentes. Aplicando N = 10 unidades consecutivas sem código novo, considera-se o codebook saturado a partir de S55. O codebook indutivo final convergiu para ~24 códigos efetivamente acionados, dos 37 a priori.";

// --- Bardin: macrocategorias e frequências ----------------------------------
const BARDIN_CATS = [
  ["A","Antecedentes / Inteligência Competitiva","1, 2, 3"],
  ["B","Estratégias Digitais","4, 5"],
  ["C","Resultados de valor da TD","6, 7, 8"],
  ["D","Tecnologias digitais","9, 10, 11"],
  ["E","Motivadores da TD","12, 13, 14, 15"],
  ["F","Barreiras da TD","16, 17, 18, 19"],
  ["G","Mecanismos de Inovação Aberta","20, 21, 22, 23"],
  ["H","Níveis de Inovação Aberta","24, 25, 26, 27"],
  ["I","Formas e gestão da IA","28, 29, 30"],
  ["J","Fluxos de conhecimento","31, 32, 33"],
  ["K","Geração de valor","34, 35"],
  ["L","Barreiras da Inovação Aberta","36, 37"],
];

// --- cálculo de frequências de código a partir dos segmentos ----------------
function freqCodigos() {
  const f = {};
  for (let i = 1; i <= 37; i++) f[i] = 0;
  for (const s of SEGMENTS) for (const c of s[2]) f[c] = (f[c] || 0) + 1;
  return f;
}
function totalOcorrencias() {
  return Object.values(freqCodigos()).reduce((a, b) => a + b, 0);
}
function freqPorMacro() {
  const f = freqCodigos();
  return BARDIN_CATS.map(([id, nome, codigos]) => {
    const ids = codigos.split(",").map(x => parseInt(x.trim(), 10));
    const n = ids.reduce((a, c) => a + (f[c] || 0), 0);
    return { id, nome, codigos, n };
  });
}
function codigosAusentes() {
  const f = freqCodigos();
  return Object.keys(f).filter(k => f[k] === 0).map(k => parseInt(k, 10));
}

module.exports = {
  META, CODEBOOK, SEGMENTS, DIVERGENCIAS, KAPPA, INDUTIVO,
  GATOS_GROWTH, GATOS_SATURACAO, BARDIN_CATS,
  freqCodigos, totalOcorrencias, freqPorMacro, codigosAusentes,
};
