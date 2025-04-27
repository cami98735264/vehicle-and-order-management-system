<script lang="ts">
    import { onMount } from 'svelte';
    import axiosInstance from '../../../utils/axiosInstance';
    import HandleRoutes from '../../../components/auth/HandleRoutes.svelte';
  import DashboardLayout from '../../../components/layout/dashboard/DashboardLayout.svelte';
    
    interface Rol {
      id_rol: number;
      nombre_rol: string;
    }
  
    interface Usuario {
      id_usuario: number;
      nombre_usuario: string;
      email: string;
      id_rol: number;
      rol: Rol;
    }
  
    let usuarios: Usuario[] = [];
    let loading: boolean = true;
    let error: string | null = null;
  
    // Form state
    let editingUser: Usuario | null = null;
    let newUser = {
      nombre_usuario: '',
      email: '',
      password: '',
      id_rol: 1
    };
  
    onMount(async () => {
      try {
        const response = await axiosInstance.get('/users');
        usuarios = response.data;
      } catch (err) {
        error = 'Error al cargar usuarios';
      } finally {
        loading = false;
      }
    });
  
    async function handleCreate() {
      try {
        const response = await axiosInstance.post('/users', newUser);
        usuarios = [...usuarios, response.data.usuario];
        newUser = {
          nombre_usuario: '',
          email: '',
          password: '',
          id_rol: 1
        };
      } catch (err) {
        error = 'Error al crear usuario';
      }
    }
  
    async function handleUpdate(usuario: Usuario) {
      try {
        const response = await axiosInstance.put(`users/${usuario.id_usuario}`, {
          nombre_usuario: usuario.nombre_usuario,
          email: usuario.email,
          id_rol: usuario.id_rol
        });
        usuarios = usuarios.map(u => u.id_usuario === usuario.id_usuario ? response.data.usuario : u);
        editingUser = null;
      } catch (err) {
        error = 'Error al actualizar usuario';
      }
    }
  
    async function handleDelete(id: number) {
      if (!confirm('¿Está seguro de eliminar este usuario?')) return;
      
      try {
        await axiosInstance.delete(`users/${id}`);
        usuarios = usuarios.filter(u => u.id_usuario !== id);
      } catch (err) {
        error = 'Error al eliminar usuario';
      }
    }
  </script>
  
  <style>
    .container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  
    .users-grid {
      display: grid;
      gap: 1rem;
      margin-top: 2rem;
    }
  
    .user-card {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  
    .form {
      display: grid;
      gap: 1rem;
      max-width: 500px;
      margin: 2rem 0;
    }
  
    .input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  
    .button {
      padding: 0.5rem 1rem;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  
    .button:hover {
      background: #45a049;
    }
  
    .button.delete {
      background: #f44336;
    }
  
    .button.delete:hover {
      background: #da190b;
    }
  
    .error {
      color: #f44336;
      padding: 1rem;
      background: #ffebee;
      border-radius: 4px;
      margin: 1rem 0;
    }
  </style>
  
<HandleRoutes allowedRoles={["Administrador"]} redirectUrl={"/login"}>
    <DashboardLayout>
        <div class="container">
            <h1>Administración de Usuarios</h1>
          
            {#if error}
              <div class="error">{error}</div>
            {/if}
          
            <!-- Formulario de nuevo usuario -->
            <form class="form" on:submit|preventDefault={handleCreate}>
              <h2>Nuevo Usuario</h2>
              <input
                class="input"
                type="text"
                bind:value={newUser.nombre_usuario}
                placeholder="Nombre de usuario"
                required
              />
              <input
                class="input"
                type="email"
                bind:value={newUser.email}
                placeholder="Email"
                required
              />
              <input
                class="input"
                type="password"
                bind:value={newUser.password}
                placeholder="Contraseña"
                required
              />
              <select class="input" bind:value={newUser.id_rol}>
                <option value={1}>Coordinadora</option>
                <option value={2}>Conductor</option>
              </select>
              <button class="button" type="submit">Crear Usuario</button>
            </form>
          
            <!-- Lista de usuarios -->
            {#if "loading"!=="loading"}
              <p>Cargando...</p>
            {:else}
              <div class="users-grid">
                {#each usuarios as usuario (usuario.id_usuario)}
                  <div class="user-card">
                    {#if editingUser?.id_usuario === usuario.id_usuario}
                      <form class="form" on:submit|preventDefault={() => handleUpdate(usuario)}>
                        <input
                          class="input"
                          type="text"
                          bind:value={usuario.nombre_usuario}
                          placeholder="Nombre de usuario"
                        />
                        <input
                          class="input"
                          type="email"
                          bind:value={usuario.email}
                          placeholder="Email"
                        />
                        <select class="input" bind:value={usuario.id_rol}>
                          <option value={1}>Coordinadora</option>
                          <option value={2}>Conductor</option>
                        </select>
                        <button class="button" type="submit">Guardar</button>
                        <button
                          class="button"
                          type="button"
                          on:click={() => editingUser = null}
                        >
                          Cancelar
                        </button>
                      </form>
                    {:else}
                      <h3>{usuario.nombre_usuario}</h3>
                      <p>Email: {usuario.email}</p>
                      <p>Rol: {usuario.rol.nombre_rol}</p>
                      <button
                        class="button"
                        on:click={() => editingUser = usuario}
                      >
                        Editar
                      </button>
                      <button
                        class="button delete"
                        on:click={() => handleDelete(usuario.id_usuario)}
                      >
                        Eliminar
                      </button>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}
          </div>
    </DashboardLayout>
</HandleRoutes>