// script.js

const vendedoresMotoristas = {
    "Jane": ["Altieris", "Lucio", "Lucilio", "Jasso", "Jairo", "Mario", "Edivaldo", "Marcos", "José Maria", "Orivaldo"],
    "Maira": ["Altieris", "Lucio", "Lucilio", "Jasso", "Jairo", "Mario", "Edivaldo", "Marcos", "José Maria", "Orivaldo"],
    "Maria Alice": ["Altieris", "Lucio", "Lucilio", "Jasso", "Jairo", "Mario", "Edivaldo", "Marcos", "José Maria", "Orivaldo"],
    "Rodrigo": ["Odenir", "Fernando", "João Carlos", "Luciano", "Eder"]
};

const questions = [
    { text: "Segue as rotas e sequências definidas pelo setor de logística?", weight: 3 },
    { text: "Informa ao setor comercial quando há necessidade de alteração na rota?", weight: 3 },
    { text: "Avisa sobre atrasos nas entregas e informa o cliente com antecedência?", weight: 3 },
    { text: "Realiza o checklist antes de sair para as entregas?", weight: 2 },
    { text: "Confere o romaneio de entrega com os materiais antes de sair para entrega?", weight: 3 },
    { text: "Segue as políticas de pagamento e informa o setor comercial caso haja mudanças?", weight: 3 },
    { text: "Mantém uma comunicação clara e respeitosa com o setor comercial?", weight: 2 },
    { text: "Retorna ligações do setor comercial dentro do prazo adequado?", weight: 2 },
    { text: "Atende as ligações sempre que necessário?", weight: 2 },
    { text: "Informa o setor comercial sobre inconsistências no pedido antes de realizar a entrega?", weight: 3 },
    { text: "Reclama constantemente sobre as condições da entrega?", weight: 1 },
    { text: "Cumpre com toda a rota dentro do período solicitado?", weight: 3 }
];

const scores = {
    "Sempre": 10,
    "Frequentemente": 8,
    "Às vezes": 5,
    "Raramente": 3,
    "Nunca": 0
};

window.onload = function () {
    const questionsDiv = document.getElementById('questions');
    questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.className = "form-group";
        div.innerHTML = `
            <label>${index + 1}. ${q.text}</label>
            <select class="question-select" id="q${index}" required>
                <option value="">-- Selecione --</option>
                <option value="Sempre">Sempre</option>
                <option value="Frequentemente">Frequentemente</option>
                <option value="Às vezes">Às vezes</option>
                <option value="Raramente">Raramente</option>
                <option value="Nunca">Nunca</option>
            </select>
        `;
        questionsDiv.appendChild(div);
    });
};

function filterMotoristas() {
    const vendedor = document.getElementById('vendedor').value;
    const motoristaSelect = document.getElementById('motorista');
    motoristaSelect.innerHTML = '<option value="">-- Selecione o Motorista --</option>';

    if (vendedor && vendedoresMotoristas[vendedor]) {
        vendedoresMotoristas[vendedor].forEach(motorista => {
            const option = document.createElement('option');
            option.value = motorista;
            option.text = motorista;
            motoristaSelect.add(option);
        });
    }
}

function calculateScore() {
    let total = 0;
    let maxTotal = 0;

    questions.forEach((q, index) => {
        const answer = document.getElementById(`q${index}`).value;
        if (!answer) {
            alert("Por favor, responda todas as perguntas.");
            return;
        }
        const score = scores[answer] * q.weight;
        total += score;
        maxTotal += 10 * q.weight;
    });

    const percentage = ((total / maxTotal) * 100).toFixed(2);
    document.getElementById('result').innerHTML = `Nota Final: ${percentage}%`;
}

function saveResult() {
    const vendedor = document.getElementById('vendedor').value.trim();
    const motorista = document.getElementById('motorista').value;

    if (!vendedor || !motorista) {
        alert("Por favor, preencha vendedor e motorista.");
        return;
    }

    let total = 0;
    let maxTotal = 0;
    const respostas = {};

    questions.forEach((q, index) => {
        const answer = document.getElementById(`q${index}`).value;
        respostas[`q${index + 1}`] = answer;
        const score = scores[answer] * q.weight;
        total += score;
        maxTotal += 10 * q.weight;
    });

    const percentage = ((total / maxTotal) * 100).toFixed(2);

    const data = {
        vendedor,
        motorista,
        respostas,
        notaFinal: percentage,
        data: new Date().toLocaleDateString('pt-BR')
    };

    let allResults = JSON.parse(localStorage.getItem('avaliacoes')) || [];
    allResults.push(data);
    localStorage.setItem('avaliacoes', JSON.stringify(allResults));

    alert("Resultado salvo com sucesso!");
    document.getElementById('evaluationForm').reset();
    document.getElementById('result').innerHTML = "";
}

function resetForm() {
    document.getElementById('motorista').innerHTML = '<option value="">-- Escolha um Vendedor Primeiro --</option>';
}
