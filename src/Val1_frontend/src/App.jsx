import { useState } from 'react';
import { Val1_backend } from 'declarations/Val1_backend';
import { jsPDF } from 'jspdf'; // Asegúrate de instalar jsPDF
import './index.scss';

function Licencia() {
  const [tipoLicencia, setTipoLicencia] = useState('');
  const [procesoLicencia, setProcesoLicencia] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [historialLicencias, setHistorialLicencias] = useState([]); // Estado para el historial

  const handleTipoLicenciaChange = (e) => {
    setTipoLicencia(e.target.value);
  };

  const handleProcesoChange = (e) => {
    setProcesoLicencia(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Definir correctamente la duración según el tipo de proceso
    const duracionLicencia = procesoLicencia === 'Renovacion'
      ? parseInt(event.target.duracionLicencia.value)
      : parseInt(event.target.duracionPrimeraVez.value);

    // Procesar valores condicionales según el tipo de proceso
    const folioVencido = procesoLicencia === 'Renovacion' ? event.target.folioVencido.value : null;
    const nombreCompleto = procesoLicencia === 'PrimeraVez' ? event.target.nombreCompleto.value : null;
    const curp = procesoLicencia === 'PrimeraVez' ? event.target.curp.value : null;
    const fechaNacimiento = procesoLicencia === 'PrimeraVez' ? event.target.fechaNacimiento.value : null;
    const nacionalidad = procesoLicencia === 'PrimeraVez' ? event.target.nacionalidad.value : null;
    const donadorOrganos = procesoLicencia === 'PrimeraVez' ? event.target.donadorOrganos.value : null;
    const estatura = procesoLicencia === 'PrimeraVez' ? parseInt(event.target.estatura.value) : null;
    const grupoSanguineo = procesoLicencia === 'PrimeraVez' ? event.target.grupoSanguineo.value : null;

    try {
      const resultado = await Val1_backend.procesarLicencia(
        tipoLicencia,
        procesoLicencia,
        folioVencido,
        duracionLicencia,
        nombreCompleto,
        curp,
        fechaNacimiento,
        nacionalidad,
        donadorOrganos,
        estatura,
        grupoSanguineo
      );
      setMensaje(resultado.mensaje);
      
      // Agregar la licencia al historial
      setHistorialLicencias((prev) => [...prev, { tipoLicencia, procesoLicencia, duracionLicencia }]);
    } catch (error) {
      console.error("Error en el procesamiento de la licencia:", error);
      setMensaje("Hubo un error al procesar la licencia. Inténtalo de nuevo.");
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Historial de Licencias", 10, 10);
    historialLicencias.forEach((licencia, index) => {
      const y = 20 + index * 10;
      doc.text(`Licencia ${index + 1}: Tipo: ${licencia.tipoLicencia}, Proceso: ${licencia.procesoLicencia}, Duración: ${licencia.duracionLicencia} años`, 10, y);
    });
    doc.save("historial_licencias.pdf");
  };

  const generarFichaPago = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Ficha de Pago", 10, 10);
    doc.setFontSize(12);
    doc.text("Cantidad: $300", 10, 30);
    doc.text("Tipo de Licencia: " + tipoLicencia, 10, 40);
    doc.text("Proceso: " + procesoLicencia, 10, 50);
    doc.text("Fecha: " + new Date().toLocaleDateString(), 10, 60);
    doc.save("ficha_pago.pdf");
  };

  return (
    <div className="licencia-container">
      <h1>Formulario de Licencia de Conducir</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="tipoLicencia">Tipo de Licencia:</label>
          <select id="tipoLicencia" name="tipoLicencia" onChange={handleTipoLicenciaChange} required>
            <option value="">Selecciona una opción</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
          </select>
        </div>

        <div>
          <label htmlFor="procesoLicencia">Proceso:</label>
          <select id="procesoLicencia" name="procesoLicencia" onChange={handleProcesoChange} required>
            <option value="">Selecciona una opción</option>
            <option value="Renovacion">Renovación</option>
            <option value="PrimeraVez">Primera vez</option>
          </select>
        </div>

        {procesoLicencia === 'Renovacion' && (
          <div>
            <div>
              <label htmlFor="folioVencido">Folio de Licencia Vencida:</label>
              <input type="text" id="folioVencido" name="folioVencido" required />
            </div>
            <div>
              <label htmlFor="duracionLicencia">Duración de la nueva licencia:</label>
              <select id="duracionLicencia" name="duracionLicencia" required>
                <option value="1">1 año</option>
                <option value="3">3 años</option>
                <option value="10">10 años</option>
              </select>
            </div>
          </div>
        )}

        {procesoLicencia === 'PrimeraVez' && (
          <div>
            <div>
              <label htmlFor="nombreCompleto">Nombre Completo:</label>
              <input type="text" id="nombreCompleto" name="nombreCompleto" required />
            </div>
            <div>
              <label htmlFor="curp">CURP:</label>
              <input type="text" id="curp" name="curp" required />
            </div>
            <div>
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
              <input type="date" id="fechaNacimiento" name="fechaNacimiento" required />
            </div>
            <div>
              <label htmlFor="nacionalidad">Nacionalidad:</label>
              <input type="text" id="nacionalidad" name="nacionalidad" required />
            </div>
            <div>
              <label htmlFor="donadorOrganos">Donador de Órganos:</label>
              <select id="donadorOrganos" name="donadorOrganos" required>
                <option value="Si">Sí</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label htmlFor="estatura">Estatura (cm):</label>
              <input type="number" id="estatura" name="estatura" required />
            </div>
            <div>
              <label htmlFor="grupoSanguineo">Grupo Sanguíneo:</label>
              <input type="text" id="grupoSanguineo" name="grupoSanguineo" required />
            </div>
            <div>
              <label htmlFor="duracionPrimeraVez">Duración de la licencia:</label>
              <select id="duracionPrimeraVez" name="duracionPrimeraVez" required>
                <option value="1">1 año</option>
                <option value="3">3 años</option>
                <option value="10">10 años</option>
              </select>
            </div>
          </div>
        )}

        <button type="submit">Enviar</button>
      </form>
      {mensaje && <p>{mensaje}</p>} {/* Mensaje de respuesta */}

      <h2>Historial de Licencias</h2>

      <button onClick={generarPDF}>Descargar Historial (PDF)</button>
      <ul>
        {historialLicencias.map((licencia, index) => (
          <li key={index}>
            Licencia {index + 1}: Tipo {licencia.tipoLicencia}, Proceso {licencia.procesoLicencia}, Duración {licencia.duracionLicencia} años
          </li>
        ))}
      </ul>

      <button onClick={generarFichaPago} className="payment-button">Generar Ficha de Pago de Multa</button>
    </div>
  );
}

export default Licencia;
