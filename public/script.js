document.getElementById('image').addEventListener('change', function () {
    const preview = document.getElementById('imagePreview');
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };

        reader.readAsDataURL(file);
    } else {
        preview.src = '';
        preview.style.display = 'none';
    }
});

document.getElementById('uploadForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = 'Analizando la imagen...';

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if (result.success) {
            const analysis = result.analysis;

            // Mostrar resultados en una tabla
            resultsDiv.innerHTML = `
                <h2>Resultados del Análisis</h2>
                <table>
                    <tr>
                        <th>Categoría</th>
                        <th>Confianza</th>
                    </tr>
                    ${analysis.categories.map(cat => `
                        <tr>
                            <td>${cat.name}</td>
                            <td>${(cat.score * 100).toFixed(2)}%</td>
                        </tr>
                    `).join('')}
                </table>
                <table>
                    <tr>
                        <th>Etiqueta</th>
                        <th>Confianza</th>
                    </tr>
                    ${analysis.tags.map(tag => `
                        <tr>
                            <td>${tag.name}</td>
                            <td>${(tag.confidence * 100).toFixed(2)}%</td>
                        </tr>
                    `).join('')}
                </table>
                <h3>Descripción</h3>
                <p>${analysis.description.captions.length > 0 ? analysis.description.captions[0].text : 'No disponible'}</p>
                <h3>Metadatos</h3>
                <ul>
                    <li>Altura: ${analysis.metadata.height}px</li>
                    <li>Ancho: ${analysis.metadata.width}px</li>
                    <li>Formato: ${analysis.metadata.format}</li>
                </ul>
            `;
        } else {
            resultsDiv.innerHTML = `<p>Error: ${result.error}</p>`;
        }
    } catch (error) {
        console.error('Error:', error);
        resultsDiv.innerHTML = '<p>Ocurrió un error al procesar la solicitud.</p>';
    }
});
