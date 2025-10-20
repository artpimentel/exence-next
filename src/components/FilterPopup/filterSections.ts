export interface FilterSection {
  id: string;
  title: string;
  filters: {
    category: string;
    label: string;
    options?: string[];
    type?: "checkbox" | "boolean" | "range";
  }[];
}

export const filterSections: FilterSection[] = [
  {
    id: "aparencia",
    title: "Aparência",
    filters: [
      {
        category: "Etnia",
        label: "Etnia",
        options: ["Branca", "Parda", "Morena", "Preta", "Indígena", "Oriental"],
        type: "checkbox",
      },
      {
        category: "Cabelo",
        label: "Cor do Cabelo",
        options: [
          "Loiro",
          "Preto",
          "Ruivo",
          "Castanho",
          "Colorido",
          "Grisalho",
          "Sem Cabelo",
        ],
        type: "checkbox",
      },
      {
        category: "Olhos",
        label: "Cor dos Olhos",
        options: ["Azuis", "Castanhos", "Verdes", "Pretos"],
        type: "checkbox",
      },
      {
        category: "Altura",
        label: "Altura (cm)",
        type: "range",
      },
      {
        category: "Manequim",
        label: "Manequim",
        type: "range",
      },
      {
        category: "Pes",
        label: "Pés",
        type: "range",
      },
      {
        category: "Tatuagens",
        label: "Tatuagens",
        type: "checkbox",
        options: ["Com Tatuagens", "Sem Tatuagens"],
      },
      {
        category: "Piercings",
        label: "Piercings",
        type: "checkbox",
        options: ["Com Piercings", "Sem Piercings"],
      },
      {
        category: "Silicone",
        label: "Silicone",
        type: "checkbox",
        options: ["Com Silicone", "Sem Silicone"],
      },
    ],
  },
  {
    id: "localidade",
    title: "Localidade",
    filters: [
      {
        category: "Localidade",
        label: "Opções de Atendimento",
        options: [
          "Possui Local",
          "Atende em Casa",
          "Atende em Hotéis",
          "Atende em Motéis",
          "Atende em Eventos",
        ],
        type: "checkbox",
      },
    ],
  },
  {
    id: "servicos",
    title: "Serviços",
    filters: [
      {
        category: "Servicos",
        label: "Serviços Oferecidos",
        options: [
          "Acompanhante",
          "Viagem",
          "Beijo",
          "Masturbação",
          "Sexo Oral",
          "Sexo Anal",
          "Sexo Vaginal",
          "Penetração Dupla",
          "Penetração Tripla",
          "Squirt",
        ],
        type: "checkbox",
      },
    ],
  },
  {
    id: "fetiches",
    title: "Fetiches",
    filters: [
      {
        category: "Fetiches",
        label: "Fetiches Praticados",
        options: [
          "Striptease",
          "Acessórios",
          "Fantasia",
          "Podolatria",
          "Quirofilia",
          "Facefuck",
          "Voyeur",
          "Bondage",
          "Dominação",
          "Sadomasoquismo",
          "Trampling",
          "Fisting",
          "Chuva Dourada",
          "Chuva Marrom",
        ],
        type: "checkbox",
      },
    ],
  },
  {
    id: "pagamento",
    title: "Pagamento",
    filters: [
      {
        category: "Values",
        label: "Valores",
        type: "range",
      },
      {
        category: "Pagamento",
        label: "Métodos de Pagamento Aceitos",
        options: ["Dinheiro", "PIX", "Cartão de Crédito", "Cartão de Débito"],
        type: "checkbox",
      },
    ],
  },
];
