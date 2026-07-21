import type { SiteService } from "./cms";
import type { Locale } from "./content";
import translatedSessionDetails from "./session-details-translations.json";

type AboutPageContent = {
  back: string;
  eyebrow: string;
  title: string;
  intro: string[];
  quote: string;
  servicesEyebrow: string;
  servicesTitle: string;
  servicesBody: string[];
  sessionsAction: string;
};

export const aboutPageContent: Record<Locale, AboutPageContent> = {
  pt: {
    back: "Voltar à página inicial",
    eyebrow: "Quem Somos",
    title: "Oi! Eu sou a Dani",
    intro: [
      "Sou Curadora Noética Espiritual e Educadora do Despertar da Consciência, atuando no trabalho Terapêutico, Espiritual e Energético.",
      "A minha missão é conduzir pessoas de volta à sua essência, restaurando a sua energia vital, alinhando os corpos sutis e reconectando cada Ser à sua verdade mais profunda.",
      "Canalizo equipas espirituais de alta frequência, consciências que me acompanham num trabalho de cura e reconexão com a essência.",
      "Por meio da escuta sensível, de leituras espirituais, canalizações intuitivas e práticas restauradoras, atuo como ponte entre planos: o visível e o invisível, o mental e o espiritual, o humano e o divino.",
      "Como Curadora Noética Espiritual, acedo a níveis dimensionais mais elevados em comunicação direta com consciências superiores.",
      "Cada processo que conduzo é único, guiado com presença, respeito e precisão intuitiva.",
      "Em colaboração com as minhas equipas espirituais, ofereço cursos que aprofundam a perceção sensorial sutil e promovem a elevação da percepção em múltiplos níveis: experiências guiadas que unem ensinamentos canalizados, práticas vibracionais e expansão do Ser.",
    ],
    quote: "Não prometo milagres. Ofereço qualidade de vida.",
    servicesEyebrow: "Dani Therapies",
    servicesTitle: "Cuidado personalizado em múltiplos níveis do Ser",
    servicesBody: [
      "Oferecemos Serviços online de Tratamentos terapêuticos, Energéticos e Espirituais personalizados, que atuam em múltiplos níveis do Ser.",
      "Com o apoio de equipas espirituais, atuamos diretamente nos corpos físico, emocional, mental, espiritual e multidimensional, proporcionando alívio de traumas, bloqueios e Stresse, e auxiliando em questões de saúde de natureza diversa e específica.",
      "Para além do trabalho espiritual profundo, a nossa abordagem envolve técnicas energéticas refinadas que promovem a restauração integral das energias vitais. Estas práticas contribuem igualmente para o alívio de questões de saúde, facilitando a recuperação, reduzindo sintomas e restaurando a vitalidade do corpo e da mente, promovendo, assim, uma melhor qualidade de vida.",
      "Realizamos energização, desprogramação de padrões ocultos no consciente e no subconsciente, limpezas kármicas, alinhamento de chakras, juntamente com os corpos sutis, remoção de bloqueios, banimentos e libertações, entre outros.",
      "Cada sessão é personalizada de acordo com as suas necessidades, promovendo mudanças positivas em diversos aspetos da vida.",
      "Oferecemos ainda tratamentos personalizados e eficazes para os seus animais de estimação, com um valor reduzido.",
    ],
    sessionsAction: "Conhecer todas as sessões",
  },
  en: {
    back: "Back to the home page",
    eyebrow: "About",
    title: "Hi! I am Dani",
    intro: [
      "I work as a Spiritual Noetic Healer and an Educator in the Awakening of Consciousness, offering therapeutic, spiritual and energetic care.",
      "My mission is to guide people back to their essence, restore vital energy, align the subtle bodies and reconnect each Being with their deepest truth.",
      "I channel high-frequency spiritual teams: consciousnesses that accompany my work with healing and reconnection to the essence.",
      "Through sensitive listening, spiritual readings, intuitive channeling and restorative practices, I act as a bridge between planes: the visible and the invisible, the mental and the spiritual, the human and the divine.",
      "As a Spiritual Noetic Healer, I access higher dimensional levels in direct communication with higher consciousnesses.",
      "Every process I guide is unique, held with presence, respect and intuitive precision.",
      "Together with my spiritual teams, I offer courses that deepen subtle sensory perception and expand awareness on multiple levels through channeled teachings, vibrational practices and development of the Being.",
    ],
    quote: "I do not promise miracles. I offer quality of life.",
    servicesEyebrow: "Dani Therapies",
    servicesTitle: "Personalised care across multiple levels of the Being",
    servicesBody: [
      "We offer personalised online therapeutic, energetic and spiritual treatments that work across multiple levels of the Being.",
      "With the support of spiritual teams, we work directly with the physical, emotional, mental, spiritual and multidimensional bodies, helping to relieve trauma, blockages and stress, as well as supporting different and specific health concerns.",
      "Alongside deep spiritual work, our approach uses refined energetic techniques that promote the integral restoration of vital energies, supporting recovery, reducing symptoms and restoring vitality to body and mind.",
      "Our work includes energisation, deprogramming hidden conscious and subconscious patterns, karmic cleansing, chakra and subtle-body alignment, removal of blockages, banishments and releases, among other practices.",
      "Every session is personalised to your needs, encouraging positive changes in different areas of life.",
      "We also offer personalised and effective treatments for pets at a reduced price.",
    ],
    sessionsAction: "Explore all sessions",
  },
  es: {
    back: "Volver a la página principal",
    eyebrow: "Quiénes somos",
    title: "¡Hola! Soy Dani",
    intro: [
      "Soy Sanadora Noética Espiritual y Educadora del Despertar de la Conciencia, y trabajo en los ámbitos terapéutico, espiritual y energético.",
      "Mi misión es guiar a las personas de regreso a su esencia, restaurando su energía vital, alineando los cuerpos sutiles y reconectando cada Ser con su verdad más profunda.",
      "Canalizo equipos espirituales de alta frecuencia, conciencias que me acompañan en un trabajo de sanación y reconexión con la esencia.",
      "A través de la escucha sensible, las lecturas espirituales, las canalizaciones intuitivas y las prácticas restauradoras, actúo como puente entre planos: lo visible y lo invisible, lo mental y lo espiritual, lo humano y lo divino.",
      "Como Sanadora Noética Espiritual, accedo a niveles dimensionales más elevados en comunicación directa con conciencias superiores.",
      "Cada proceso que conduzco es único y está guiado con presencia, respeto y precisión intuitiva.",
      "En colaboración con mis equipos espirituales, ofrezco cursos que profundizan la percepción sensorial sutil y elevan la conciencia en múltiples niveles mediante enseñanzas canalizadas, prácticas vibracionales y expansión del Ser.",
    ],
    quote: "No prometo milagros. Ofrezco calidad de vida.",
    servicesEyebrow: "Dani Therapies",
    servicesTitle: "Cuidado personalizado en múltiples niveles del Ser",
    servicesBody: [
      "Ofrecemos tratamientos terapéuticos, energéticos y espirituales personalizados y online que actúan en múltiples niveles del Ser.",
      "Con el apoyo de equipos espirituales, trabajamos directamente en los cuerpos físico, emocional, mental, espiritual y multidimensional, ayudando a aliviar traumas, bloqueos y estrés, además de apoyar cuestiones de salud diversas y específicas.",
      "Además del profundo trabajo espiritual, nuestro enfoque incorpora técnicas energéticas refinadas que promueven la restauración integral de las energías vitales y contribuyen a recuperar la vitalidad del cuerpo y de la mente.",
      "Realizamos energización, desprogramación de patrones ocultos del consciente y del subconsciente, limpiezas kármicas, alineación de chakras y cuerpos sutiles, eliminación de bloqueos, destierros y liberaciones, entre otras prácticas.",
      "Cada sesión se personaliza según tus necesidades, promoviendo cambios positivos en distintos aspectos de la vida.",
      "También ofrecemos tratamientos personalizados y eficaces para animales de compañía a un precio reducido.",
    ],
    sessionsAction: "Conocer todas las sesiones",
  },
  nl: {
    back: "Terug naar de homepagina",
    eyebrow: "Over ons",
    title: "Hallo! Ik ben Dani",
    intro: [
      "Ik werk als Spiritueel Noëtisch Healer en begeleider in het Ontwaken van Bewustzijn, met therapeutische, spirituele en energetische begeleiding.",
      "Mijn missie is mensen terug te begeleiden naar hun essentie, hun levensenergie te herstellen, de subtiele lichamen uit te lijnen en ieder Wezen opnieuw te verbinden met zijn diepste waarheid.",
      "Ik channel spirituele teams met een hoge frequentie: bewustzijnen die mijn werk rond heling en herverbinding met de essentie begeleiden.",
      "Via aandachtig luisteren, spirituele readings, intuïtieve channeling en herstellende praktijken vorm ik een brug tussen werelden: zichtbaar en onzichtbaar, mentaal en spiritueel, menselijk en goddelijk.",
      "Als Spiritueel Noëtisch Healer bereik ik hogere dimensionale niveaus in directe communicatie met hogere bewustzijnen.",
      "Elk proces dat ik begeleid is uniek en wordt gedragen door aanwezigheid, respect en intuïtieve precisie.",
      "Samen met mijn spirituele teams bied ik cursussen aan die de subtiele zintuiglijke waarneming verdiepen en het bewustzijn op meerdere niveaus verruimen via gechannelde lessen, vibrationele oefeningen en ontwikkeling van het Zijn.",
    ],
    quote: "Ik beloof geen wonderen. Ik bied kwaliteit van leven.",
    servicesEyebrow: "Dani Therapies",
    servicesTitle: "Persoonlijke zorg op meerdere niveaus van het Zijn",
    servicesBody: [
      "Wij bieden persoonlijke online therapeutische, energetische en spirituele behandelingen die op meerdere niveaus van het Zijn werken.",
      "Met de ondersteuning van spirituele teams werken we rechtstreeks met het fysieke, emotionele, mentale, spirituele en multidimensionale lichaam. Dit helpt bij trauma, blokkades en stress en ondersteunt uiteenlopende specifieke gezondheidsvragen.",
      "Naast diep spiritueel werk omvat onze aanpak verfijnde energetische technieken voor het integrale herstel van levensenergie, ondersteuning van herstel en hernieuwde vitaliteit van lichaam en geest.",
      "We werken onder meer met energetisering, het losmaken van verborgen bewuste en onbewuste patronen, karmische reiniging, uitlijning van chakra's en subtiele lichamen, het verwijderen van blokkades en energetische bevrijding.",
      "Elke sessie wordt afgestemd op jouw behoeften en ondersteunt positieve veranderingen in verschillende levensgebieden.",
      "We bieden ook persoonlijke en doeltreffende behandelingen voor huisdieren tegen een gereduceerd tarief.",
    ],
    sessionsAction: "Bekijk alle sessies",
  },
};

export const detailPageCopy = {
  pt: {
    backCourse: "Voltar aos cursos",
    backSession: "Voltar às sessões",
    courseEyebrow: "Curso online",
    sessionEyebrow: "Sessão terapêutica",
    aboutTitle: "Sobre este trabalho",
    practicalTitle: "Informações práticas",
    duration: "Duração",
    serviceInvestment: "Valor",
    courseInvestment: "Investimento",
    detailsAction: "Ver detalhes",
  },
  en: {
    backCourse: "Back to courses",
    backSession: "Back to sessions",
    courseEyebrow: "Online course",
    sessionEyebrow: "Therapeutic session",
    aboutTitle: "About this work",
    practicalTitle: "Practical information",
    duration: "Duration",
    serviceInvestment: "Value",
    courseInvestment: "Investment",
    detailsAction: "View details",
  },
  es: {
    backCourse: "Volver a los cursos",
    backSession: "Volver a las sesiones",
    courseEyebrow: "Curso online",
    sessionEyebrow: "Sesión terapéutica",
    aboutTitle: "Sobre este trabajo",
    practicalTitle: "Información práctica",
    duration: "Duración",
    serviceInvestment: "Valor",
    courseInvestment: "Inversión",
    detailsAction: "Ver detalles",
  },
  nl: {
    backCourse: "Terug naar cursussen",
    backSession: "Terug naar sessies",
    courseEyebrow: "Online cursus",
    sessionEyebrow: "Therapeutische sessie",
    aboutTitle: "Over dit traject",
    practicalTitle: "Praktische informatie",
    duration: "Duur",
    serviceInvestment: "Prijs",
    courseInvestment: "Investering",
    detailsAction: "Bekijk details",
  },
} satisfies Record<Locale, Record<string, string>>;

const courseDetails: Record<Locale, string[]> = {
  pt: [
    "Na leitura sensorial existem várias maneiras de fazê-la.",
    "Uma delas é ativar o corpo sensorial por meio de exercícios de percepção. Quando ativamos as células do corpo, a sensibilidade natural desperta novamente. É assim que você começa a sentir as energias ao seu redor. Dessa forma você entende o que está acontecendo, mesmo sem usar a visão física. O próprio corpo passa a “ler” a energia. Você pode ver além dos olhos, mesmo de olhos fechados.",
    "Outra forma é a leitura sensorial eletromagnética. Acontece através de ondas enviadas por pessoas ou seres à distância, ou que se encontrem noutras dimensões. Os animais também emitem ondas de energia. Quando aprendemos a identificar a assinatura energética de um Ser, torna-se quase impossível confundirmo-nos com a sua identidade. Cada ser no universo possui uma energia única, que se consegue mover entre dimensões, das mais densas às mais subtis. É através dessa capacidade que se estabelece a comunicação entre humanos com baixa frequência vibracional e seres de dimensões mais elevadas.",
    "Durante os nossos encontros em grupo, vamos treinar a nossa percepção para, com o tempo, desenvolvermos a capacidade de entrar em contacto com seres de vibração mais elevada. O nosso curso não promete milagres. Aqui ensinamos um caminho natural e progressivo para alcançar esse nível de percepção com segurança, o que exige disciplina e dedicação. Cada pessoa tem o seu próprio ritmo de desenvolvimento.",
    "Faremos exercícios de movimentos guiados de energia e de percepção do campo sensório, desenvolvendo autonomia e resgatando a sensibilidade natural que nos pertence por essência.",
    "Vamos aprender também a respirar em sintonia com a essência do teu Ser, pois a respiração é uma das chaves para o despertar sensorial.",
    "Este curso contará com a orientação sutil de Anele, que faz parte da equipa espiritual que acompanha o meu trabalho e estará à frente da condução do movimento guiado de energia. A sua presença amorosa e sábia será um dos pilares invisíveis desta aprendizagem. Eu atuo como canalizadora deste conhecimento, organizando o conteúdo para que a aprendizagem aconteça de forma gradual, segura e consciente.",
  ],
  en: [
    "There are several ways to experience sensory reading.",
    "One of them is through the activation of the Sensory Body using perception exercises. As the cells of the body are activated, natural sensitivity begins to awaken again. This is how you start to feel the energies around you and understand what is taking place without relying only on physical sight. The body itself begins to read energy, allowing you to perceive beyond the eyes, even with your eyes closed.",
    "Another form is electromagnetic sensory reading. It happens through waves sent by people or Beings at a distance, or by Beings present in other dimensions. Animals also emit energetic waves. When we learn to identify the energetic signature of a Being, it becomes very difficult to confuse its identity. Every Being in the universe carries a unique energy, able to move between denser and more subtle dimensions. Through this ability, communication can take place between human beings in lower vibrational frequencies and Beings from higher dimensions.",
    "During our group sessions, we will train perception gradually, so that over time the ability to connect with higher-vibration Beings can develop safely. This course does not promise miracles. It teaches a natural, progressive path that requires discipline, dedication and respect for each person's own pace.",
    "We will practise Guided Energetic Movement and sensory-field perception exercises, developing autonomy and restoring the natural sensitivity that belongs to us by essence.",
    "We will also learn to breathe in tune with the essence of your Being, because breath is one of the keys to sensory awakening.",
    "This course will be guided by the subtle presence of Anele, who is part of the spiritual team that accompanies my work and will lead the Guided Energetic Movement. Her loving and wise presence will be one of the invisible pillars of this learning journey. I act as the channel for this knowledge, organising the content so the learning process can unfold gradually, safely and consciously.",
  ],
  es: [
    "Existen diferentes formas de realizar la comunicación y la lectura sensorial.",
    "Una de ellas es la activación del cuerpo sensorial mediante ejercicios de percepción. Al activar las células del cuerpo, despierta de nuevo la sensibilidad natural del ser humano, permitiéndole sentir las energías de su entorno. Así es posible percibir y comprender lo que sucede sin utilizar la visión física. El propio cuerpo empieza a leer las energías y a ver más allá de los ojos, incluso cuando están cerrados.",
    "Otra forma es la lectura sensorial electromagnética, que se produce a través de ondas enviadas por personas o seres a distancia o presentes en otras dimensiones. Los animales también emiten ondas de energía. Cuando aprendemos a identificar la firma energética de un ser, resulta casi imposible confundir su identidad. Cada ser del universo posee una energía única capaz de desplazarse entre dimensiones más densas y más sutiles.",
    "Durante los encuentros grupales entrenaremos nuestras percepciones para desarrollar, con el tiempo y de forma segura, la capacidad de entrar en contacto con seres de vibración más elevada. El curso no promete milagros: enseña un camino natural y progresivo que requiere disciplina, dedicación y respeto por el ritmo de cada persona.",
    "Realizaremos ejercicios de movimientos guiados de energía y de percepción del campo sensorial, desarrollando autonomía y recuperando la sensibilidad natural que nos pertenece por esencia.",
    "También aprenderemos a respirar en sintonía con la esencia de tu Ser, porque la respiración es una de las claves del despertar sensorial.",
    "Anele estará al frente de la conducción del movimiento. El curso contará con la orientación sutil de Anele, integrante del equipo espiritual que acompaña mi trabajo. Su presencia amorosa y sabia será uno de los pilares invisibles al frente del movimiento guiado de energía. Yo actúo como canal de transmisión y organización del contenido para que el aprendizaje suceda de forma gradual, segura y consciente.",
  ],
  nl: [
    "Er zijn verschillende manieren om zintuiglijke waarneming te ervaren.",
    "Een daarvan is het activeren van het zintuiglijke lichaam via waarnemingsoefeningen. Wanneer de cellen van het lichaam worden geactiveerd, begint de natuurlijke gevoeligheid opnieuw te ontwaken. Zo leer je de energieën om je heen voelen en begrijpen wat er gebeurt, zonder alleen op het fysieke zicht te vertrouwen. Het lichaam zelf begint energie te lezen, waardoor je voorbij de ogen kunt waarnemen, zelfs met gesloten ogen.",
    "Een andere vorm is elektromagnetische zintuiglijke waarneming. Deze ontstaat via golven die worden uitgezonden door mensen of Wezens op afstand, of door Wezens die zich in andere dimensies bevinden. Ook dieren zenden energetische golven uit. Wanneer we de energetische signatuur van een Wezen leren herkennen, wordt het vrijwel onmogelijk om zijn identiteit te verwarren. Elk Wezen in het universum draagt een unieke energie, die kan bewegen tussen dichtere en subtielere dimensies.",
    "Tijdens de groepsbijeenkomsten trainen we onze waarneming stap voor stap, zodat het contact met Wezens van een hogere trilling zich op een veilige manier kan ontwikkelen. Deze cursus belooft geen wonderen. Hij leert een natuurlijke en geleidelijke weg die discipline, toewijding en respect voor ieders eigen tempo vraagt.",
    "We doen oefeningen met Begeleide Energiebeweging en waarneming van het zintuiglijke veld, ontwikkelen autonomie en herontdekken de natuurlijke gevoeligheid die wezenlijk bij ons hoort.",
    "We leren ook ademen in afstemming met de essentie van je Zijn, omdat ademhaling een van de sleutels tot zintuiglijk ontwaken is.",
    "Deze cursus wordt subtiel begeleid door Anele, lid van het spirituele team dat mijn werk ondersteunt en de Begeleide Energiebeweging draagt. Haar liefdevolle en wijze aanwezigheid is een van de onzichtbare pijlers van dit leerproces. Ik treed op als kanaal voor deze kennis en orden de inhoud, zodat het leren geleidelijk, veilig en bewust kan verlopen.",
  ],
};

const sessionDetailsPt: Record<string, string[]> = {
  "first-consultation": [
    "O primeiro passo para um atendimento personalizado e eficaz.",
    "A primeira consulta é essencial para entender as suas necessidades e oferecer um atendimento personalizado. Durante essa consulta, são recolhidas todas as informações necessárias para avaliar a sua situação e estabelecer um plano personalizado.",
    "Dependendo do caso e da avaliação realizada durante o atendimento, já poderão ser iniciadas as primeiras intervenções necessárias.",
    "A consulta tem duração de 1 hora e é realizada online através do Zoom.",
    "O link será enviado no horário marcado. A pontualidade é essencial: caso o cliente chegue atrasado, o tempo da consulta será reduzido.",
    "Em caso de dúvidas, entre em contacto via WhatsApp após o pagamento.",
  ],
  "energy-cleansing-initial": [
    "A primeira consulta é essencial para entender as suas necessidades e oferecer um atendimento personalizado. Durante essa consulta, são recolhidas as informações necessárias para avaliar a sua situação e estabelecer um plano personalizado.",
    "Dependendo do caso e da avaliação realizada durante o atendimento, já poderão ser iniciadas as primeiras intervenções necessárias.",
    "A Limpeza Energética e Espiritual realiza a remoção de energias negativas, impurezas e bloqueios que afetam o seu equilíbrio vibracional. Com o equilíbrio dos chakras, a estabilização da aura e dos corpos sutis, a sua vibração será elevada, permitindo uma conexão mais profunda com níveis de consciência e expansão espiritual.",
    "Também será realizada uma medição energética de várias áreas da sua vida e diversas medições vibracionais para identificar a sua posição energética e espiritual atual, bloqueios pessoais, desajustes, padrões negativos ou kármicos e desequilíbrios nos campos emocional, físico e espiritual.",
    "O objetivo dessa análise completa é conscientizar o cliente sobre os seus obstáculos e proporcionar opções sobre qual caminho terapêutico seguir.",
    "A consulta tem duração de 1 hora e é realizada online através do Zoom. O WhatsApp será o principal meio de comunicação para esclarecer dúvidas e acompanhar o serviço.",
  ],
  "energy-cleansing": [
    "Este tratamento é recomendado para quem já realizou a primeira consulta. Caso ainda não a tenha feito, agende a consulta inicial ou escolha a opção que inclui Limpeza Energética e Espiritual com Primeira Consulta.",
    "A Limpeza Energética e Espiritual realiza a remoção de energias negativas, impurezas e bloqueios que afetam o seu equilíbrio vibracional. Com o equilíbrio dos chakras, a estabilização da aura e dos corpos sutis, a sua vibração será elevada, permitindo uma conexão mais profunda com níveis de consciência e expansão espiritual.",
    "Também será realizada uma medição energética de várias áreas da sua vida e diversas medições vibracionais para identificar a sua posição energética e espiritual atual, bloqueios pessoais, desajustes, padrões negativos ou kármicos e desequilíbrios nos campos emocional, físico e espiritual.",
    "Para iniciar o processo, preencha o formulário com os seus dados pessoais e as informações necessárias para o serviço.",
    "O WhatsApp será o principal meio de comunicação para esclarecer dúvidas e acompanhar o andamento do serviço.",
  ],
  "environment-harmonization": [
    "A Restauração Energética e Espiritual de Ambientes promove uma limpeza profunda e harmonização completa do espaço, atuando na reorganização das frequências e na elevação da vibração do local.",
    "Ao longo do processo, energias densas acumuladas no ambiente, como tristeza, raiva, stress e outras cargas emocionais, são suavizadas e transformadas, permitindo que o espaço retorne ao seu estado natural de equilíbrio e leveza.",
    "Em parceria com a minha equipa espiritual, também realizamos a identificação e o encaminhamento de possíveis presenças sutis e influências energéticas em desequilíbrio, restabelecendo a ordem vibracional e promovendo proteção, clareza e bem-estar.",
    "Para realizar o serviço, é necessário informar o endereço completo do local. Após o pagamento, entre em contacto pelo WhatsApp para fornecer informações adicionais e receber as datas de início e término.",
  ],
  "environment-harmonization-3-homes": [
    "Este serviço é oferecido num pacote de três sessões, que pode ser aplicado em três locais diferentes ou no mesmo local. Cada sessão será realizada para garantir que os ambientes estejam harmonizados e protegidos.",
    "A Restauração Energética e Espiritual de Ambientes promove uma limpeza profunda, reorganiza as frequências e eleva a vibração do local. Energias densas acumuladas no espaço são suavizadas e transformadas.",
    "Em parceria com a minha equipa espiritual, identificamos e encaminhamos possíveis presenças sutis e influências energéticas em desequilíbrio, restabelecendo a ordem vibracional e promovendo proteção, clareza e bem-estar.",
    "É necessário informar o endereço completo de cada local. Após o pagamento, entre em contacto pelo WhatsApp para fornecer informações adicionais e receber as datas do serviço.",
  ],
  "tarot-field-reading": [
    "A consulta é realizada por chamada via WhatsApp e tem duração de 1 hora, proporcionando um atendimento personalizado e acessível, independentemente da sua localização.",
    "A leitura de Tarô traz orientações sobre o caminho a seguir, enquanto a leitura de campo vai além do Tarô, com uma análise vibracional da situação apresentada.",
    "Juntas, as duas leituras mostram não apenas o que está a acontecer, mas também o que poderá vir a acontecer, oferecendo clareza e orientação sobre os próximos passos.",
    "O trabalho não é um Tarô divinatório: é focado em questões específicas. Por isso, é importante chegar com as perguntas bem definidas.",
    "Para analisar uma empresa, local, imóvel, oportunidade de trabalho ou outra situação específica, envie antecipadamente pelo WhatsApp o maior número possível de informações relevantes.",
    "A pontualidade é essencial. Em caso de atraso, o tempo da consulta será reduzido.",
  ],
  "tarot-field-reading-2h": [
    "A leitura de 2 horas permite uma análise mais profunda e a exploração de diversas situações com maior nível de detalhe.",
    "A consulta é realizada por chamada via WhatsApp, proporcionando um atendimento personalizado e acessível, independentemente da sua localização.",
    "A leitura de Tarô e a leitura de campo mostram o que está a acontecer, o que poderá vir a acontecer e quais situações podem estar a influenciar o momento atual.",
    "O trabalho é focado em questões específicas, não num Tarô meramente divinatório. Chegue com perguntas bem definidas para que cada ponto possa ser analisado vibracionalmente.",
    "Para analisar empresas, locais, imóveis, oportunidades ou outras situações, envie antecipadamente pelo WhatsApp os dados relevantes para uma sintonização mais precisa.",
  ],
  "chakra-unblocking": [
    "Este tratamento é realizado de forma espiritual e energética ao longo de alguns dias, ajustando e reequilibrando gradualmente a energia e desbloqueando pontos estagnados.",
    "Cada pessoa é única e necessita de ajustes personalizados para alcançar o equilíbrio adequado dos chakras, da aura e dos corpos energéticos.",
    "Ao remover marcas acumuladas ao longo da jornada de vida, trabalhamos para devolver a energia ao seu estado puro, promovendo leveza, harmonia e reconexão com a sua essência.",
    "Para iniciar, preencha o formulário com os seus dados e informações necessárias. Após o pagamento, entre em contacto pelo WhatsApp para receber as datas de início e término do serviço.",
  ],
  "depression-support": [
    "Este tratamento é realizado de forma espiritual e energética, combinando técnicas que atuam nos campos espiritual e energético para desvincular progressivamente situações e influências negativas associadas ao estado de depressão e restaurar o equilíbrio interno.",
    "O trabalho é intensivo durante 30 dias: um período inicial de 15 dias dedicado à parte espiritual, seguido de mais 15 dias voltados à parte energética.",
    "Durante a primeira consulta, recolhemos as informações necessárias, avaliamos a origem do quadro e definimos um plano personalizado.",
    "Dependendo do caso e da avaliação realizada durante o atendimento, já poderão ser iniciadas as primeiras intervenções necessárias.",
    "A consulta tem duração de 1 hora e é realizada online através do Zoom. Este cuidado complementar não substitui acompanhamento médico ou psicológico.",
  ],
  "depression-support-3-months": [
    "Para adquirir este tratamento intensivo de três meses, é imprescindível realizar previamente a primeira consulta.",
    "O tratamento atua de forma espiritual e energética, buscando desvincular progressivamente situações e influências negativas associadas à depressão e restaurar o equilíbrio interno.",
    "O trabalho segue uma dinâmica cíclica e contínua durante três meses. Em cada mês, são realizados 15 dias de trabalho espiritual e 15 dias de trabalho energético.",
    "Este cuidado complementar não substitui acompanhamento médico ou psicológico. Em caso de dúvidas, entre em contacto pelo WhatsApp.",
  ],
  "migraine-support": [
    "Este tratamento é realizado de forma espiritual e energética, combinando técnicas que atuam nesses campos para dissolver bloqueios e influências negativas associadas à enxaqueca crónica e restaurar o equilíbrio interno.",
    "O trabalho é intensivo durante 30 dias: um período inicial de 15 dias dedicado à parte espiritual, seguido de mais 15 dias voltados à parte energética.",
    "Durante a primeira consulta, recolhemos as informações necessárias e definimos um plano personalizado.",
    "Dependendo do caso e da avaliação realizada durante o atendimento, já poderão ser iniciadas as primeiras intervenções necessárias.",
    "A consulta tem duração de 1 hora e é realizada online através do Zoom. Este cuidado complementar não substitui avaliação ou tratamento médico.",
  ],
  "migraine-support-3-months": [
    "O tratamento intensivo de três meses atua de forma espiritual e energética para dissolver bloqueios e influências associadas à enxaqueca crónica e restaurar o equilíbrio interno.",
    "O trabalho segue uma dinâmica cíclica e contínua. Em cada mês, são realizados 15 dias de trabalho espiritual e 15 dias de trabalho energético.",
    "O objetivo é oferecer apoio energético prolongado para quem procura mais estabilidade e alívio. Este cuidado complementar não substitui avaliação ou tratamento médico.",
    "Em caso de dúvidas, entre em contacto pelo WhatsApp após o pagamento.",
  ],
  "terminal-transition-support": [
    "Esta sessão é realizada com a assistência da minha equipa espiritual e é focada em aliviar a angústia, o pânico e o medo de quem se encontra em fase terminal, proporcionando serenidade e paz para que o espírito siga sem desorientação.",
    "A sessão também pode ser aplicada após o desencarne, devolvendo clareza e lucidez a espíritos que se encontram perdidos, estagnados ou adormecidos e auxiliando-os a seguir o seu caminho sem amarras ou desespero.",
    "A consulta tem duração de 1 hora e é realizada online através do Zoom. Durante a consulta, todo o processo será explicado e haverá espaço para esclarecer dúvidas.",
    "Para animais de estimação em fase terminal ou já desencarnados, o valor da sessão corresponde a 50% do preço indicado.",
  ],
  "guided-healing-movement": [
    "Este trabalho é realizado por meio de movimentos vibracionais de energia transmitidos através de mim pela equipa responsável por essa atuação. Eu atuo como canal, permitindo que os movimentos aconteçam de forma fluida e segura.",
    "O objetivo é auxiliar na libertação de cargas emocionais, padrões repetitivos e vínculos energéticos que podem influenciar pensamentos, sentimentos e comportamentos, promovendo maior fortalecimento pessoal.",
    "A atuação é direcionada a questões emocionais e energéticas enraizadas no consciente e no subconsciente. O movimento busca dissolver bloqueios, aliviar conflitos internos e desvincular influências associadas a padrões obsessivos, traumas e situações de sofrimento emocional.",
    "O propósito não é interferir no livre-arbítrio nem modificar o comportamento de outras pessoas, mas favorecer uma nova perceção das experiências e promover paz, clareza e liberdade emocional.",
    "O Movimento de Cura Guiada tem duração de 1 hora e é realizado online através do Zoom. É necessário estar num ambiente privado, sozinho e sem a presença de outras pessoas.",
    "Para a sessão, utilize fones de ouvido, tenha água disponível num copo de vidro e, se possível, uma Selenita branca e uma Turmalina negra.",
  ],
  "mental-relief": [
    "Esta sessão foi desenvolvida para situações pontuais de instabilidade psicoemocional. Quando acontecimentos inesperados geram confusão, perda de foco, desconexão ou desorientação leve, a intervenção atua como recurso de reequilíbrio.",
    "A abordagem busca restaurar serenidade e clareza mental, aliviar a tensão e ajudar a pessoa a retomar a harmonia interior e o equilíbrio no dia a dia.",
    "É um suporte para quem se sente temporariamente afastado da sua paz habitual e necessita de um realinhamento emocional ágil.",
    "A sessão tem duração de 1 hora e é realizada online através do Zoom. Utilize fones de ouvido, tenha água num copo de vidro e, se possível, uma Selenita branca e uma Turmalina negra.",
    "A pontualidade é essencial. Em caso de atraso, o tempo da sessão será reduzido.",
  ],
  "trauma-intensive": [
    "Para adquirir este serviço, é imprescindível realizar previamente a primeira consulta. Assim, podemos avaliar se a sessão é realmente indicada e garantir um atendimento adequado e seguro.",
    "A sessão é realizada com o apoio das minhas equipas espirituais, que orientam e auxiliam todo o processo.",
    "Podemos trabalhar situações desta vida, de vidas passadas e paralelas que estejam a afetar a vida atual, realizando desprogramação de padrões ocultos no consciente e no subconsciente, inclusive por meio dos Registos Akáshicos, além de desbloqueios, banimentos, encaminhamentos e libertações.",
    "A sessão tem duração de 2 horas e é realizada online através do Zoom.",
    "Utilize fones de ouvido, tenha água num copo de vidro e, se possível, uma Selenita branca e uma Turmalina negra. A pontualidade é essencial.",
  ],
  "trauma-intensive-3": [
    "Pacote especial com 3 sessões intensivas de 2 horas, realizadas uma vez por semana, com valor reduzido.",
    "É imprescindível realizar previamente a primeira consulta para avaliar se este trabalho é indicado e garantir um atendimento adequado e seguro.",
    "As sessões são realizadas com o apoio das minhas equipas espirituais. Podemos trabalhar situações desta vida, de vidas passadas e paralelas, desprogramar padrões ocultos e realizar desbloqueios, banimentos, encaminhamentos e libertações.",
    "Cada sessão tem duração de 2 horas e é realizada online através do Zoom.",
    "Utilize fones de ouvido, tenha água num copo de vidro e, se possível, uma Selenita branca e uma Turmalina negra. A pontualidade é essencial.",
  ],
  "trauma-intensive-6": [
    "Pacote especial com 6 sessões intensivas de 2 horas, realizadas uma vez por semana, com valor reduzido.",
    "É imprescindível realizar previamente a primeira consulta para avaliar se este trabalho é indicado e garantir um atendimento adequado e seguro.",
    "As sessões são realizadas com o apoio das minhas equipas espirituais. Podemos trabalhar situações desta vida, de vidas passadas e paralelas, desprogramar padrões ocultos e realizar desbloqueios, banimentos, encaminhamentos e libertações.",
    "Cada sessão tem duração de 2 horas e é realizada online através do Zoom.",
    "Utilize fones de ouvido, tenha água num copo de vidro e, se possível, uma Selenita branca e uma Turmalina negra. A pontualidade é essencial.",
  ],
};

const sessionDetailsTranslations = translatedSessionDetails as Record<Exclude<Locale, "pt">, Record<string, string[]>>;

function getSessionDetailFallback(productId: string, locale: Locale) {
  return locale === "pt"
    ? sessionDetailsPt[productId]
    : sessionDetailsTranslations[locale]?.[productId];
}

const guidedHealingRecordingDetails: Record<Locale, string[]> = {
  pt: [
    "A gravação da sessão pode ser adquirida à parte e ficará disponível durante 3 meses.",
    "Por se tratar de um trabalho vibracional, reescutar a gravação ao longo desse período favorece a integração gradual das frequências e do movimento energético realizado durante a sessão.",
  ],
  en: [
    "The session recording can be purchased separately and will remain available for 3 months.",
    "Because this is vibrational work, listening to the recording again during this period supports the gradual integration of the frequencies and energetic movement carried out during the session.",
  ],
  es: [
    "La grabación de la sesión puede adquirirse por separado y estará disponible durante 3 meses.",
    "Al tratarse de un trabajo vibracional, volver a escuchar la grabación durante ese período favorece la integración gradual de las frecuencias y del movimiento energético realizado durante la sesión.",
  ],
  nl: [
    "De opname van de sessie kan afzonderlijk worden aangeschaft en blijft 3 maanden beschikbaar.",
    "Omdat dit vibrationeel werk is, ondersteunt het opnieuw beluisteren van de opname gedurende deze periode de geleidelijke integratie van de frequenties en de energetische beweging die tijdens de sessie is uitgevoerd.",
  ],
};

const earlyInterventionDetails: Record<Locale, string> = {
  pt: "Dependendo do caso e da avaliação realizada durante o atendimento, já poderão ser iniciadas as primeiras intervenções necessárias.",
  en: "Depending on the case and the assessment carried out during the appointment, the first necessary interventions may already be started.",
  es: "Dependiendo del caso y de la evaluación realizada durante la atención, ya podrán iniciarse las primeras intervenciones necesarias.",
  nl: "Afhankelijk van de situatie en de beoordeling tijdens de afspraak kunnen de eerste noodzakelijke interventies al worden gestart.",
};

const earlyInterventionServices = new Set([
  "first-consultation",
  "energy-cleansing-initial",
  "depression-support",
  "migraine-support",
]);

function splitDescription(description: string) {
  return description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function applyDetailIntro(paragraphs: string[], service: SiteService) {
  const intro = service.detailIntro?.trim();
  return intro ? [intro, ...paragraphs.slice(1)] : paragraphs;
}

export function getDetailParagraphs(service: SiteService, locale: Locale) {
  const cmsDescription = service.description.trim();
  if (service.productId.startsWith("online-course")) {
    return applyDetailIntro(courseDetails[locale], service);
  }
  const hasCompleteCmsDescription = cmsDescription.length >= 600 || cmsDescription.includes("\n\n");
  const translatedFallback = getSessionDetailFallback(service.productId, locale);

  if (service.productId === "guided-healing-movement") {
    const baseParagraphs = hasCompleteCmsDescription
      ? splitDescription(cmsDescription)
      : translatedFallback || splitDescription(cmsDescription || service.text);
    const recordingMarker = { pt: "gravação", en: "recording", es: "grabación", nl: "opname" }[locale];
    const paragraphs = baseParagraphs.some((paragraph) => paragraph.toLocaleLowerCase(locale).includes(recordingMarker))
      ? baseParagraphs
      : [...baseParagraphs, ...guidedHealingRecordingDetails[locale]];
    return applyDetailIntro(paragraphs, service);
  }

  const baseParagraphs = hasCompleteCmsDescription
    ? splitDescription(cmsDescription)
    : translatedFallback || splitDescription(cmsDescription || service.text);

  if (!earlyInterventionServices.has(service.productId)) return applyDetailIntro(baseParagraphs, service);
  if (translatedFallback?.length && baseParagraphs.length >= translatedFallback.length) {
    return applyDetailIntro(baseParagraphs, service);
  }

  const paragraphs = locale === "pt"
    ? baseParagraphs.map((paragraph) =>
        paragraph.replace(" Dependendo do caso, as primeiras intervenções já poderão ser iniciadas.", ""),
      )
    : baseParagraphs;
  const detail = earlyInterventionDetails[locale];

  const completedParagraphs = paragraphs.some((paragraph) => paragraph.toLocaleLowerCase(locale).includes(detail.toLocaleLowerCase(locale)))
    ? paragraphs
    : [...paragraphs, detail];
  return applyDetailIntro(completedParagraphs, service);
}

export function getFallbackDetailText(productId: string) {
  return sessionDetailsPt[productId]?.join("\n\n") || "";
}
