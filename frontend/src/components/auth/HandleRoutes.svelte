<script lang="ts">
  import { goto } from "$app/navigation";
    interface Props {
        redirectUrl?: string;
        allowedRoles?: string[];
        children: Snippet;
    }
    import { authStore, check } from "../../stores/authStore.js";
    import { onMount, type Snippet } from "svelte";
    let { children, redirectUrl, allowedRoles }: Props = $props();
    onMount(() => {
        check();
        let subscribe = authStore.subscribe((value) => {
            if (!value.isLoading && !value.isAuthenticated && redirectUrl) {
                goto(redirectUrl);
                return;
            }
            if(allowedRoles && allowedRoles.length > 0) {
                if(value.user.rol && !allowedRoles.includes(value.user.rol)) {
                    window.history.back();
                    return;
                }
            }
        });
        return () => subscribe();
    });

</script>

{#if $authStore.isAuthenticated && !$authStore.isLoading}
    {@render children() }
{:else if !redirectUrl}
    {@render children() }
{/if}