window.goBack.onclick = function() {
	localStorage.removeItem('foundN');
	localStorage.removeItem('foundL');
	window.location.href = 'index.html';
}

LoadLicences();
LoadRecordNumbers();

function LoadLicences() {
	const found = JSON.parse(localStorage.getItem('foundL'));
	const table = window.resultLicences;
	if (found == null) {
		return;
	}
	table.innerHTML = '<tr><th>Placa</th><th>Fecha</th><th>Número</th><th>Punto de atención</th></tr>';
	found.map((record) => {
		record.dateLine.forEach((line) => {
			const row = table.insertRow();
			const cell1 = row.insertCell(0);
			const cell2 = row.insertCell(1);
			const cell3 = row.insertCell(2);
			const cell4 = row.insertCell(3);
			cell1.innerHTML = record.license;
			cell2.innerHTML = line[0];
			cell3.innerHTML = line[3];
			cell4.innerHTML = line[5];
		});
	});
}

function LoadRecordNumbers() {
	const found = JSON.parse(localStorage.getItem('foundN'));
	const table = window.resultRecordNumbers;
	if (found == null) {
		return;
	}
	table.innerHTML = '<tr><th>Número</th><th>Fecha</th><th>Placa</th><th>Punto de atención</th></tr>';
	found.map((record) => {
		record.dateLine.forEach((line) => {
			const row = table.insertRow();
			const cell1 = row.insertCell(0);
			const cell2 = row.insertCell(1);
			const cell3 = row.insertCell(2);
			const cell4 = row.insertCell(3);
			cell1.innerHTML = record.recordNumber;
			cell2.innerHTML = line[0];
			cell3.innerHTML = line[1];
			cell4.innerHTML = line[5];
		});
	});
}