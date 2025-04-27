<script lang="ts">
  import DashboardLayout from "../../../components/layout/dashboard/DashboardLayout.svelte";
  import HandleRoutes from "../../../components/auth/HandleRoutes.svelte";
  import axiosInstance from "../../../utils/axiosInstance";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  interface Vehicle {
    id_vehiculo: number;
    placa: string;
    modelo: string;
    estado: string;
    id_usuario: number;
    tipo_vehiculo: string;
    historial: Array<any>;
    usuario: {
      nombre_usuario: string;
      email: string;
    };
  }

  let vehicles: Vehicle[] = [];
  let isLoading = true;
  let error = "";

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "en tránsito":
        return "status-transit";
      case "en obra":
        return "status-working";
      case "disponible":
        return "status-available";
      case "obra finalizada":
        return "status-finished";
      default:
        return "status-default";
    }
  };

  const viewLocation = (vehicleId: number) => {
    goto(`/vehiculos/${vehicleId}`);
  };

  onMount(async () => {
    try {
      const response = await axiosInstance.get("/vehiculos");
      vehicles = response.data;
    } catch (err) {
      error = "Error al cargar los datos de los vehículos.";
      console.error(err);
    } finally {
      isLoading = false;
    }
  });
</script>

<HandleRoutes redirectUrl="/login" allowedRoles={["Coordinadora"]}>
  <DashboardLayout>
    <div class="container">
      <h1>Estado de Vehículos</h1>

      {#if isLoading}
        <p>Cargando vehículos...</p>
      {:else if error}
        <p class="error-message">{error}</p>
      {:else if vehicles.length === 0}
        <p>No hay vehículos disponibles.</p>
      {:else}
        <div class="vehicle-grid">
          {#each vehicles as vehicle}
            <div class="vehicle-card">
              <div class="vehicle-header">
                <h2>{vehicle.placa}</h2>
                <span class={`status-badge ${getStatusColor(vehicle.estado)}`}>
                  {vehicle.estado}
                </span>
              </div>

              <div class="vehicle-info">
                <p><span class="label">Modelo:</span> {vehicle.modelo}</p>
                <p>
                  <span class="label">Conductor:</span>
                  {vehicle.usuario.nombre_usuario}
                </p>
                <p>
                  <span class="label">Tipo de vehículo:</span>
                  {vehicle.tipo_vehiculo}
                </p>
              </div>

              <div class="vehicle-footer">
                <button
                  class="details-button"
                  on:click={() => viewLocation(vehicle.id_vehiculo)}
                >
                  Ver ubicación
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </DashboardLayout>
</HandleRoutes>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
    color: #333;
  }

  .vehicle-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .vehicle-card {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
  }

  .vehicle-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .vehicle-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
  }

  .status-transit {
    background-color: #fef3c7;
    color: #92400e;
  }

  .status-working {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .status-available {
    background-color: #dcfce7;
    color: #166534;
  }

  .status-finished {
    background-color: #f3e8ff;
    color: #7c3aed;
  }

  .vehicle-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .label {
    font-weight: 500;
    color: #4b5563;
  }

  .vehicle-footer {
    margin-top: 1.5rem;
    display: flex;
    justify-content: flex-end;
  }

  .details-button {
    background-color: #2563eb;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .details-button:hover {
    background-color: #1d4ed8;
  }

  .error-message {
    color: red;
    font-weight: bold;
  }
</style>
