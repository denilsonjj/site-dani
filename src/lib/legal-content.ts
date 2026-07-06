export type LegalDocumentKey = "cookies" | "privacy" | "terms";

type LegalSection = {
  heading?: string;
  items?: readonly string[];
  paragraphs?: readonly string[];
};

type LegalDocument = {
  introduction: readonly string[];
  sections: readonly LegalSection[];
  title: string;
};

export const legalDocuments: Record<LegalDocumentKey, LegalDocument> = {
  cookies: {
    title: "Política de Cookies",
    introduction: [
      "O website da Dani Therapies utiliza apenas os cookies estritamente necessários ao seu correto funcionamento, segurança e prestação dos serviços disponibilizados.",
      "Os cookies são pequenos ficheiros de texto armazenados no dispositivo do utilizador quando visita um website. Estes permitem garantir o funcionamento adequado de determinadas funcionalidades.",
    ],
    sections: [
      {
        heading: "Cookies Utilizados",
        paragraphs: ["O website utiliza apenas cookies essenciais, nomeadamente para:"],
        items: [
          "Garantir a segurança e o funcionamento do website;",
          "Permitir o acesso às áreas administrativas quando aplicável;",
          "Assegurar o correto processamento dos pagamentos efetuados através da plataforma Stripe.",
        ],
      },
      {
        paragraphs: ["Atualmente, o website não utiliza cookies de análise, publicidade, marketing ou criação de perfis de utilizadores."],
      },
      {
        heading: "Gestão de Cookies",
        paragraphs: [
          "Os cookies essenciais são indispensáveis ao funcionamento do website e, por esse motivo, não podem ser desativados sem comprometer determinadas funcionalidades.",
          "O utilizador poderá gerir ou eliminar os cookies através das definições do seu navegador. No entanto, essa ação poderá afetar o correto funcionamento do website.",
        ],
      },
      {
        heading: "Alterações à Política de Cookies",
        paragraphs: [
          "Caso venham a ser implementadas novas funcionalidades que utilizem cookies de análise, marketing ou outras tecnologias semelhantes, a presente Política de Cookies será atualizada antes da sua utilização.",
          "Recomenda-se a consulta periódica desta página para acompanhar eventuais alterações.",
        ],
      },
    ],
  },
  privacy: {
    title: "Política de Privacidade",
    introduction: [
      "A Dani Therapies respeita a privacidade dos utilizadores do seu website e compromete-se a proteger os seus dados pessoais, em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD) e a legislação aplicável nos Países Baixos.",
    ],
    sections: [
      {
        heading: "1. Dados Pessoais Recolhidos",
        paragraphs: ["Poderão ser recolhidos os seguintes dados pessoais:"],
        items: [
          "Nome;",
          "Endereço de e-mail;",
          "Número de telefone, quando aplicável;",
          "Dados fornecidos através do formulário de contacto;",
          "Dados necessários para inscrições em cursos, contratação de serviços e celebração dos respetivos acordos.",
        ],
      },
      {
        paragraphs: ["Poderão igualmente ser recolhidos dados técnicos indispensáveis ao funcionamento e segurança do website, tais como o endereço IP, tipo de navegador, data e hora de acesso e outros registos técnicos gerados pelos serviços de alojamento, Supabase e Stripe."],
      },
      {
        heading: "2. Finalidade da Recolha",
        paragraphs: ["Os dados são utilizados para:"],
        items: [
          "Responder aos pedidos de contacto;",
          "Gerir inscrições, marcações e prestação dos serviços;",
          "Processar pagamentos através da plataforma Stripe;",
          "Garantir a segurança e o correto funcionamento do website;",
          "Cumprir obrigações legais, quando aplicável.",
        ],
      },
      {
        heading: "3. Conservação e Proteção dos Dados",
        paragraphs: [
          "A Dani Therapies adota medidas técnicas e organizativas adequadas para proteger os dados pessoais contra acesso não autorizado, perda, alteração ou divulgação.",
          "Os dados serão conservados apenas durante o período necessário às finalidades para que foram recolhidos ou pelo prazo legalmente exigido.",
        ],
      },
      {
        heading: "4. Partilha de Dados",
        paragraphs: [
          "Os dados pessoais não serão vendidos nem cedidos a terceiros.",
          "Poderão ser tratados apenas por fornecedores indispensáveis ao funcionamento dos serviços, nomeadamente os serviços de alojamento do website, a plataforma Supabase e a plataforma Stripe, ou quando tal seja legalmente exigido.",
        ],
      },
      {
        heading: "5. Cookies",
        paragraphs: [
          "O website utiliza apenas os cookies estritamente necessários ao seu funcionamento.",
          "Para mais informações, consulte a Política de Cookies.",
        ],
      },
      {
        heading: "6. Direitos do Utilizador",
        paragraphs: [
          "Nos termos do RGPD, o utilizador tem o direito de aceder, retificar, apagar, limitar ou opor-se ao tratamento dos seus dados pessoais, bem como exercer o direito à portabilidade dos dados, quando legalmente aplicável.",
          "Para exercer qualquer destes direitos, poderá contactar a Dani Therapies através dos meios disponibilizados no website.",
        ],
      },
      {
        heading: "7. Alterações à Política de Privacidade",
        paragraphs: [
          "A Dani Therapies reserva-se o direito de atualizar a presente Política de Privacidade sempre que necessário.",
          "As alterações produzirão efeitos após a sua publicação no website.",
        ],
      },
    ],
  },
  terms: {
    title: "Termos e Condições - Dani Therapies",
    introduction: [
      "Agradecemos por escolher os serviços da Dani Therapies.",
      "Para garantir uma experiência transparente, respeitosa e segura para ambas as partes, solicitamos que leia atentamente os presentes Termos e Condições antes de agendar qualquer serviço.",
      "A marcação de uma sessão implica a leitura, compreensão e aceitação integral destes termos.",
    ],
    sections: [
      {
        heading: "Serviços",
        paragraphs: [
          "1. A Dani Therapies disponibiliza consultas, cursos e outros serviços de natureza espiritual e energética, destinados ao desenvolvimento pessoal, à orientação espiritual, ao equilíbrio energético e ao desenvolvimento da perceção sensorial.",
          "2. Os serviços destinam-se a proporcionar orientação, desenvolvimento pessoal e expansão da consciência. A Facilitadora não garante resultados específicos nem faz promessas relativamente a situações pessoais, profissionais, financeiras ou empresariais.",
          "3. A Facilitadora não é profissional de saúde. Os serviços prestados não substituem acompanhamento médico, psicológico, psiquiátrico ou qualquer outro tratamento de saúde.",
        ],
      },
      {
        heading: "Pagamentos",
        paragraphs: [
          "4. O pagamento deverá ser efetuado na totalidade antes da realização da sessão, salvo acordo escrito em contrário.",
          "5. Os valores dos serviços são apresentados no momento da reserva ou da contratação. A Facilitadora reserva-se o direito de os alterar a qualquer momento, sem efeitos sobre serviços já confirmados.",
        ],
      },
      {
        heading: "Cancelamento de Serviços",
        paragraphs: [
          "7. Após a confirmação da reserva e do respetivo pagamento, o cancelamento não será possível.",
          "8. Caso o cliente não possa comparecer à sessão, poderá transferir a reserva para outra pessoa, desde que comunique essa intenção com, pelo menos, 48 horas de antecedência, através de WhatsApp ou e-mail.",
          "9. O reagendamento apenas poderá ser analisado quando solicitado dentro do prazo referido e dependerá da disponibilidade da Facilitadora.",
          "10. Nos termos da legislação aplicável, o direito de livre resolução não se aplica aos serviços prestados numa data ou período específicos. Assim, após a confirmação da reserva e do pagamento, não haverá lugar a cancelamento nem a reembolso.",
          "11. Em situações verdadeiramente excecionais e devidamente justificadas, a Facilitadora poderá analisar cada caso individualmente, reservando-se o direito de decidir sobre a solução mais adequada.",
        ],
      },
      {
        heading: "Responsabilidade",
        paragraphs: [
          "12. A Facilitadora presta orientação e acompanhamento espiritual. A responsabilidade pelas decisões, escolhas e ações tomadas com base nas informações recebidas é exclusivamente do cliente.",
          "13. A Facilitadora não se responsabiliza por decisões, ações, omissões, perdas, danos ou quaisquer consequências decorrentes da utilização dos seus serviços.",
        ],
      },
      {
        heading: "Confidencialidade",
        paragraphs: [
          "14. Todas as informações partilhadas pelo cliente durante as sessões serão tratadas com absoluta confidencialidade.",
          "15. As informações apenas poderão ser divulgadas quando exista obrigação legal ou quando tal seja exigido para proteger a vida, a segurança ou a integridade física de qualquer pessoa.",
        ],
      },
      {
        heading: "Saúde e Bem-Estar",
        paragraphs: [
          "16. Os serviços prestados pela Dani Therapies não substituem tratamentos médicos, psicológicos, psiquiátricos ou terapêuticos.",
          "17. A Facilitadora não realiza diagnósticos nem presta aconselhamento médico.",
          "18. Caso o cliente esteja sob acompanhamento médico ou psicológico, recomenda-se que mantenha o respetivo acompanhamento durante todo o processo.",
        ],
      },
      {
        heading: "Propriedade Intelectual",
        paragraphs: [
          "19. Todo o conteúdo disponibilizado pela Dani Therapies, incluindo textos, documentos, exercícios, gravações, meditações, imagens, materiais digitais e quaisquer outros conteúdos fornecidos ao cliente, constitui propriedade intelectual da Facilitadora.",
          "20. É expressamente proibida a reprodução, gravação, distribuição, comercialização, adaptação ou partilha, total ou parcial, desses materiais sem autorização prévia e por escrito da Facilitadora.",
        ],
      },
      {
        heading: "Alterações dos Termos e Condições",
        paragraphs: [
          "21. A Facilitadora reserva-se o direito de alterar os presentes Termos e Condições a qualquer momento.",
          "22. As alterações produzirão efeitos a partir da sua publicação no website, salvo indicação em contrário.",
        ],
      },
      {
        heading: "Lei Aplicável e Resolução de Disputas",
        paragraphs: [
          "23. As partes comprometem-se a procurar, em primeiro lugar, uma resolução amigável para qualquer litígio decorrente da prestação dos serviços.",
          "24. Não sendo possível alcançar um acordo, o litígio será submetido ao tribunal competente de Amesterdão, Países Baixos, sendo aplicável a legislação dos Países Baixos.",
        ],
      },
      {
        heading: "Pontualidade",
        paragraphs: ["25. O cliente deverá comparecer à sessão na data e hora previamente agendadas. Em caso de atraso, o tempo correspondente será descontado da duração da sessão, sem direito a prolongamento."],
      },
      {
        heading: "Rescisão do Acordo",
        paragraphs: [
          "26. A Facilitadora reserva-se o direito de rescindir, de forma imediata e sem direito a reembolso, a prestação dos serviços a qualquer cliente que pratique abuso verbal, difamação, calúnia, intimidação, assédio ou qualquer outro comportamento que comprometa a segurança, o respeito ou o normal desenvolvimento da sessão.",
          "27. Sem prejuízo da rescisão do acordo, a Facilitadora poderá recorrer aos meios legais que considere adequados para a defesa dos seus direitos e interesses.",
        ],
      },
    ],
  },
};
