<script>
  import HandleRoutes from "../../components/auth/HandleRoutes.svelte";
  import DashboardLayout from "../../components/layout/dashboard/DashboardLayout.svelte";
  import { authStore } from "../../stores/authStore";
</script>
<HandleRoutes redirectUrl="/login">
    <DashboardLayout>
        <div>
            <h1>Bievenido! {$authStore.user?.nombre}</h1>
            <p>Tu email es <b>{$authStore.user?.email}</b> y tu rol es <b>{$authStore.user?.rol}</b></p>
        </div>
    </DashboardLayout>
</HandleRoutes>