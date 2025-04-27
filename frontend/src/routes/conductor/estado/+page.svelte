<script lang="ts">
  import HandleRoutes from "../../../components/auth/HandleRoutes.svelte";
  import DashboardLayout from "../../../components/layout/dashboard/DashboardLayout.svelte";
  import { toast } from "svelte-sonner";
  import axiosInstance from "../../../utils/axiosInstance"; // Import axios instance

  interface Vehiculo {
    id_vehiculo?: number;
    id_usuario: number;
    modelo: string;
    placa: string;
    estado: string;
    tipo_vehiculo: string;
    ultimo_mantenimiento: string;
    proximo_mantenimiento: string;
    historial: string[];
  }

  let vehiculos: Vehiculo[] = []; // Array to store all vehicles

  // Fetch all vehicles from the API
  const fetchVehiculos = async () => {
    try {
      const response = await axiosInstance.get<Vehiculo[]>("/vehiculos");
      vehiculos = response.data; // Update vehicles array with data from API
    } catch (error) {
      console.error("Error al obtener los vehículos:", error);
      toast.error("No se pudo cargar la información de los vehículos");
    }
  };

  // Call fetchVehiculos when the component is initialized
  fetchVehiculos();

  const calcularProximoMantenimiento = (ultimo_mantenimiento: string, fecha: string): string | null => {
    const fechaUltimoMantenimiento = new Date(ultimo_mantenimiento);
    const fechaActual = new Date(fecha);
    const diferencia = fechaActual.getTime() - fechaUltimoMantenimiento.getTime();
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    if (dias > 30 || dias < 0) {
      toast.warning("El vehículo no puede tener más de 30 días sin mantenimiento");
      return null;
    }

    const proximoMantenimiento = new Date(fechaActual);
    proximoMantenimiento.setDate(proximoMantenimiento.getDate());
    return proximoMantenimiento.toISOString().split("T")[0];
  };

  const actualizarMantenimiento = async (id_vehiculo: number, fecha_ultimo_mantenimiento: string) => {
    let toEdit = {};
    const fechaUltimoMantenimiento = prompt("Ingresa la fecha del último mantenimiento (DD-MM-YYYY):");
    if (fechaUltimoMantenimiento) {
      const partesFecha = fechaUltimoMantenimiento.split("-");
      const fechaFormateada = new Date(`${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`);
      if (isNaN(fechaFormateada.getTime())) {
        toast.error("La fecha ingresada no es válida. Asegúrate de usar el formato DD-MM-YYYY.");
        return;
        
      }
      const proximoMantenimiento = calcularProximoMantenimiento(fecha_ultimo_mantenimiento, fechaFormateada.toISOString().split("T")[0]);
      if (!proximoMantenimiento) return;
      // check if today is greater than the last maintenance date (taken from the date be)
      if (new Date().getTime() > new Date(fecha_ultimo_mantenimiento).getTime()) {
        toEdit = {
          ultimo_mantenimiento: fechaFormateada.toISOString().split("T")[0],
          proximo_mantenimiento: proximoMantenimiento,
        };
      } else {
        toEdit = {
          proximo_mantenimiento: proximoMantenimiento,
        };
      }
      try {
        const ultimoMantenimiento = vehiculos.find((vehiculo) => vehiculo.id_vehiculo === id_vehiculo)?.ultimo_mantenimiento || '';
        await axiosInstance.put(`/vehiculos/${id_vehiculo}`, toEdit);
        toast.success("Fechas de mantenimiento actualizadas correctamente");

        // Update the local state of vehicles
        vehiculos = vehiculos.map((vehiculo) => {
          if (vehiculo.id_vehiculo === id_vehiculo) {
            return {
              ...vehiculo,
              ...toEdit,
            };
          }
          return vehiculo;
        });
      } catch (error) {
        toast.error("No se pudo actualizar la información del mantenimiento");
      }
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES");
  };
</script>

<HandleRoutes redirectUrl="/login" allowedRoles={["Conductor"]}>
  <DashboardLayout>
    <div class="estado-container">
      <h1>Estado de los Vehículos</h1>
      {#if vehiculos.length === 0}
        <p>No hay vehículos registrados</p>
      {/if}
      {#each vehiculos as vehiculo (vehiculo.id_vehiculo)}
        <div class="vehicle-card">
          <div class="vehicle-header">
            <h2>Información del Vehículo</h2>
            <span class="vehicle-id">{vehiculo.id_vehiculo}</span>
          </div>

          <div class="vehicle-info">
            <div class="info-section">
              <h3>Detalles Básicos</h3>
              <p><strong>Modelo:</strong> {vehiculo.modelo}</p>
              <p><strong>Placa:</strong> {vehiculo.placa}</p>
              <p><strong>Tipo de Vehículo:</strong> {vehiculo.tipo_vehiculo}</p>
              <p><strong>Último mantenimiento:</strong>
                {formatDate(vehiculo.ultimo_mantenimiento) || "No disponible"}
              </p>
              <p><strong>Próximo mantenimiento:</strong>
                {formatDate(vehiculo.proximo_mantenimiento) || "No disponible"}
              </p>
            </div>

            <div class="info-section">
              <h3>Estado Actual</h3>
              <p><strong>Estado:</strong> {vehiculo.estado}</p>
            </div>

            <div class="info-section">
              <h3>Historial</h3>
              <ul>
                {#each vehiculo.historial as evento}
                  <li>{evento}</li>
                {/each}
              </ul>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px">

            <button 
            class="update-maintenance-btn"
            on:click={() => actualizarMantenimiento(vehiculo.id_vehiculo!, vehiculo.ultimo_mantenimiento)}>
              Actualizar Mantenimiento
            </button>
          </div>
        </div>
      {/each}
    </div>
  </DashboardLayout>
</HandleRoutes>

<style>
  .estado-container {
    padding: 2rem;
    width: 100%;
    max-width: 1000px;
  }

  h1 {
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
  }
  .update-maintenance-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
    width: 100%;
  }

  .update-maintenance-btn:hover {
    background: #0056b3;
  }

  .vehicle-card {
    background: white;
    border-radius: 10px;
    padding: 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
  }

  .vehicle-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .vehicle-id {
    background: #4a3b54;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: bold;
  }

  .vehicle-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .info-section {
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .info-section h3 {
    color: #4a3b54;
    margin-bottom: 1rem;
  }

  .info-section p {
    margin: 0.5rem 0;
    color: #666;
  }

  .report-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
    width: 100%;
  }

  .report-btn:hover {
    background: #c82333;
  }
</style>
