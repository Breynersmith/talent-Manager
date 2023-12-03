// Se ejecuta cuando el contenido del documento HTML ha sido completamente cargado
document.addEventListener("DOMContentLoaded", function () {

    // Definición de constantes para elementos HTML y datos
    const columTitle = ['Id', 'Nombre', 'Edad', 'Ciudad', 'Profesion'];
    const tbody = document.getElementById('tablaDatos');
    const ciudadFilter = document.getElementById('ciudad');
    const palabraFilter = document.getElementById('termino');
    const btnFiltrar = document.querySelector('#btnFiltrar');
    const numTalentosElement = document.getElementById('numTalentos');

    // Función para crear el encabezado de la tabla
    const placeColumnTitle = () => {
        const headerRow = document.createElement('tr');
        columTitle.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column;
            headerRow.appendChild(th);
        });
        tbody.appendChild(headerRow);
    };

    // Función asincrónica para obtener datos del archivo 'archivo.txt'
    const fetchData = async () => {
        try {
            // Realiza una solicitud para obtener el contenido del archivo 'archivo.txt'
            const response = await fetch('archivo.txt');
            const data = await response.text();
            const lines = data.split('\n');

            // Convierte las líneas del archivo en una tabla bidimensional
            const originalTable = lines.map(line => line.split(','));
            //agrega los titulos de las columnas
            placeColumnTitle();
            // Muestra dinámicamente los datos en la tabla HTML
            originalTable.forEach(rowData => {
                const row = document.createElement('tr');

                rowData.forEach(cellData => {
                    const td = document.createElement('td');
                    td.textContent = cellData;
                    row.appendChild(td);
                });

                tbody.appendChild(row);
            });

            // Llama a placeColumnTitle al cargar la página
            

            // Obtiene valores únicos para las ciudades y profesiones
            const ciudadesUnicas = [...new Set(originalTable.map(row => row[3]))];
            const tablaValues = [...new Set(originalTable.flatMap(row => row.slice(1)))];

            // Agrega opciones a los filtros de ciudad y palabra
            ciudadesUnicas.forEach(ciudad => {
                const option = document.createElement('option');
                option.value = ciudad;
                option.textContent = ciudad;
                ciudadFilter.appendChild(option);
            });

            tablaValues.forEach(profesion => {
                const option = document.createElement('option');
                option.value = profesion;
                option.textContent = profesion;
                palabraFilter.appendChild(option);
            });

            // Agrega un event listener al botón de filtrar
            btnFiltrar.addEventListener('click', () => {
                event.preventDefault();

                // Obtiene los valores de los filtros
                const ciudadSeleccionada = ciudadFilter.value;
                const termino = palabraFilter.value.toLowerCase();

                // Aplica los filtros a la tabla original
                const filteredTable = originalTable.filter(row => {
                    const ciudadMatch = ciudadSeleccionada === 'Ciudad' || row[3] === ciudadSeleccionada;
                    const terminoMatch = row.some(column => {
                        const columnSplit = column.toLowerCase().split(' ')
                        return termino === '' || columnSplit.some(word => word.includes(termino))
                    });

                    return ciudadMatch && terminoMatch;
                });

                // Actualiza la tabla y las estadísticas
                updateTable(filteredTable);
                updateStatistics(originalTable, filteredTable);
            });

            // Actualiza las estadísticas después de cargar los datos
            updateStatistics(originalTable, originalTable);

        } catch (error) {
            // Manejo de errores en caso de falla en la obtención de datos
            console.error(error);
        }
    };

    // Función para actualizar las estadísticas
    const updateStatistics = (originalTable, filteredTable) => {
        const numTalentos = filteredTable.length; // Restamos 1 para excluir el encabezado
        numTalentosElement.textContent = numTalentos;
    };

    // Función para actualizar la tabla HTML
    const updateTable = (data) => {
        // Limpia el tbody antes de añadir los nuevos datos
        tbody.innerHTML = '';

        // Agrega el encabezado dinámicamente
        placeColumnTitle();

        // Añade las filas de datos a la tabla
        data.forEach((rowData) => {
            const row = document.createElement('tr');

            rowData.forEach((cellData) => {
                const td = document.createElement('td');
                td.textContent = cellData;
                row.appendChild(td);
            });

            tbody.appendChild(row);
        });
    };

    // Llama a la función para obtener y mostrar los datos al cargar la página
    fetchData();
});
