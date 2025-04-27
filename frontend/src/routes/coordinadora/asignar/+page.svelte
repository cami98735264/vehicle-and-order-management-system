<script lang="ts">
  import DashboardLayout from "../../../components/layout/dashboard/DashboardLayout.svelte";
  import HandleRoutes from "../../../components/auth/HandleRoutes.svelte";
  import { toast } from "svelte-sonner";
  import axiosInstance from "../../../utils/axiosInstance";

  interface Obra {
      id_obra: number;
      nombre_obra: string;
      direccion: string;
      producto: string;
      prioridad: string;
  }

  interface Vehiculo {
      id_vehiculo: number;
      placa: string;
      modelo: string;
      estado: string;
      tipo_vehiculo: string;
  }

  interface AsignacionObra {
      id_asignacion: number;
      id_obra: number;
      id_vehiculo: number;
      fecha_asignacion: string;
      estado_obra: string;
      documento_finalizacion: string | null;
      obra: Obra;
      vehiculo: Vehiculo;
  }

  let pendingWorks: Obra[] = [];
  let availableVehicles: Vehiculo[] = [];
  let assignments: AsignacionObra[] = [];
  let selectedWork: number | null = null;
  let selectedVehicles: number[] = [];

  const fetchData = async (): Promise<void> => {
      try {
          const [worksRes, vehiclesRes, assignmentsRes] = await Promise.all([
              axiosInstance.get<Obra[]>("/obras"),
              axiosInstance.get<Vehiculo[]>("/vehiculos"),
              axiosInstance.get<AsignacionObra[]>("/asignacionobras"),
          ]);

          pendingWorks = worksRes.data;
          availableVehicles = vehiclesRes.data.filter(vehicle => vehicle.estado === "Disponible");
          assignments = assignmentsRes.data;
          console.log("Es:", assignments);
      } catch (error) {
          console.error(error);
          toast.error("Error al cargar los datos");
      }
  };

  fetchData();

  const handleAssignment = async (): Promise<void> => {
      if (!selectedWork || selectedVehicles.length === 0) {
          toast.error("Debes seleccionar una obra y al menos un vehículo");
          return;
      }

      try {
          await Promise.all(
              selectedVehicles.map(vehicleId =>
                  axiosInstance.post("/asignacionobras", {
                      id_obra: selectedWork,
                      id_vehiculo: vehicleId,
                  })
              )
          );

          toast.success("Asignación realizada exitosamente");
          selectedWork = null;
          selectedVehicles = [];
          await fetchData();
      } catch (error) {
          console.error(error);
          toast.error("Error al realizar la asignación");
      }
  };

  const updateAssignmentStatus = async (id: number, nuevoEstado: string): Promise<void> => {
      try {
          await axiosInstance.put(`/asignacionobras/${id}/estado`, { nuevo_estado: nuevoEstado });
          toast.success("Estado actualizado exitosamente");
          await fetchData();
      } catch (error) {
          console.error(error);
          toast.error("Error al actualizar el estado");
      }
  };

  const uploadFinalizationDocument = async (id: number, file: File): Promise<void> => {
      const formData = new FormData();
      formData.append("documento", file);

      try {
          await axiosInstance.put(`/asignacionobras/${id}/upload`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
          });
          toast.success("Documento cargado exitosamente");
          await fetchData();
      } catch (error) {
          console.error(error);
          toast.error("Error al cargar el documento");
      }
  };
</script>

<HandleRoutes redirectUrl="/login" allowedRoles={["Coordinadora"]}>
  <DashboardLayout>
      <div class="container">
          <h1>Asignación de Vehículos</h1>

          <div class="assignment-grid">
              <section class="works-section">
                  <h2>Obras Pendientes</h2>
                  <div class="works-list">
                      {#if pendingWorks.length > 0}
                          {#each pendingWorks as work}
                              <div class="work-card" class:selected={selectedWork === work.id_obra}>
                                  <label class="work-selector">
                                      <input 
                                          type="radio" 
                                          name="work" 
                                          value={work.id_obra}
                                          bind:group={selectedWork}
                                      />
                                      <div class="work-details">
                                          <h3>{work.nombre_obra}</h3>
                                          {#if work.prioridad === "Alta"}
                                              <span class="priority-badge priority-alta">Alta</span>
                                          {:else if work.prioridad === "Media"}
                                              <span class="priority-badge priority-media">Media</span>
                                          {:else}
                                              <span class="priority-badge priority-baja">Baja</span>
                                          {/if}
                                          <p><strong>Dirección:</strong> {work.direccion}</p>
                                          <p><strong>Producto:</strong> {work.producto}</p>
                                      </div>
                                  </label>
                              </div>
                          {/each}
                      {:else}
                          <p>No hay obras pendientes</p>
                      {/if}
                  </div>
              </section>

              <section class="vehicles-section">
                  <h2>Vehículos Disponibles</h2>
                  <div class="vehicles-list">
                      {#if availableVehicles.length > 0}
                          {#each availableVehicles as vehicle}
                              <div class="vehicle-card" class:selected={selectedVehicles.includes(vehicle.id_vehiculo)}>
                                  <label class="vehicle-selector">
                                      <input 
                                          type="checkbox" 
                                          value={vehicle.id_vehiculo}
                                          bind:group={selectedVehicles}
                                      />
                                      <div class="vehicle-details">
                                          <h3>{vehicle.placa}</h3>
                                          <p><strong>Modelo:</strong> {vehicle.modelo}</p>
                                          <p><strong>Estado:</strong> {vehicle.estado}</p>
                                          <p><strong>Tipo:</strong> {vehicle.tipo_vehiculo}</p>
                                      </div>
                                  </label>
                              </div>
                          {/each}
                      {:else}
                          <p>No hay vehículos disponibles</p>
                      {/if}
                  </div>
              </section>
          </div>

          <section class="assignments-section">
              <h2>Asignaciones Actuales</h2>
              <ul class="assignments-list">
                  {#if assignments.length > 0}
                      {#each assignments as assignment}
                          <li>
                              <p>Obra: {assignment.obra.nombre_obra}</p>
                              <p>Vehículo: {assignment.vehiculo.placa}</p>
                              <p>Estado: {assignment.estado_obra}</p>
                              <button on:click={() => updateAssignmentStatus(assignment.id_asignacion, "Obra finalizada")}>
                                  Finalizar Obra
                              </button>
                              <input
                              type="file"
                              accept=".pdf"
                              on:change={(e) => {
                                const input = e.target as HTMLInputElement;
                                if (input?.files?.[0]) {
                                  uploadFinalizationDocument(assignment.id_obra, input.files[0]);
                                }
                              }}
                            />
                          </li>
                      {/each}
                  {:else}
                      <p>No hay asignaciones actuales</p>
                  {/if}
              </ul>
          </section>

          <div class="action-bar">
              <button on:click={handleAssignment}>Asignar Vehículos</button>
          </div>
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

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #4a5568;
  }

  .assignment-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .works-list, .vehicles-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 70vh;
    overflow-y: auto;
    padding-right: 1rem;
  }

  .work-card, .vehicle-card {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    border: 2px solid transparent;
  }

  .work-card:hover, .vehicle-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .work-card.selected, .vehicle-card.selected {
    border: 2px solid #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .work-selector, .vehicle-selector {
    display: flex;
    padding: 1rem;
    cursor: pointer;
    width: 100%;
  }

  .work-selector input, .vehicle-selector input {
    margin-right: 1rem;
    cursor: pointer;
  }

  .work-details, .vehicle-details {
    flex: 1;
  }

  .work-details p, .vehicle-details p {
    margin: 0.5rem 0;
    color: #4b5563;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #2d3748;
  }

  .label {
    font-weight: 500;
    color: #4b5563;
    min-width: 80px;
    display: inline-block;
  }

  .priority-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .priority-alta {
    background-color: #fee2e2;
    color: #991b1b;
  }

  .priority-media {
    background-color: #fef3c7;
    color: #92400e;
  }

  .priority-baja {
    background-color: #dcfce7;
    color: #166534;
  }

  .action-bar {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
    padding: 1rem;
    background-color: white;
    border-top: 1px solid #e5e7eb;
    position: sticky;
    bottom: 0;
  }

  .assign-button {
    background-color: #2563eb;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .assign-button:hover {
    background-color: #1d4ed8;
  }
  
  .assign-button:focus {
    outline: none;
  }
  
  .assign-button:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }

  /* Scrollbar styles */
  .works-list::-webkit-scrollbar,
  .vehicles-list::-webkit-scrollbar {
    width: 6px;
  }

  .works-list::-webkit-scrollbar-track,
  .vehicles-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  .works-list::-webkit-scrollbar-thumb,
  .vehicles-list::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  .works-list::-webkit-scrollbar-thumb:hover,
  .vehicles-list::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  @media (max-width: 768px) {
    .assignment-grid {
      grid-template-columns: 1fr;
    }

    .container {
      padding: 1rem;
    }

    .works-list, .vehicles-list {
      max-height: 50vh;
    }
  }


  /* style for assignments section */
  .assignments-section {
    margin-top: 2rem;
  }

  .assignments-list {
    list-style-type: none;
    padding: 0;
  }

  .assignments-list li {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .assignments-list li input {
    display: none;
  }

  .assignments-list li:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .assignments-list li p {
    margin: 0.5rem 0;
    color: #4b5563;
  }

  .assignments-list li button {
    background: #f87171;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .assignments-list li button:hover {
    background: #ef4444;
  }

  .assignments-list li input[type="file"] {
    display: none;
  }

  .assignments-list li input[type="file"] + label {
    background: #2563eb;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background 0.2s;
  }


  /* style for action bar */

  .action-bar {
    background: white;
    border-top: 1px solid #e5e7eb;
    padding: 1rem;
    position: sticky;
    bottom: 0;
  }

  .action-bar button {
    background: #2563eb;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    border: none;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .action-bar button:hover {
    background: #1d4ed8;
  }

  .action-bar button:disabled {
    background: #93c5fd;
    cursor: not-allowed;
  }

  .action-bar button:focus {
    outline: none;
  }

  /* style for priority badge */

  
</style>

