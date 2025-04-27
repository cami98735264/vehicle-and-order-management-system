<script lang="ts">
  import { toast } from "svelte-sonner";
    import HandleRoutes from "../../components/auth/HandleRoutes.svelte";
    import LoginLayout from "../../components/layout/login/LoginLayout.svelte";
  import { authStore, login } from "../../stores/authStore.js";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
    onMount(() => {
        let subscribe = authStore.subscribe(value => {
            if(value.isAuthenticated) {
                goto("/dashboard");
            }
        });
        // unsubscribe on unmount
        return () => subscribe();
    });

const onSubmit = async (event: Event) => {
    event.preventDefault();
    const form = document.getElementById("login-form") as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const aceptaTerminos = (document.getElementById("remember") as HTMLInputElement).checked;
    if(!aceptaTerminos) {
        toast.warning("Debes aceptar los términos y condiciones para continuar");
        return;
    }
    try {
        await login(email, password);
        goto("/dashboard");
    } catch (error) {
        console.log(error);
    }
    
}
</script>


<HandleRoutes>
    {#if !$authStore.isAuthenticated && !$authStore.isLoading}
    <LoginLayout>
        <form id="login-form" onsubmit={onSubmit}>
            <h1>INICIAR SESIÓN</h1>
            <div id="login-inputs">
                <div>
                    <label for="email">Correo electrónico</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div>
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div id="terminos-condiciones">
                    <input type="checkbox" id="remember" name="remember">
                    <label for="remember">Acepta términos y condiciones</label>
                </div>
            </div>
            <button type="submit">Iniciar sesión</button>

        </form>
    </LoginLayout>
    {/if}
</HandleRoutes>



<style>
    #login-form {
        min-width: 380px;
        display: flex;
        flex-direction: column;

        padding: 24px;
        border: 1px solid #ccc;
        border-radius: 20px;
        background-color: #ffffff;
        gap: 36px;
    }

    #login-inputs {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 16px;
    }

    #login-form h1 {
        font-weight: 600;
        color: #5d4a6c;
        text-align: center;
    }

    #login-inputs div:not(:last-child) {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }


    #login-inputs #terminos-condiciones {
        display: flex;
        flex-direction: row;
        gap: 12px;
        align-items: center;
    }

    input[type="checkbox"] {
        width: 20px;
        height: 20px;

    }

    button {
        padding: 12px;
        border: none;
        border-radius: 20px;
        background-color: #168DDD;
        color: #ffffff;
        cursor: pointer;
    }
    label {
        color: #5c5c5c;
        font-weight: 500;
    }
    input:not([type="checkbox"]) {
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 20px;
    }


</style>