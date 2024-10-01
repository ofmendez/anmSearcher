
window.theForm.onsubmit = (e) => {
	e.preventDefault();
	const sourceText = (new FormData(theForm)).get('sourceText');
	getDatesArray(sourceText);
};
// GIK-10033X

function getDatesArray(text) {
	const startString = "Fecha Publicación o Fijación";
	const endString = "Dirección:";

	const startIndex = text.indexOf(startString);
	const endIndex = text.indexOf(endString);
	if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
		const filteredText = text.substring(startIndex + startString.length, endIndex).trim();
		makeArray(filteredText);
	} else {
		console.log('Strings not found or in incorrect order');
		LoadExcel([]);
		return null;
	}
}

function makeArray(text) {
	const lines = text.split('\n');
	const datesArray = lines.filter((line) => {
		const date = line.match(/\d{2}\/\d{2}\/\d{4}/);
		return date;
	});
	datesArray.forEach((date, index) => {
		datesArray[index] = date.split('\t');
	});
	if( datesArray.length > 0 ){
		const ll = datesArray.length - 1;
		const li = datesArray[ll].length - 1;
		datesArray[ll][li] = datesArray[ll][li].replace('Páginas', '');
	}
	// console.log(datesArray);
	LoadExcel(datesArray);
}

function LoadExcel(datesArray) {
	// load excel file from local storage
	fetch('../data/Expedientes.xls').then((response) => {
		return response.arrayBuffer();
	}).then((buffer) => {
		const data = new Uint8Array(buffer);
		const arr = new Array();
		for (let i = 0; i !== data.length; ++i) arr[i] = String.fromCharCode(data[i]);
		const bstr = arr.join('');
		const workbook = XLSX.read(bstr, { type: 'binary' });
		const sheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[sheetName];
		const excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
		// console.log(excelData);
		CheckByRecordNumber(excelData, datesArray);
	});
}

function CheckByRecordNumber(excelData, datesArray) {
	console.log('Checking by record number');
	const found = [];
	excelData.map((record) => {
		const recordNumber = record['Número Expediente'];
		const tmp = datesArray.filter((dateLine) => {
			return dateLine[3].includes(recordNumber);
		});
		if (tmp.length > 0) {
			found.push({recordNumber:recordNumber, dateLine: tmp});
		}
	});
	if (found.length > 0) {
		console.log(found);
		localStorage.setItem('foundN', JSON.stringify(found));
	}
	CheckByLicense(excelData, datesArray);
}

function CheckByLicense(excelData, datesArray) {
	console.log('Checking by license');
	const found = [];
	excelData.map((record) => {
		const license = record['Placa'];
		const tmp = datesArray.filter((dateLine) => {
			return dateLine[1].includes(license);
		});
		if (tmp.length > 0) {
			found.push({license:license, dateLine: tmp});
		}
	});
	if (found.length > 0) {
		localStorage.setItem('foundL', JSON.stringify(found));
		console.log(found);
		window.location.href = 'resultados.html';
	}
	if( localStorage.getItem('foundN') == null && localStorage.getItem('foundL') == null){
		alert('No se encontraron coincidencias');
	}
}