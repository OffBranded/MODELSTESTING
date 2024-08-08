document.addEventListener("DOMContentLoaded", () => {
    const modelList = document.getElementById('model-list');
    const apiUrl = "https://api.github.com/repos/yourusername/yourrepo/contents/Models"; // Enlace a la API de GitHub

    fetch(apiUrl)
        .then(response => response.json())
        .then(files => {
            const models = files.filter(file => file.type === 'dir'); // Filtrar solo los directorios

            models.forEach(model => {
                const modelName = model.name;
                const infoUrl = `https://raw.githubusercontent.com/yourusername/yourrepo/main/Models/${modelName}/info.ofdb`;
                const imgUrl = `https://raw.githubusercontent.com/yourusername/yourrepo/main/Models/${modelName}/main.png`;

                fetch(infoUrl)
                    .then(response => response.text()) // Leer el archivo como texto
                    .then(text => {
                        const lines = text.split('\n');
                        const data = {};
                        lines.forEach(line => {
                            const [key, value] = line.split('=');
                            if (key && value) {
                                data[key.trim()] = value.trim().replace(/^"(.*)"$/, '$1'); // Eliminar comillas
                            }
                        });

                        const modelDiv = document.createElement('div');
                        modelDiv.className = 'model';

                        modelDiv.innerHTML = `
                            <h2>${modelName}</h2>
                            <p class="info">Nombre: ${data.name || 'No disponible'}</p>
                            <p class="info">Precio: ${data.price || 'No disponible'}</p>
                            <img src="${imgUrl}" alt="${modelName} Image">
                        `;

                        modelList.appendChild(modelDiv);
                    })
                    .catch(error => console.error('Error al cargar la información del modelo:', error));
            });
        })
        .catch(error => console.error('Error al cargar los archivos del directorio:', error));
});
