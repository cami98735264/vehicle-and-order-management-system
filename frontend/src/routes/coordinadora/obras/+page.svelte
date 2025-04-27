<script lang="ts">
  import { onMount } from "svelte";
  import axiosInstance from "../../../utils/axiosInstance";
  import DashboardLayout from "../../../components/layout/dashboard/DashboardLayout.svelte";
  import HandleRoutes from "../../../components/auth/HandleRoutes.svelte";
  import Asignaciones from "../../../components/asignaciones/Asignaciones.svelte";

  // Tipos para las entidades
  interface Usuarios {
    id_usuario: number;
    nombre_usuario: string;
    email: string;
    id_rol: number;
    rol: {
      id_rol: number;
      nombre_rol: string;
      description: string;
    };
  }
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
    ultimo_mantenimiento: Date;
    proximo_mantenimiento: Date;
  }

  interface AsignacionObra {
    id_asignacion?: number;
    id_obra: number;
    id_vehiculo: number;
    fecha_asignacion: string;
    estado_obra: string;
    documento_finalizacion?: Blob;
    obra?: Obra;
    vehiculo?: Vehiculo;
  }

  // Estados iniciales
  let obras: Obra[] = [];
  let vehiculos: Vehiculo[] = [];
  let asignaciones: AsignacionObra[] = [];
  let obra: Obra = {
    nombre_obra: "",
    direccion: "",
    asesor_nombre: "",
    asesor_contacto: "",
    historial: [],
    fecha_inicio: new Date(),
    fecha_fin_estimada: new Date(),
    producto: "",
    cli: "",
    contacto_nombre: "",
    contacto_numero: "",
    prioridad: "Baja",
  };
  let vehiculo: Vehiculo = {
    modelo: "",
    placa: "",
    estado: "",
    tipo_vehiculo: "",
    historial: [],
    id_usuario: 0,
    ultimo_mantenimiento: new Date(),
    proximo_mantenimiento: new Date(),
  };
  let asignacion: AsignacionObra = {
    id_obra: 0,
    id_vehiculo: 0,
    fecha_asignacion: "",
    estado_obra: "",
    documento_finalizacion: new Blob(),
    obra: obra,
    vehiculo: vehiculo,
  };
  let showObraForm: boolean = false;
  let showVehiculoForm: boolean = false;
  let usuarios: Usuarios[] = [];
  let isEditVehiculos = false;
  let selectedFile: File | null = null;
  let isEditObras = false;
  let showAsignacionForm: boolean = false;
  let isEditAsignacion: boolean = false;
  let selectedVehiculo: Vehiculo = {
    modelo: "",
    placa: "",
    estado: "",
    tipo_vehiculo: "",
    historial: [],
    id_usuario: 0,
    ultimo_mantenimiento: new Date(),
    proximo_mantenimiento: new Date(),
  };
  // Fetch inicial de datos
  onMount(async () => {
    await fetchObras();
    await fetchVehiculos();
    await fetchAsignaciones();
    await fetchUsuarios();
  });

  // Fetch de usuarios
  const fetchUsuarios = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get<Usuarios[]>("users");
      usuarios = response.data;
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  // Fetch de obras
  const fetchObras = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get<Obra[]>("obras");
      obras = response.data;
    } catch (error) {
      console.error("Error al obtener las obras:", error);
    }
  };

  // Fetch de vehículos
  const fetchVehiculos = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get<Vehiculo[]>("vehiculos");
      vehiculos = response.data;
    } catch (error) {
      console.error("Error al obtener los vehículos:", error);
    }
  };

  // Fetch de asignaciones
  const fetchAsignaciones = async (): Promise<void> => {
    try {
      const response =
        await axiosInstance.get<AsignacionObra[]>("/asignacionobras");
      asignaciones = response.data;
    } catch (error) {
      console.error("Error al obtener las asignaciones:", error);
    }
  };

  // Crear o actualizar obra
  const saveObra = async (): Promise<void> => {
    try {
      if (obra.id_obra) {
        await axiosInstance.put(`obras/${obra.id_obra}`, obra);
      } else {
        await axiosInstance.post("obras", obra);
      }
      await fetchObras();
      resetObraForm();
    } catch (error) {
      console.error("Error al guardar la obra:", error);
    }
  };

  // Crear o actualizar vehículo
  const saveVehiculo = async (): Promise<void> => {
  try {
    if (selectedVehiculo.id_vehiculo) {
      // Update existing vehicle
      await axiosInstance.put(`vehiculos/${selectedVehiculo.id_vehiculo}`, selectedVehiculo);
    } else {
      // Create new vehicle
      await axiosInstance.post("vehiculos", selectedVehiculo);
    }
    await fetchVehiculos();
    resetVehiculoForm();
  } catch (error) {
    console.error("Error al guardar el vehículo:", error);
  }
};

const editVehiculo = async (): Promise<void> => {
  try {
    await axiosInstance.put(`vehiculos/${selectedVehiculo.id_vehiculo}`, selectedVehiculo);
    await fetchVehiculos();
    resetVehiculoForm();
  } catch (error) {
    console.error("Error al editar el vehículo:", error);
  }
};


  // Resetear formulario de obras
  const resetObraForm = (): void => {
    obra = {
      nombre_obra: "",
      direccion: "",
      asesor_nombre: "",
      asesor_contacto: "",
      historial: [],
      fecha_inicio: new Date(),
      fecha_fin_estimada: new Date(),
      producto: "",
      cli: "",
      contacto_nombre: "",
      contacto_numero: "",
      prioridad: "Baja",
    };
    showObraForm = false;
  };

  // Resetear formulario de vehículos
  const resetVehiculoForm = (): void => {
  selectedVehiculo = {
    modelo: "",
    placa: "",
    estado: "",
    tipo_vehiculo: "",
    historial: [],
    id_usuario: 0,
    ultimo_mantenimiento: new Date(),
    proximo_mantenimiento: new Date(),
  };
  showVehiculoForm = false;
};


  // Eliminar obra
  const deleteObra = async (id_obra: number): Promise<void> => {
    try {
      await axiosInstance.delete(`obras/${id_obra}`);
      await fetchObras();
    } catch (error) {
      console.error("Error al eliminar la obra:", error);
    }
  };

  const editObra = async (): Promise<void> => {
    try {
      await axiosInstance.put(`obras/${obra.id_obra}`, obra);
      await fetchObras();
      resetObraForm();
    } catch (error) {
      console.error("Error al editar la obra:", error);
    }
  };

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      selectedFile = target.files[0];
    }
  };
  const saveAsignacion = async (): Promise<void> => {
    try {
      const formData = new FormData();

      // Add all asignacion fields to formData
      Object.keys(asignacion).forEach((key) => {
        if (
          key !== "documento_finalizacion" &&
          key !== "obra" &&
          key !== "vehiculo"
        ) {
          let asignacionKey = key as keyof AsignacionObra;
          formData.append(key, asignacionKey);
        }
      });

      // Add file if present
      if (selectedFile) {
        formData.append("documento_finalizacion", selectedFile);
      }

      if (asignacion.id_asignacion) {
        await axiosInstance.put(
          `/asignacionobras/${asignacion.id_asignacion}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        await axiosInstance.post("/asignacionobras", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Update vehicle status
      const vehiculo = vehiculos.find(
        (v) => v.id_vehiculo === asignacion.id_vehiculo
      );
      if (vehiculo) {
        vehiculo.estado =
          asignacion.estado_obra === "Finalizada"
            ? "Disponible"
            : "En tránsito";
        await axiosInstance.put(`vehiculos/${vehiculo.id_vehiculo}`, vehiculo);
      }

      await fetchAsignaciones();
      await fetchVehiculos();
      resetAsignacionForm();
    } catch (error) {
      console.error("Error al guardar la asignación:", error);
    }
  };

  // Edit asignacion
  const editAsignacion = async (): Promise<void> => {
    try {
      const formData = new FormData();

      Object.keys(asignacion).forEach((key) => {
        if (
          key !== "documento_finalizacion" &&
          key !== "obra" &&
          key !== "vehiculo"
        ) {
          let asignacionKey = key as keyof AsignacionObra;
          formData.append(key, asignacionKey);
        }
      });

      if (selectedFile) {
        formData.append("documento_finalizacion", selectedFile);
      }

      await axiosInstance.put(
        `/asignacionobras/${asignacion.id_asignacion}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      await fetchAsignaciones();
      resetAsignacionForm();
    } catch (error) {
      console.error("Error al editar la asignación:", error);
    }
  };

  // Delete asignacion
  const deleteAsignacion = async (id_asignacion: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/asignacionobras/${id_asignacion}`);
      await fetchAsignaciones();
    } catch (error) {
      console.error("Error al eliminar la asignación:", error);
    }
  };

  // Reset asignacion form
  const resetAsignacionForm = (): void => {
    asignacion = {
      id_obra: 0,
      id_vehiculo: 0,
      fecha_asignacion: "",
      estado_obra: "",
      documento_finalizacion: new Blob(),
      obra: obra,
      vehiculo: vehiculo,
    };
    selectedFile = null;
    showAsignacionForm = false;
    isEditAsignacion = false;
  };

  // Download document
  const downloadDocument = async (id_asignacion: number): Promise<void> => {
    try {
      const response = await axiosInstance.get(
        `/asignacionobras/${id_asignacion}/documento`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `documento_finalizacion_${id_asignacion}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el documento:", error);
    }
  };
  const handleOnChangeVehiculoUsuario = (e: any) => {
    selectedVehiculo.id_usuario = e.target.value;
  };
  // Eliminar vehículo
  const deleteVehiculo = async (id_vehiculo: number): Promise<void> => {
    try {
      await axiosInstance.delete(`vehiculos/${id_vehiculo}`);
      await fetchVehiculos();
    } catch (error) {
      console.error("Error al eliminar el vehículo:", error);
    }
  };

</script>

<HandleRoutes allowedRoles={["Coordinadora"]} redirectUrl={"/login"}>
  <DashboardLayout>
    <div class="container">
      <h1>Gestión de Obras y Vehículos</h1>

      <!-- Gestión de Obras -->
      <section>
        <h2>Obras</h2>
        <button on:click={() => {
          showObraForm = !showObraForm;
          isEditObras = false;
          obra = {
            nombre_obra: "",
            direccion: "",
            asesor_nombre: "",
            asesor_contacto: "",
            historial: [],
            fecha_inicio: new Date(),
            fecha_fin_estimada: new Date(),
            producto: "",
            cli: "",
            contacto_nombre: "",
            contacto_numero: "",
            prioridad: "Baja",
          };
        }}
          >Crear Nueva Obra</button
        >
        {#if showObraForm}
          <form
            class="form"
            on:submit|preventDefault={isEditObras ? editObra : saveObra}
          >
            <input
              type="text"
              placeholder="Nombre de la Obra"
              bind:value={obra.nombre_obra}
              required
            />
            <input
              type="text"
              placeholder="Dirección"
              bind:value={obra.direccion}
              required
            />
            <input
              type="text"
              placeholder="Asesor Nombre"
              bind:value={obra.asesor_nombre}
              required
            />
            <input
              type="text"
              placeholder="Asesor Contacto"
              bind:value={obra.asesor_contacto}
              required
            />
            <input
              type="text"
              placeholder="Producto"
              bind:value={obra.producto}
              required
            />
            <input
              type="text"
              placeholder="Cliente"
              bind:value={obra.cli}
              required
            />
            <input
              type="text"
              placeholder="Contacto Nombre"
              bind:value={obra.contacto_nombre}
              required
            />
            <input
              type="text"
              placeholder="Contacto Número"
              bind:value={obra.contacto_numero}
              required
            />
            <label for="fecha_inicio">Fecha de Inicio</label>
            <input
              type="date"
              id="fecha_inicio"
              bind:value={obra.fecha_inicio}
              required
            />
            <label for="fecha_fin_estimada">Fecha de Fin Estimada</label>
            <input
              type="date"
              id="fecha_fin_estimada"
              bind:value={obra.fecha_fin_estimada}
              required
            />
            <select bind:value={obra.prioridad} required>
              <option value="" disabled selected>Selecciona la prioridad</option
              >
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>

            <button type="submit">Guardar</button>
          </form>
        {/if}
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Asesor</th>
              <th>Contacto</th>
              <th>Acciones</th>
              <th>Producto</th>
              <th>Cliente</th>
              <th>Contacto Nombre</th>
              <th>Contacto Número</th>
              <th>Estado de obra</th>
              <th>Prioridad</th>
            </tr>
          </thead>
          <tbody>
            {#each obras as ob}
              <tr>
                <td>{ob.nombre_obra}</td>
                <td>{ob.direccion}</td>
                <td>{ob.asesor_nombre}</td>
                <td>{ob.asesor_contacto}</td>
                <td class="actions">
                  <button
                    on:click={() => {
                      obra = { ...ob };
                      isEditObras = true;
                      showObraForm = true;
                    }}>Editar</button
                  >
                  <button on:click={() => deleteObra(ob.id_obra!)}
                    >Eliminar</button
                  >
                </td>
                <td>{ob.producto}</td>
                <td>{ob.cli}</td>
                <td>{ob.contacto_nombre}</td>
                <td>{ob.contacto_numero}</td>
                <td
                  >{(asignaciones.find((a) => a.id_obra === ob.id_obra)
                    ?.estado_obra) ? asignaciones.find((a) => a.id_obra === ob.id_obra)
                    ?.estado_obra : "No existe asignación para esta obra"}</td
                >
                <td>{ob.prioridad}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>

      <!-- Gestión de Vehículos -->
      <section>
        <h2>Vehículos</h2>
        <button on:click={() => {
          showVehiculoForm = !showVehiculoForm;
          isEditVehiculos = false;
          selectedVehiculo = {
            modelo: "",
            placa: "",
            estado: "",
            tipo_vehiculo: "",
            historial: [],
            id_usuario: 0,
            ultimo_mantenimiento: new Date(),
            proximo_mantenimiento: new Date(),
          };
        }}
          >Crear Nuevo Vehículo</button
        >
        {#if showVehiculoForm}
          <form
            class="form"
            on:submit|preventDefault={isEditVehiculos
              ? editVehiculo
              : saveVehiculo}
          >
            <input
              type="text"
              placeholder="Modelo"
              bind:value={selectedVehiculo.modelo}
              required
            />
            <input
              type="text"
              placeholder="Placa"
              bind:value={selectedVehiculo.placa}
              required
            />
            <label for="ultimo_mantenimiento">Último Mantenimiento</label>
            <input
              type="date"
              id="ultimo_mantenimiento"
              bind:value={selectedVehiculo.ultimo_mantenimiento}
              required
            />
            <label for="proximo_mantenimiento">Próximo Mantenimiento</label>
            <input
              type="date"
              id="proximo_mantenimiento"
              bind:value={selectedVehiculo.proximo_mantenimiento}
              required
            />

            <select on:change={handleOnChangeVehiculoUsuario} required>
              <option value="" disabled selected>Selecciona un usuario</option>
              {#each usuarios as usuario}
                <option value={usuario.id_usuario}
                  >{usuario.nombre_usuario}</option
                >
              {/each}
            </select>
            <select bind:value={selectedVehiculo.estado} required>
              <option value="" disabled selected>Selecciona el estado</option>
              <option value="Disponible">Disponible</option>
              <option value="En tránsito">En tránsito</option>
              <option value="Obra finalizada">Obra finalizada</option>
              <option value="Mantenimiento">Mantenimiento</option>
            </select>
            <select bind:value={selectedVehiculo.tipo_vehiculo} required>
              <option value="" disabled selected
                >Selecciona el tipo de vehículo</option
              >
              <option value="tractocamión">Tractocamión</option>
              <option value="doble troque">Doble Troque</option>
            </select>

            <button type="submit">Guardar</button>
          </form>
        {/if}
        <table class="table">
          <thead>
            <tr>
              <th>Modelo</th>
              <th>Placa</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Último Mantenimiento</th>
              <!-- Add column for Último Mantenimiento -->
              <th>Próximo Mantenimiento</th>
              <!-- Add column for Próximo Mantenimiento -->
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {#each vehiculos as vehiculo}
              <tr>
                <td>{vehiculo.modelo}</td>
                <td>{vehiculo.placa}</td>
                <td
                  >{usuarios.find((u) => u.id_usuario === vehiculo.id_usuario)
                    ?.nombre_usuario}</td
                >
                <td>{vehiculo.estado}</td>
                <td
                  >{vehiculo.ultimo_mantenimiento
                    ? new Date(
                        vehiculo.ultimo_mantenimiento
                      ).toLocaleDateString()
                    : "N/A"}</td
                >
                <!-- Display last maintenance date -->
                <td
                  >{vehiculo.proximo_mantenimiento
                    ? new Date(
                        vehiculo.proximo_mantenimiento
                      ).toLocaleDateString()
                    : "N/A"}</td
                >
                <!-- Display next maintenance date -->
                <td class="actions">
                  <button
                    on:click={() => {
                      selectedVehiculo = { ...vehiculo };
                      isEditVehiculos = true;
                      showVehiculoForm = true;
                    }}>Editar</button
                  >

                  <button on:click={() => deleteVehiculo(vehiculo.id_vehiculo!)}
                    >Eliminar</button
                  >
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </section>
      <Asignaciones />
    </div>
  </DashboardLayout>
</HandleRoutes>

<style globalThis>
  .container {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  .form {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  .table th,
  .table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  .table th {
    background-color: #f4f4f4;
  }
  .actions button {
    margin-right: 5px;
  }
  /* Estilo general */
  .container {
    padding: 2rem;
    font-family: "Arial", sans-serif;
    background-color: #f9f9f9;
    color: #333;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
  }

  h1,
  h2 {
    font-weight: bold;
    color: #222;
    margin-bottom: 1rem;
    text-align: center;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 1.5rem;
    margin-top: 2rem;
  }

  /* Botones generales */
  button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    color: white;
    background-color: #6a5acd;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #5845a2;
  }

  button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }

  button.secondary {
    background-color: white;
    color: #6a5acd;
    border: 2px solid #6a5acd;
  }

  button.secondary:hover {
    background-color: #f5f5f5;
  }

  /* Formularios */
  .form {
    background-color: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 1rem;
  }

  .form input {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    transition: border-color 0.3s ease;
  }

  .form input:focus {
    border-color: #6a5acd;
    outline: none;
    box-shadow: 0 0 3px rgba(106, 90, 205, 0.5);
  }

  .form button {
    width: 100%;
  }

  /* Tablas */
  .table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1.5rem;
    font-size: 0.9rem;
  }

  .table th,
  .table td {
    padding: 0.75rem;
    text-align: left;
    border: 1px solid #ddd;
  }

  .table th {
    background-color: #f4f4f4;
    color: #444;
    font-weight: bold;
  }

  .table tbody tr:nth-child(odd) {
    background-color: #fafafa;
  }

  .table tbody tr:hover {
    background-color: #f1f1f1;
  }

  .actions button {
    margin-right: 5px;
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }

  .actions button.secondary {
    padding: 0.5rem 1rem;
  }

  /* style for the select */
  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
  }

  /* style for the date input */
  input[type="date"] {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .form input {
      font-size: 0.9rem;
    }

    button {
      font-size: 0.9rem;
    }

    .table {
      font-size: 0.85rem;
    }

    .actions button {
      margin-bottom: 5px;
    }
  }

  .upload-section {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  input[type="file"] {
    font-size: 0.9rem;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .actions button {
    width: 100%;
    padding: 0.5rem;
    margin: 0;
  }
</style>
