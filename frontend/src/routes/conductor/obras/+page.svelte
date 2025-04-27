<script lang="ts">
  import HandleRoutes from "../../../components/auth/HandleRoutes.svelte";
  import DashboardLayout from "../../../components/layout/dashboard/DashboardLayout.svelte";
  import { toast } from "svelte-sonner";
  import axiosInstance from "../../../utils/axiosInstance";
  import { onMount } from "svelte";

  interface Obra {
    id_obra?: number;
    nombre_obra: string;
    direccion: string;
    asesor_nombre: string;
    asesor_contacto: string;
    historial: string[];
    fecha_inicio: Date;
    fecha_fin_estimada: Date;
    producto: string;
    cli: string;
    prioridad: "Baja" | "Media" | "Alta";
    contacto_nombre: string;
    contacto_numero: string;
  }

  interface Vehiculo {
    id_vehiculo?: number;
    id_usuario: number;
    modelo: string;
    placa: string;
    estado: string;
    tipo_vehiculo: string;
    historial: string[];
  }

  interface AsignacionObra {
    id_asignacion?: number;
    id_obra: number;
    id_vehiculo: number;
    fecha_asignacion: string;
    estado_obra: "Disponible" | "En tránsito" | "Obra finalizada";
    documento_finalizacion?: Blob;
    obra?: Obra;
    vehiculo?: Vehiculo;
  }

  let obrasAsignadas: AsignacionObra[] = [];
  let loadingId: number | null = null; // ID de la obra que está cargando

  const obtenerAsignaciones = async () => {
  try {
    const response = await axiosInstance.get("/asignacionobras");
    
    // Sort to show "En tránsito" and "Disponible" first
    obrasAsignadas = response.data.sort((a: AsignacionObra, b: AsignacionObra) => {
      // Check for "En tránsito" and "Disponible" first
      const estadoA = a.estado_obra.toLowerCase();
      const estadoB = b.estado_obra.toLowerCase();

      // Prioritize "En tránsito" and "Disponible"
      if ((estadoA === "en tránsito" || estadoA === "disponible") && 
          !(estadoB === "en tránsito" || estadoB === "disponible")) {
        return -1; // a comes first
      }
      if (!(estadoA === "en tránsito" || estadoA === "disponible") && 
          (estadoB === "en tránsito" || estadoB === "disponible")) {
        return 1; // b comes first
      }

      return 0; // No change for same state
    });
    console.log("Obras asignadas:", obrasAsignadas);
  } catch (error) {
    console.error("Error al obtener las asignaciones:", error);
    toast.error("No se pudieron cargar las obras asignadas");
  }
};



  const cambiarEstado = async (
    obraId: number,
    nuevoEstado: "En tránsito" | "Obra finalizada"
  ) => {
    loadingId = obraId; // Start the loading process for this obra
    try {
      await axiosInstance.put(`/asignacionobras/${obraId}/estado`, {
        nuevo_estado: nuevoEstado,
      });

      // Update the state of the assignment locally
      obrasAsignadas = obrasAsignadas.map((obra) =>
        obra.id_asignacion === obraId
          ? { ...obra, estado_obra: nuevoEstado }
          : obra
      );
      toast.success(`Estado actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      toast.error("Error al actualizar el estado");
    } finally {
      loadingId = null; // End the loading process
    }
  };

  const finalizarObra = (obraId: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        toast.error("Debe seleccionar un archivo para finalizar la obra.");
        return;
      }

      const formData = new FormData();
      formData.append("documento", file);

      loadingId = obraId;
      try {
        await axiosInstance.put(`/asignacionobras/${obraId}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        await cambiarEstado(obraId, "Obra finalizada");
        toast.success(`Documentación "${file.name}" subida correctamente.`);
      } catch (error) {
        console.error("Error al finalizar la obra:", error);
        toast.error("Error al subir la documentación");
      } finally {
        loadingId = null;
      }
    };
    input.click();
  };

  const manejarAccion = async (asignacion: AsignacionObra) => {
    if (asignacion.estado_obra === "Disponible") {
      await cambiarEstado(asignacion.id_asignacion!, "En tránsito");
    } else if (asignacion.estado_obra === "En tránsito") {
      await finalizarObra(asignacion.id_asignacion!);
    }
  };

  onMount(() => {
    obtenerAsignaciones();
  });
</script>

<HandleRoutes redirectUrl="/login" allowedRoles={["Conductor"]}>
  <DashboardLayout>
    <div class="obras-container">
      <h1>Mis Obras Asignadas</h1>
      <div class="obras-grid">
        {#if obrasAsignadas.length === 0}
          <p>No tienes obras asignadas.</p>
        {/if}

        {#each obrasAsignadas as asignacion}
          <div class="obra-card">
            <h2>{asignacion.obra?.nombre_obra || "Sin título"}</h2>
            <div class="obra-details">
              <p>
                <strong>Dirección:</strong>
                {asignacion.obra?.direccion || "No especificada"}
              </p>
              <p>
                <strong>Producto:</strong>
                {asignacion.obra?.producto || "No especificado"}
              </p>
              <p>
                <strong>Fecha:</strong>
                {asignacion.fecha_asignacion || "No disponible"}
              </p>
              <p><strong>Estado actual:</strong> {asignacion.estado_obra}</p>
            </div>
            <div class="obra-actions">
              <button
                class="action-btn"
                on:click={() => manejarAccion(asignacion)}
                disabled={asignacion.estado_obra === "Obra finalizada" ||
                  loadingId === asignacion.id_asignacion}
              >
                {asignacion.estado_obra === "Disponible"
                  ? "Iniciar obra"
                  : asignacion.estado_obra === "En tránsito"
                  ? "Finalizar obra"
                  : "Obra finalizada"}
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </DashboardLayout>
</HandleRoutes>
<style>
  .obras-container {
    padding: 2rem;
    width: 100%;
    max-width: 1200px;
  }

  h1 {
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
  }

  .obras-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .obra-card {
    background: white;
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .obra-card h2 {
    color: #4a3b54;
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  .obra-details {
    margin-bottom: 1.5rem;
  }

  .obra-details p {
    margin: 0.5rem 0;
    color: #666;
  }

  .obra-actions {
    display: flex;
    justify-content: center;
  }

  .action-btn {
    background: #4a3b54;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    transition: background 0.3s ease;
  }

  .action-btn:hover {
    background: #5d4a6c;
  }

  .action-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
</style>
