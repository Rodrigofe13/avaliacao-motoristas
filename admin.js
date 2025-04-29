// admin.js - VERSÃO FINAL CORRIGIDA

let chartInstance;

function login() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');

    if (!emailInput || !passwordInput) {
        loginError.innerText = "Erro interno: campos de login não encontrados.";
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === "rodrigocomercial@britauniao.com.br" && password === "Sosifordemoto1*") {
        document.getElementById('loginDiv').style.display = "none";
        document.getElementById('adminPanel').style.display = "block";
        loadChart();
    } else {
        loginError.innerText = "Email ou senha inválidos.";
    }
}

function logout() {
    document.getElementById('adminPanel').style.display = "none";
    document.getElementById('loginDiv').style.display = "block";
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
    document.getElementById('loginError').innerText = "";
}

function loadChart(selectedMotorista = '', startMonth = '', endMonth = '') {
    const ctx = document.getElementById('chartMotorista').getContext('2d');
    const data = JSON.parse(localStorage.getItem('avaliacoes')) || [];

    let filteredData = data;

    if (selectedMotorista) {
        filteredData = filteredData.filter(d => d.motorista === selectedMotorista);
    }

    if (startMonth && endMonth) {
        const start = new Date(startMonth + "-01");
        const end = new Date(endMonth + "-01");
        end.setMonth(end.getMonth() + 1); // incluir mês final

        filteredData = filteredData.filter(d => {
            const [day, month, year] = d.data.split('/');
            const date = new Date(year, month - 1, day);
            return date >= start && date < end;
        });
    }

    const labels = filteredData.map(d => \`\${d.data} (\${d.motorista})\`);
    const notas = filteredData.map(d => d.notaFinal);

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Nota (%)',
                data: notas,
                borderColor: '#083358',
                backgroundColor: '#FDB813',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });

    if (filteredData.length === 0) {
        ctx.font = "16px Arial";
        ctx.fillText("Nenhum dado encontrado no período selecionado.", 50, 100);
    }
}

function filterData() {
    const motorista = document.getElementById('selectMotorista').value;
    const startMonth = document.getElementById('startMonth').value;
    const endMonth = document.getElementById('endMonth').value;
    loadChart(motorista, startMonth, endMonth);
}

function exportCSV() {
    const data = JSON.parse(localStorage.getItem('avaliacoes')) || [];

    const motorista = document.getElementById('selectMotorista').value;
    const startMonth = document.getElementById('startMonth').value;
    const endMonth = document.getElementById('endMonth').value;

    let filteredData = data;

    if (motorista) {
        filteredData = filteredData.filter(d => d.motorista === motorista);
    }

    if (startMonth && endMonth) {
        const start = new Date(startMonth + "-01");
        const end = new Date(endMonth + "-01");
        end.setMonth(end.getMonth() + 1);

        filteredData = filteredData.filter(d => {
            const [day, month, year] = d.data.split('/');
            const date = new Date(year, month - 1, day);
            return date >= start && date < end;
        });
    }

    if (filteredData.length === 0) {
        alert("Nenhum dado para exportar.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,Vendedor,Motorista,Data,Nota Final (%)\n";

    filteredData.forEach(row => {
        csvContent += \`\${row.vendedor},\${row.motorista},\${row.data},\${row.notaFinal}\n\`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "avaliacoes_motoristas.csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}
