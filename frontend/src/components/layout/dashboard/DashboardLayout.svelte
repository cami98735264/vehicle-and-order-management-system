<script lang="ts">
    import type { Snippet } from "svelte";
    import DashboardFooter from "./footer/DashboardFooter.svelte";
    import DashboardNavbar from "./navbar/DashboardNavbar.svelte";
    import { Toaster } from 'svelte-sonner'
  
  
      interface Props {
          children: Snippet;
      }
      let { children }: Props = $props();
  
  </script>
  
  
  <main id="main-container">
      <DashboardNavbar />
      <div id="slot-container">
          {@render children() }
      </div>
      <DashboardFooter />
  </main>
  
  <Toaster position="top-right" />
  
  
  
  
  
  <style>
      #main-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
      }
  
      #slot-container {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          background-color: #fff;
      }
  </style>
  
  