// Variáveis globais para armazenar o estado do atalho
var isCtrlPressed = false;
var isAltPressed = false;
var isTPressed = false;

// Função para verificar se o atalho foi pressionado
function checkShortcut(event) {
  // Verificar se a tecla Ctrl foi pressionada
  if (event.ctrlKey) {
    isCtrlPressed = true;
  }

  // Verificar se a tecla Alt foi pressionada
  if (event.altKey) {
    isAltPressed = true;
  }

  // Verificar se a tecla T foi pressionada
  if (event.key.toLowerCase() === 't') {
    isTPressed = true;
  }

  // Verificar se todas as teclas do atalho foram pressionadas
  if (isCtrlPressed && isAltPressed && isTPressed) {
    // Alternar a visibilidade da tabela
    var tableContainer = document.getElementById('tableContainer');
    if (tableContainer.style.display === "none") {
        tableContainer.style.display = "block";
    } else {
        tableContainer.style.display = "none";
    }
  }
}

// Função para redefinir o estado do atalho
function resetShortcutState() {
  isCtrlPressed = false;
  isAltPressed = false;
  isTPressed = false;
}

// Adicionar um ouvinte de evento para verificar o atalho quando qualquer tecla for pressionada
document.addEventListener('keydown', checkShortcut);

// Adicionar um ouvinte de evento para redefinir o estado do atalho quando qualquer tecla for liberada
document.addEventListener('keyup', resetShortcutState);



document.addEventListener('DOMContentLoaded', (event) => {
    // Coloque seu código JavaScript aqui...
    console.log('DOM fully loaded and parsed');

let lastSelectedGuideline = null;

// Definição das diretrizes
const EPOS = {
    name: "EPOS 2012",
    description: "European Position Paper on Rhinosinusitis and Nasal Polyps 2012",
    reference: "Fokkens WJ, et al. Eur Arch Otorhinolaryngol. 2012",
    symptoms: [
        "Obstrução/congestão nasal",
        "Secreção nasal (anterior ou posterior)",
        "Dor facial / pressão",
        "Redução ou perda do olfato",
        "Febre alta (>38°C) e secreção purulenta nasal",
        "Sintomas graves ou sintomas durando mais de 10 dias"
    ],
    calculateChance: function(symptomsChecked) {
        let chance = 0;
  
        if (symptomsChecked.includes("Sintomas graves ou sintomas durando mais de 10 dias")) {
          chance = 95; // Se tem sintomas graves ou sintomas duram mais de 10 dias, é quase certeza que é sinusite bacteriana
        } else if (symptomsChecked.includes("Febre alta (>38°C) e secreção purulenta nasal")) {
          chance = 75; // Se tem febre alta e secreção purulenta, é alta a chance de ser sinusite bacteriana.
        }  else if (symptomsChecked.length >= 3) {
          chance = 70; // Se tem pelo menos dois sintomas comuns de rinossinusite, é possível que seja sinusite bacteriana
          
        } else if (symptomsChecked.length >= 2) {
          chance = 50; // Se tem pelo menos dois sintomas comuns de rinossinusite, é possível que seja sinusite bacteriana
        }
          else if (symptomsChecked.length >= 1) {
          chance = 25; // Se tem pelo menos dois sintomas comuns de rinossinusite, é possível que seja sinusite bacteriana
        }  
  
        return chance;
    }
  };
  const AAO_HNSF = {
    name: "AAO-HNSF",
    description: "American Academy of Otolaryngology - Head and Neck Surgery Foundation",
    reference: "Rosenfeld RM, et al. Otolaryngol Head Neck Surg. 2015",
    symptoms: [
        "Dor ou Pressão facial",
        "Obstrução ou Congestão nasal",
        "Secreção nasal ou Gotejamento Posterior",
        "Redução ou Perda de olfato",
        "Temperatura maior que 38°C",
        "Secreção nasal purulenta ou Edema periorbitário",
        "Dor facial intensa ou piora dos sintomas unilateralmente",
        "Piora dos sintomas após o quinto dia ou sintomas persistentes após o décimo dia"
    ],
    calculateChance: function(symptomsChecked) {
        let chance = 0;
  
        if (symptomsChecked.includes("Piora dos sintomas após o quinto dia ou sintomas persistentes após o décimo dia")) {
          chance = 95; // Se os sintomas pioram após o quinto dia ou persistem após o décimo, é quase certeza que é sinusite bacteriana
        } else if (symptomsChecked.includes("Dor facial intensa ou piora dos sintomas unilateralmente")) {
          chance = 85; // Se tem dor facial intensa ou piora dos sintomas de um lado só, é muito alta a chance de ser sinusite bacteriana
        } else if (symptomsChecked.includes("Secreção nasal purulenta ou edema periorbitário")) {
          chance = 70; // Se tem secreção nasal purulenta ou edema ao redor dos olhos, é alta a chance de ser sinusite bacteriana
        } else if (symptomsChecked.length >= 3) {
          chance = 50; // Se tem pelo menos três sintomas comuns de rinossinusite, é possível que seja sinusite bacteriana
        } else if (symptomsChecked.length >= 2) {
          chance = 35; // Se tem pelo menos três sintomas comuns de rinossinusite, é possível que seja sinusite bacteriana
        } else if (symptomsChecked.length >= 1) {
            chance = 20; // Se tem pelo menos três sintomas comuns de rinossinusite, é possível que seja sinusite bacteriana
        }   
  
        return chance;
    }
  };

  function generateSymptomsCheckboxes(guideline) {
    const symptomsDiv = document.getElementById('symptoms');
    symptomsDiv.innerHTML = '';
    guideline.symptoms.forEach(symptom => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        const span = document.createElement('span');
        span.textContent = symptom;
        label.appendChild(checkbox);
        label.appendChild(span);
        symptomsDiv.appendChild(label);
    });
    const guidelineInfoDiv = document.getElementById('guideline-info');
    guidelineInfoDiv.textContent = `Diretriz: ${guideline.description} (${guideline.name}), Referência: ${guideline.reference}`;
  }
  
  document.getElementById('EPOS').addEventListener('click', () => {
    lastSelectedGuideline = EPOS;
    generateSymptomsCheckboxes(EPOS);
  });
  
  document.getElementById('AAO-HNSF').addEventListener('click', () => {
    lastSelectedGuideline = AAO_HNSF;
    generateSymptomsCheckboxes(AAO_HNSF);
  });
  
  // ... (o código original permanece inalterado) ...

  

document.getElementById('calculate').addEventListener('click', () => {
  let symptomsChecked = getCheckedSymptoms();
  let guidelineUsed = lastSelectedGuideline.name;
  let result;
  if (lastSelectedGuideline === EPOS) {
      result = EPOS.calculateChance(symptomsChecked);
  } else if (lastSelectedGuideline === AAO_HNSF) {
      result = AAO_HNSF.calculateChance(symptomsChecked);
  }

  displayResult(result);
  document.getElementById('alert').style.display = 'block';
  displayTableData(symptomsChecked, guidelineUsed, result);
    
});

// ... (o restante do código original permanece inalterado) ...
function createTable(symptomsChecked, guidelineUsed, result) {
    // Obtenha a referência do elemento onde você deseja exibir a tabela
    var tableContainer = document.getElementById('tableContainer');
  
    // Verifique se a tabela já existe no contêiner
    var table = tableContainer.querySelector('table');
    
    // Obtenha os sintomas de cada diretriz
    var symptomsEPOS = EPOS.symptoms;
    var symptomsAAO_HNSF = AAO_HNSF.symptoms;

    // Concatene as duas listas de sintomas
    var allSymptoms = symptomsEPOS.concat(symptomsAAO_HNSF);

    // Remova sintomas duplicados
    allSymptoms = Array.from(new Set(allSymptoms));

    if (!table) {
      // Se a tabela ainda não existir, crie uma nova tabela
      table = document.createElement('table');
      table.classList.add('data-table');
      tableContainer.appendChild(table);
  
      // Crie a linha de cabeçalho da tabela
      var headerRow = document.createElement('tr');
      var header1 = document.createElement('th');
      header1.textContent = 'Sintoma';
      headerRow.appendChild(header1);
  
      // Adicione as opções de sintoma como colunas na tabela
      allSymptoms.forEach(function(symptom) {
        var symptomCell = document.createElement('td');
        symptomCell.textContent = symptomsChecked.includes(symptom) ? '✔' : '';
        dataRow.appendChild(symptomCell);
    });
    
  
      // Adicione a coluna de resultado
      var resultHeader = document.createElement('th');
      resultHeader.textContent = 'Resultado';
      headerRow.appendChild(resultHeader);
  
      // Adicione a linha de cabeçalho à tabela
      table.appendChild(headerRow);
    }
  
    // Crie uma linha de dados com a diretriz e o resultado
    var dataRow = document.createElement('tr');
  
    // Crie a célula para a diretriz
    var guidelineCell = document.createElement('td');
    guidelineCell.textContent = guidelineUsed.name;
    dataRow.appendChild(guidelineCell);
  
    // Preencha as células de sintoma com marcadores de verificação
    allSymptoms.forEach(function(symptom) {
        var symptomCell = document.createElement('td');
        symptomCell.textContent = symptomsChecked.includes(symptom) ? '✔' : '';
        dataRow.appendChild(symptomCell);
    });
    
  
    // Adicione a célula de resultado
    var resultCell = document.createElement('td');
    resultCell.textContent = result;
    dataRow.appendChild(resultCell);
  
    // Adicione a linha de dados à tabela
    table.appendChild(dataRow);
  }  

  // Função para armazenar os dados da tabela no armazenamento local
  function saveTableData(tableData) {
    localStorage.setItem('tableData', JSON.stringify(tableData));
  }
  
  // Função para recuperar os dados da tabela do armazenamento local
  function getTableData() {
    var tableData = localStorage.getItem('tableData');
    return JSON.parse(tableData) || [];
  }
  // Função para adicionar novos dados à tabela
  function addTableData(symptomsChecked, guidelineUsed, result) {
    var tableData = getTableData();
  
    // Adicione os novos dados à tabela
    var newRow = [guidelineUsed.name].concat(symptomsChecked).concat(result);
    tableData.push(newRow);
  
    // Salve a tabela atualizada no armazenamento local
    saveTableData(tableData);

    // Atualize a exibição da tabela
    displayTableData();
  }
  
  // Função para exibir os dados da tabela
  function displayTableData() {
    var tableData = getTableData();
  
    // Obtenha a referência do elemento onde você deseja exibir a tabela
    var tableContainer = document.getElementById('tableContainer');
  
    // Crie uma tabela HTML
    var table = document.createElement('table');
    table.classList.add('data-table'); // Adicione uma classe CSS para estilização opcional

    // Percorra os dados da tabela e crie as linhas e células correspondentes
    for (var i = 0; i < tableData.length; i++) {
        var rowData = tableData[i];
    
        var dataRow = document.createElement('tr');
    
    // Crie as células da linha
    for (var j = 0; j < rowData.length; j++) {
        var cellData = rowData[j];
  
        var cell = document.createElement('td');
        cell.textContent = cellData;
        dataRow.appendChild(cell);
      }
  
    // Adicione a linha à tabela
    table.appendChild(dataRow);
    }
  
    // Limpe o conteúdo atual do contêiner da tabela
    tableContainer.innerHTML = '';

  
    // Adicione a tabela ao contêiner
    tableContainer.appendChild(table);
  }

  document.getElementById('tableInsert').addEventListener('click', () => {
    var symptomsChecked = getCheckedSymptoms();
    var guidelineUsed = lastSelectedGuideline;
    var result = document.getElementById('result').textContent;
  
    // Adicione os novos dados à tabela
    createTable(symptomsChecked, guidelineUsed, result);
  });
  

  // Função para obter os sintomas marcados
  function getCheckedSymptoms() {
    var checkboxes = document.querySelectorAll('#symptoms input[type="checkbox"]');
    var checkedSymptoms = [];
    checkboxes.forEach(function (checkbox) {
      if (checkbox.checked) {
        var symptomText = checkbox.nextElementSibling.textContent.trim();
        checkedSymptoms.push(symptomText);
      }
    });
    return checkedSymptoms;
  }
  

  document.getElementById('calculate').addEventListener('click', () => {
    let symptomsChecked = getCheckedSymptoms();
    let result;
    if (lastSelectedGuideline === EPOS) {
        result = EPOS.calculateChance(symptomsChecked);
    } else if (lastSelectedGuideline === AAO_HNSF) {
        result = AAO_HNSF.calculateChance(symptomsChecked);
    }
  
    displayResult(result);
    document.getElementById('alert').style.display = 'block';

    createTable(symptomsChecked, lastSelectedGuideline, result);
    
    
  });
    
  function displayResult(probability) {
    const resultElement = document.getElementById('result');
    let comment = '';
    
    if (typeof probability !== 'undefined') {
      if (probability < 33) {
        resultElement.style.color = 'green';
        comment = 'Baixa probabilidade de sinusite bacteriana';
      } else if (probability < 66) {
        resultElement.style.color = 'orange';
        comment = 'Média probabilidade de sinusite bacteriana';
      } else {
        resultElement.style.color = 'red';
        comment = 'Alta probabilidade de sinusite bacteriana';
      }
    
      resultElement.textContent = `${comment}: ${probability.toFixed(2)}%`;
    }
  }
  
  
  function getCheckedSymptoms() {
    let checkboxes = document.querySelectorAll('#symptoms input[type="checkbox"]');
    let checkedSymptoms = [];
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        let symptomText = checkbox.nextElementSibling.textContent.trim();
        checkedSymptoms.push(symptomText);
      }
    });
    return checkedSymptoms;
  }
  
  function resetCalculation() {
    let checkboxes = document.querySelectorAll('#symptoms input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    document.getElementById('result').textContent = '';
    document.getElementById('alert').style.display = 'none';
}

  function resetGuidelineSelection() {
    document.getElementById('EPOS').checked = false;
    document.getElementById('AAO-HNSF').checked = false;
    document.getElementById('guideline-info').textContent = '';
    document.getElementById('symptoms').innerHTML = '';
    
    lastSelectedGuideline = null;
    console.log('resetGuidelineSelection', lastSelectedGuideline);
  }

  
  
document.getElementById('resetButton').addEventListener('click', () => {
    resetCalculation();
    resetGuidelineSelection();
  });

// Função para carregar os dados da tabela ao carregar a página
window.addEventListener('DOMContentLoaded', function () {
    displayTableData();
  });
  
  function clearTable() {
    // Obtenha a referência para o contêiner da tabela
    var tableContainer = document.getElementById('tableContainer');

    // Limpe o conteúdo do contêiner
    tableContainer.innerHTML = '';

    localStorage.removeItem('tableData');
}
  
document.getElementById('clearTableButton').addEventListener('click', clearTable);
    

}); 