<script lang="ts">
  import { onMount } from "svelte";
  import axiosInstance from "../../utils/axiosInstance";

  interface Obra {
    id_obra?: number;
    nombre_obra: string;
    direccion: string;
    historial: string[];
    producto: string;

  }

  interface Vehiculo {
    id_vehiculo?: number;
    modelo: string;
    placa: string;
    estado: string;
  }

  interface AsignacionObra {
    id_asignacion?: number;
    id_obra: number;
    id_vehiculo: number;
    fecha_asignacion: string;
    estado_obra: string;
    documento_finalizacion?: any;
    documento_url?: string;
    obra?: Obra;
    vehiculo?: Vehiculo;
  }

  let obras: Obra[] = [];
  let vehiculos: Vehiculo[] = [];
  let asignaciones: AsignacionObra[] = [];
  let showAsignacionForm = false;
  let isEditAsignacion = false;
  let filteredAsignaciones: AsignacionObra[] = [];

  let asignacion: AsignacionObra = {
    id_obra: 0,
    id_vehiculo: 0,
    fecha_asignacion: new Date().toISOString().split("T")[0],
    estado_obra: "En tránsito",
  };

  let filters = {
    obra: 0,
    vehiculo: 0,
    estado: "",
    fechaAsignacion: "",
  };

  onMount(async () => {
    await Promise.all([fetchObras(), fetchVehiculos(), fetchAsignaciones()]);
  });

  const fetchObras = async () => {
    try {
      const response = await axiosInstance.get<Obra[]>("/obras");
      obras = response.data;
    } catch (error) {
      console.error("Error al obtener las obras:", error);
    }
  };

  const fetchVehiculos = async () => {
    try {
      const response = await axiosInstance.get<Vehiculo[]>("/vehiculos");
      vehiculos = response.data;
    } catch (error) {
      console.error("Error al obtener los vehículos:", error);
    }
  };

  const fetchAsignaciones = async () => {
    try {
      const response =
        await axiosInstance.get<AsignacionObra[]>("/asignacionobras");
      asignaciones = response.data;
      filteredAsignaciones = [...asignaciones];
    } catch (error) {
      console.error("Error al obtener las asignaciones:", error);
    }
  };

  const filterAsignaciones = () => {
    filteredAsignaciones = asignaciones.filter((asig) => {
      return (
        // Filtro de obra: aseguramos que filters.obra sea un número antes de comparar
        (!filters.obra || asig.obra?.id_obra === filters.obra) &&
        // Filtro de vehículo: aseguramos que filters.vehiculo sea un número antes de comparar
        (!filters.vehiculo ||
          asig.vehiculo?.id_vehiculo === filters.vehiculo) &&
        // Filtro de estado
        (!filters.estado ||
          (asig.estado_obra &&
            asig.estado_obra
              .toLowerCase()
              .includes(filters.estado.toLowerCase()))) &&
        // Filtro de fecha
        (!filters.fechaAsignacion ||
          new Date(asig.fecha_asignacion).toLocaleDateString() ===
            new Date(filters.fechaAsignacion).toLocaleDateString())
      );
    });
  };

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      asignacion.documento_finalizacion = target.files[0];
    }
  };

  const saveAsignacion = async () => {
    try {
      if (!asignacion.id_obra || !asignacion.id_vehiculo) {
        alert("Por favor complete todos los campos requeridos");
        return;
      }

      await axiosInstance.post("/asignacionobras", {
        id_obra: asignacion.id_obra,
        id_vehiculo: asignacion.id_vehiculo,
        estado_obra: asignacion.estado_obra,
      });

      await fetchAsignaciones();
      resetAsignacionForm();
    } catch (error) {
      console.error("Error al guardar la asignación:", error);
      alert("Error al crear la asignación");
    }
  };

  const uploadDocumento = async (id_asignacion: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("documento", file);

      const response = await axiosInstance.put(
        `/asignacionobras/${id_asignacion}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const asignacionIndex = asignaciones.findIndex(
        (a) => a.id_asignacion === id_asignacion
      );
      if (asignacionIndex !== -1) {
        asignaciones[asignacionIndex].documento_finalizacion = file;
        asignaciones = [...asignaciones]; // Trigger reactivity
      }

      await fetchAsignaciones();
    } catch (error) {
      console.error("Error al subir el documento:", error);
      alert("Error al subir el documento");
    }
  };

  const downloadDocumento = (
    bufferObj: { type: string; data: number[] },
    nombre_obra: string
  ) => {
    try {
      if (!bufferObj || !bufferObj.data) {
        throw new Error("El buffer es inválido o está vacío.");
      }

      const arrayBuffer = new Uint8Array(bufferObj.data).buffer;
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileName = `documento_finalizacion_${nombre_obra.replace(/\s+/g, "_")}.pdf`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el documento:", error);
      alert("Error al descargar el documento");
    }
  };

  const cambiarEstado = async () => {
    try {
      if (!asignacion.id_asignacion) return;

      await axiosInstance.put(
        `/asignacionobras/${asignacion.id_asignacion}/estado`,
        { nuevo_estado: asignacion.estado_obra }
      );

      if (
        asignacion.estado_obra === "obra finalizada" &&
        asignacion.documento_finalizacion
      ) {
        await uploadDocumento(
          asignacion.id_asignacion,
          asignacion.documento_finalizacion
        );
      }

      await fetchAsignaciones();
      resetAsignacionForm();
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      alert("Error al actualizar el estado");
    }
  };

  const resetAsignacionForm = () => {
    asignacion = {
      id_obra: 0,
      id_vehiculo: 0,
      fecha_asignacion: new Date().toISOString().split("T")[0],
      estado_obra: "En tránsito",
    };
    showAsignacionForm = false;
    isEditAsignacion = false;
  };
</script>

<div class="container">
  <h2>Asignaciones de Obras</h2>

  <!-- Filtro -->
  <div class="filter-form">
    <!-- Filtro de Obra -->
    <select bind:value={filters.obra} on:change={filterAsignaciones}>
      <option value="" selected>Seleccionar Obra</option>
      {#each obras as obra}
        <option value={obra.id_obra}>{obra.nombre_obra}</option>
      {/each}
    </select>
  
    <!-- Filtro de Vehículo -->
    <select bind:value={filters.vehiculo} on:change={filterAsignaciones}>
      <option value="" selected>Seleccionar Vehículo</option>
      {#each vehiculos as vehiculo}
        <option value={vehiculo.id_vehiculo}>
          {vehiculo.placa} - {vehiculo.modelo}
        </option>
      {/each}
    </select>
  
    <!-- Filtro de Estado -->
    <select bind:value={filters.estado} on:change={filterAsignaciones}>
      <option value="">Seleccionar Estado</option>
      <option value="En tránsito">En tránsito</option>
      <option value="Obra finalizada">Obra finalizada</option>
    </select>
  
    <!-- Filtro de Fecha -->
    <input
      type="date"
      bind:value={filters.fechaAsignacion}
      on:change={filterAsignaciones}
    />
  </div>
  
  {#if showAsignacionForm}
    <form
      class="form"
      on:submit|preventDefault={isEditAsignacion
        ? cambiarEstado
        : saveAsignacion}
    >
      <div class="form-group">
        <label for="obra">Obra:</label>
        <select
          id="obra"
          bind:value={asignacion.id_obra}
          disabled={isEditAsignacion}
          required
        >
          <option value="">Seleccione una obra</option>
          {#each obras as obra}
            <option value={obra.id_obra}>{obra.nombre_obra}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label for="vehiculo">Vehículo:</label>
        <select
          id="vehiculo"
          bind:value={asignacion.id_vehiculo}
          disabled={isEditAsignacion}
          required
        >
          <option value="">Seleccione un vehículo</option>
          {#each vehiculos.filter((v) => v.estado === "Disponible" || v.id_vehiculo === asignacion.id_vehiculo) as vehiculo}
            <option value={vehiculo.id_vehiculo}
              >{vehiculo.placa} - {vehiculo.modelo}</option
            >
          {/each}
        </select>
      </div>

      {#if isEditAsignacion}
        <div class="form-group">
          <label for="estado">Estado:</label>
          <select id="estado" bind:value={asignacion.estado_obra} required>
            <option value="En tránsito">En tránsito</option>
            <option value="obra finalizada">Finalizada</option>
          </select>
        </div>

        {#if asignacion.estado_obra === "obra finalizada"}
          <div class="form-group">
            <label for="documento">Documento de finalización (PDF):</label>
            <input
              type="file"
              id="documento"
              accept=".pdf"
              on:change={handleFileChange}
              required
            />
          </div>
        {/if}
      {/if}

      <button type="submit">
        {isEditAsignacion ? "Actualizar Estado" : "Crear Asignación"}
      </button>
    </form>
  {/if}

  <table class="table">
    <thead>
      <tr>
        <th>Obra</th>
        <th>Vehículo</th>
        <th>Tipo de producto</th>
        <th>Cantidad de producto</th>
        <th>Estado</th>
        <th>Fecha Asignación</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each filteredAsignaciones as asig}
        <tr>
          <td>{asig.obra?.nombre_obra}</td>
          <td>{asig.vehiculo?.placa} - {asig.vehiculo?.modelo}</td>
            <td>{asig.obra?.producto}</td>
            <td>1</td>

          <td>{asig.estado_obra}</td>
          <td>{new Date(asig.fecha_asignacion).toLocaleDateString()}</td>
          <td class="actions">
            <button
              on:click={() => {
                asignacion = { ...asig };
                isEditAsignacion = true;
                showAsignacionForm = true;
              }}
            >
              Cambiar Estado
            </button>

            {#if asig.estado_obra === "Obra finalizada" && asig.documento_finalizacion && asig.documento_finalizacion !== undefined}
              <button
                class="download-btn"
                on:click={() =>
                  downloadDocumento(
                    asig.documento_finalizacion!,
                    asig.obra?.nombre_obra || "obra"
                  )}
              >
                Descargar Documento
              </button>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .container {
    margin-top: 40px;
  }

  .form {
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 1rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  select,
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-top: 0.25rem;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }

  .table th,
  .table td {
    padding: 0.75rem;
    border: 1px solid #ddd;
    text-align: left;
  }

  .table th {
    background-color: #f5f5f5;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background-color: #4caf50;
    color: white;
    cursor: pointer;
  }

  button:hover {
    background-color: #45a049;
  }

  .delete-btn {
    background-color: #f44336;
  }

  .delete-btn:hover {
    background-color: #da190b;
  }

  .download-btn {
    background-color: #2196f3;
  }

  .download-btn:hover {
    background-color: #1976d2;
  }

  .filter-form {
    margin-bottom: 1rem;
  }

  .filter-form select,
  .filter-form input[type="date"] {
    width: 200px;
    margin-right: 1rem;
  }
</style>
