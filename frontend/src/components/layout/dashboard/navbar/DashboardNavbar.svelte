<script lang="ts">
    import { logout, authStore } from "../../../../stores/authStore"; // Supongamos que authStore gestiona el estado del usuario.
    import { onMount } from "svelte";
  
    // Tipos
    type User = {
      rol: "Coordinadora" | "Conductor" | "Administrador";
      nombre: string;
    };
  
    let user: User | null = null;
  
    const mapRol = (rol: string): "Coordinadora" | "Conductor" | "Administrador" => {
      if (rol === "Coordinadora" || rol === "Conductor" || rol === "Administrador") {
        return rol;
      }
      throw new Error(`Rol no válido: ${rol}`);
    };
  
    const handleLogout = async () => {
      await logout();
    };
  
    onMount(() => {
      let subscribe = authStore.subscribe(value => {
        if (value.user && value.user.rol) {
          try {
            // Validamos y mapeamos el rol
            user = {
              ...value.user,
              rol: mapRol(value.user.rol),
            };
          } catch (error) {
            console.error(error);
          }
        } else {
          user = null;
        }
      });
      return () => subscribe();
    });
  </script>
  
  
  <nav>
    <div class="nav-wrapper">
      <a href="/dashboard" class="brand-logo">Gestión de Viajes</a>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        {#if user}
          {#if user.rol === "Coordinadora"}
            <li><a href="/coordinadora/vehiculos">Estado de Vehículos</a></li>
            <li><a href="/coordinadora/asignar">Asignar Vehículos</a></li>
            <li><a href="/coordinadora/obras">Mis Obras</a></li>
          {/if}
  
          {#if user.rol === "Conductor"}
            <li><a href="/conductor/obras">Mis Obras</a></li>
            <li><a href="/conductor/estado">Estado del Vehículo</a></li>
    
          {/if}
  
          {#if user.rol === "Administrador"}
            <li><a href="/admin/usuarios">Gestión de Usuarios</a></li>
          {/if}
  
          <li id="logout"><a href="#" on:click={handleLogout}>Cerrar sesión</a></li>
        {:else}
          <li><a href="/login">Iniciar sesión</a></li>
        {/if}
      </ul>
    </div>
  </nav>
  
  <style>
    /* General Navbar Styles */
    nav {
      background-color: #333;
      padding: 10px 20px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
  
    /* Navbar Wrapper */
    .nav-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  
    /* Brand Logo */
    .brand-logo {
      font-size: 1.5rem;
      color: #fff;
      text-decoration: none;
    }
  
    /* Navbar Links */
    #nav-mobile {
      display: flex;
      gap: 15px;
      list-style-type: none;
      margin: 0;
      padding: 0;
    }
  
    /* Navbar Items */
    #nav-mobile li {
      list-style: none;
    }
  
    #nav-mobile li a {
      color: #ddd;
      font-size: 1rem;
      padding: 8px 12px;
      text-decoration: none;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }
  
    /* Hover Effect */
    #nav-mobile li a:hover {
      background-color: #555;
      color: #fff;
    }
  
    /* Logout Button */
    #logout a {
      color: #ff6b6b;
      font-weight: bold;
    }
  
    #logout a:hover {
      background-color: #ff8a8a;
    }
  </style>
  