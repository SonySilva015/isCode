// src/data/courseData.js
export const courseData = [
    {
        id: 1,
        title: "Lógica de Programação",
        description: "Fundamentos essenciais para começar na programação",
        icon: "brain",
        color: "#FF6B6B",
        progress: 100,
        totalLessons: 5,
        completedLessons: 4,
        lessons: [
            {
                id: 1,
                title: "O que é Algoritmo?",
                duration: "15 min",
                difficulty: "Iniciante",
                type: "video",
                completed: true,
                content: {
                    videoUrl: "https://example.com/video1",
                    description: "Entenda o conceito fundamental de algoritmos e como eles são usados na programação.",
                    objectives: [
                        "Definir o que é um algoritmo",
                        "Identificar algoritmos no dia a dia",
                        "Compreender a importância dos algoritmos"
                    ],
                    codeExample: `// Exemplo de algoritmo simples
function fazerCafe() {
  ferverAgua();
  colocarPoCafe();
  coar();
  servir();
}`,
                    quiz: [
                        {
                            question: "O que é um algoritmo?",
                            options: [
                                "Uma linguagem de programação",
                                "Uma sequência de passos para resolver um problema",
                                "Um tipo de variável",
                                "Um framework JavaScript"
                            ],
                            correctAnswer: 1
                        },
                        {
                            question: "O que é um algoritmo?",
                            options: [
                                "Uma linguagem de programação",
                                "Uma sequência de passos para resolver um problema",
                                "Um tipo de variável",
                                "Um framework JavaScript"
                            ],
                            correctAnswer: 1
                        },
                        {
                            question: "O que é um algoritmo?",
                            options: [
                                "Uma linguagem de programação",
                                "Uma sequência de passos para resolver um problema",
                                "Um tipo de variável",
                                "Um framework JavaScript"
                            ],
                            correctAnswer: 1
                        }
                    ]
                }
            },
            {
                id: 2,
                title: "Variáveis e Tipos de Dados",
                duration: "20 min",
                difficulty: "Iniciante",
                type: "text",
                completed: true,
                content: {
                    description: "Aprenda sobre variáveis e os diferentes tipos de dados em programação.",
                    sections: [
                        {
                            title: "O que são Variáveis?",
                            content: "Variáveis são como caixas que armazenam informações no computador."
                        },
                        {
                            title: "Tipos de Dados",
                            content: "Texto (string), números (number), verdadeiro/falso (boolean), etc."
                        }
                    ],
                    examples: [
                        {
                            language: "javascript",
                            code: `let nome = "João"; // string
let idade = 25; // number
let estudante = true; // boolean`
                        }
                    ],
                    exercise: {
                        question: "Crie variáveis para armazenar seu nome, idade e se você é estudante.",
                        solution: `let nome = "Seu Nome";
let idade = 20;
let estudante = true;`
                    }
                }
            },
            {
                id: 3,
                title: "Estruturas Condicionais",
                duration: "25 min",
                difficulty: "Intermediário",
                type: "interactive",
                completed: true,
                content: {
                    description: "Controle o fluxo do seu programa com if, else e switch.",
                    interactiveExample: {
                        initialCode: `let hora = 14;
let saudacao;

// Complete o código abaixo
if (hora < 12) {
  saudacao = "Bom dia!";
} else if (hora < 18) {
  saudacao = "Boa tarde!";
} else {
  saudacao = "Boa noite!";
}

console.log(saudacao);`,
                        expectedOutput: "Boa tarde!"
                    },
                    realWorldExamples: [
                        "Verificar se um usuário está logado",
                        "Validar senhas",
                        "Decidir desconto em uma compra"
                    ]
                }
            },
            {
                id: 4,
                title: "Laços de Repetição",
                duration: "30 min",
                difficulty: "Intermediário",
                type: "video",
                completed: true,
                content: {
                    videoUrl: "https://example.com/video4",
                    description: "Aprenda a repetir tarefas automaticamente com loops.",
                    loopTypes: [
                        {
                            name: "for",
                            description: "Para quando sabemos quantas vezes repetir",
                            example: `for (let i = 0; i < 5; i++) {
  console.log("Número: " + i);
}`
                        },
                        {
                            name: "while",
                            description: "Para quando não sabemos quantas vezes repetir",
                            example: `let contador = 0;
while (contador < 5) {
  console.log("Contador: " + contador);
  contador++;
}`
                        }
                    ]
                }
            },
            {
                id: 5,
                title: "Funções e Reutilização",
                duration: "35 min",
                difficulty: "Intermediário",
                type: "project",
                completed: false,
                content: {
                    description: "Crie funções para organizar e reutilizar seu código.",
                    project: {
                        title: "Calculadora Simples",
                        requirements: [
                            "Função para somar dois números",
                            "Função para subtrair dois números",
                            "Função para multiplicar dois números",
                            "Função para dividir dois números"
                        ],
                        starterCode: `function somar(a, b) {
  // Implemente a soma
}

function subtrair(a, b) {
  // Implemente a subtração
}

// Teste suas funções
console.log(somar(5, 3)); // Deve mostrar 8
console.log(subtrair(10, 4)); // Deve mostrar 6`
                    }
                }
            }
        ]
    },
    {
        id: 2,
        title: "Python Básico",
        description: "Introdução à linguagem Python",
        icon: "python",
        color: "#4ECDC4",
        progress: 40,
        totalLessons: 5,
        completedLessons: 2,
        lessons: [
            {
                id: 6,
                title: "Instalação e Primeiro Programa",
                duration: "20 min",
                difficulty: "Iniciante",
                type: "text",
                completed: true,
                content: {
                    description: "Configure seu ambiente e escreva seu primeiro programa em Python.",
                    setupSteps: [
                        "Baixe e instale o Python",
                        "Configure seu editor de código",
                        "Crie seu primeiro arquivo .py"
                    ],
                    firstProgram: `print("Hello, World!")
nome = input("Qual é seu nome? ")
print("Prazer em conhecê-lo, " + nome + "!")`
                }
            },
            {
                id: 7,
                title: "Tipos de Dados em Python",
                duration: "25 min",
                difficulty: "Iniciante",
                type: "video",
                completed: true,
                content: {
                    videoUrl: "https://example.com/python-data-types",
                    description: "Conheça os tipos de dados básicos do Python.",
                    dataTypes: [
                        { type: "str", example: '"texto"', description: "Texto" },
                        { type: "int", example: "42", description: "Número inteiro" },
                        { type: "float", example: "3.14", description: "Número decimal" },
                        { type: "bool", example: "True", description: "Verdadeiro/Falso" },
                        { type: "list", example: "[1, 2, 3]", description: "Lista" }
                    ]
                }
            },
            {
                id: 8,
                title: "Estruturas de Controle",
                duration: "30 min",
                difficulty: "Intermediário",
                type: "interactive",
                completed: false,
                content: {
                    description: "Controle o fluxo do programa com if, elif e else.",
                    examples: [
                        {
                            title: "Verificação de Idade",
                            code: `idade = 18
if idade >= 18:
    print("Maior de idade")
else:
    print("Menor de idade")`
                        }
                    ]
                }
            },
            {
                id: 9,
                title: "Funções em Python",
                duration: "35 min",
                difficulty: "Intermediário",
                type: "text",
                completed: false,
                content: {
                    description: "Aprenda a criar e usar funções em Python.",
                    syntax: `def nome_da_funcao(parametros):
    # código da função
    return resultado`
                }
            },
            {
                id: 10,
                title: "Trabalhando com Listas",
                duration: "40 min",
                difficulty: "Intermediário",
                type: "project",
                completed: false,
                content: {
                    description: "Manipule listas e aprenda métodos úteis.",
                    exercises: [
                        "Criar uma lista de compras",
                        "Adicionar e remover itens",
                        "Ordenar lista"
                    ]
                }
            }
        ]
    },
    {
        id: 3,
        title: "Java Fundamentos",
        description: "Conceitos básicos da linguagem Java",
        icon: "coffee",
        color: "#45B7D1",
        progress: 20,
        totalLessons: 5,
        completedLessons: 1,
        lessons: [
            {
                id: 11,
                title: "Introdução ao Java",
                duration: "25 min",
                difficulty: "Iniciante",
                type: "text",
                completed: true,
                content: {
                    description: "Conheça a linguagem Java e sua sintaxe básica.",
                    features: [
                        "Orientada a objetos",
                        "Fortemente tipada",
                        "Multiplataforma (JVM)"
                    ]
                }
            },
            {
                id: 12,
                title: "Variáveis e Tipos",
                duration: "30 min",
                difficulty: "Iniciante",
                type: "video",
                completed: false,
                content: {
                    videoUrl: "https://example.com/java-variables",
                    description: "Tipos primitivos e declaração de variáveis em Java."
                }
            },
            {
                id: 13,
                title: "Estruturas de Controle",
                duration: "35 min",
                difficulty: "Intermediário",
                type: "interactive",
                completed: false,
                content: {
                    description: "If, else, switch e loops em Java."
                }
            },
            {
                id: 14,
                title: "Métodos em Java",
                duration: "40 min",
                difficulty: "Intermediário",
                type: "text",
                completed: false,
                content: {
                    description: "Crie e use métodos em Java."
                }
            },
            {
                id: 15,
                title: "Introdução a Classes",
                duration: "45 min",
                difficulty: "Intermediário",
                type: "project",
                completed: false,
                content: {
                    description: "Primeiros passos com Programação Orientada a Objetos."
                }
            }
        ]
    },
    {
        id: 4,
        title: "JavaScript Moderno",
        description: "Recursos modernos do JavaScript",
        icon: "js",
        color: "#F7DC6F",
        progress: 60,
        totalLessons: 5,
        completedLessons: 3,
        lessons: [
            {
                id: 16,
                title: "ES6+ Features",
                duration: "20 min",
                difficulty: "Intermediário",
                type: "text",
                completed: true,
                content: {
                    description: "Novos recursos do JavaScript moderno."
                }
            },
            {
                id: 17,
                title: "Arrow Functions",
                duration: "25 min",
                difficulty: "Intermediário",
                type: "video",
                completed: true,
                content: {
                    videoUrl: "https://example.com/arrow-functions",
                    description: "Sintaxe moderna para funções."
                }
            },
            {
                id: 18,
                title: "Destructuring",
                duration: "30 min",
                difficulty: "Intermediário",
                type: "interactive",
                completed: true,
                content: {
                    description: "Extraia dados de arrays e objetos facilmente."
                }
            },
            {
                id: 19,
                title: "Async/Await",
                duration: "35 min",
                difficulty: "Avançado",
                type: "text",
                completed: false,
                content: {
                    description: "Trabalhe com operações assíncronas de forma simples."
                }
            },
            {
                id: 20,
                title: "Modules",
                duration: "40 min",
                difficulty: "Intermediário",
                type: "project",
                completed: false,
                content: {
                    description: "Organize seu código em módulos."
                }
            }
        ]
    },
    {
        id: 5,
        title: "Banco de Dados SQL",
        description: "Fundamentos de bancos de dados relacionais",
        icon: "database",
        color: "#BB8FCE",
        progress: 10,
        totalLessons: 5,
        completedLessons: 0,
        lessons: [
            {
                id: 21,
                title: "Introdução a Bancos de Dados",
                duration: "25 min",
                difficulty: "Iniciante",
                type: "text",
                completed: false,
                content: {
                    description: "O que são bancos de dados e por que usá-los."
                }
            },
            {
                id: 22,
                title: "Comando SELECT",
                duration: "30 min",
                difficulty: "Iniciante",
                type: "video",
                completed: false,
                content: {
                    videoUrl: "https://example.com/sql-select",
                    description: "Consultas básicas com SELECT."
                }
            },
            {
                id: 23,
                title: "Filtros com WHERE",
                duration: "35 min",
                difficulty: "Intermediário",
                type: "interactive",
                completed: false,
                content: {
                    description: "Filtre dados com condições WHERE."
                }
            },
            {
                id: 24,
                title: "JOIN entre Tabelas",
                duration: "40 min",
                difficulty: "Intermediário",
                type: "text",
                completed: false,
                content: {
                    description: "Combine dados de múltiplas tabelas."
                }
            },
            {
                id: 25,
                title: "Projeto Final",
                duration: "45 min",
                difficulty: "Intermediário",
                type: "project",
                completed: false,
                content: {
                    description: "Crie um pequeno sistema com banco de dados."
                }
            }
        ]
    }
];

// Função auxiliar para buscar lição por ID
export const getLessonById = (id: any) => {
    for (const topic of courseData) {
        const lesson = topic.lessons.find(lesson => lesson.id === parseInt(id));
        if (lesson) {
            return { ...lesson, topicTitle: topic.title, topicColor: topic.color };
        }
    }
    return null;
};

// Função para buscar tópico por ID
export const getTopicById = (id: any) => {
    return courseData.find(topic => topic.id === parseInt(id));
};