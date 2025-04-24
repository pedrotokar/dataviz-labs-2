<script>
  import projects from "$lib/projects.json";
  import Project from "$lib/Project.svelte";
  import { onMount } from "svelte";
  let dados = null;
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      const response = await fetch("https://api.github.com/users/pedrotokar");
      dados = await response.json();
    } catch (err) {
      error = err;
    }
    loading = false;
  });
</script>

<svelte:head>
    <title>Pedro Tokar</title>
</svelte:head>

<h1> Pedro Tokar </h1>

<p> I am a Data Science and AI student at FGV EMAp. I am also a big fan of One Piece and Rock Music!</p>

<img src="images/onepiece3.png" alt="One Piece">

<h2> Estatísticas do GitHub </h2>
{#if loading}
    <p>Guenta aí que tá carregando...</p>
{:else if error}
    <p class = "error">Deu xabu: {error.message}</p>
{:else}
  <section>
    <dl>
        <dt>Seguidores</dt>
        <dd>{dados.followers}</dd>
        <dt>Seguindo</dt>
        <dd>{dados.following}</dd>
        <dt>Repositórios públicos</dt>
        <dd>{dados.public_repos}</dd>
      </dl>
    </section>
{/if}

<h2> Latest projects </h2>
<div class = "projects">
    {#each projects.slice(0, 3) as p}
        <Project data = {p} heading = 3/>
    {/each}
</div>

<style>
dl{
  display: grid;
  grid-template-columns: auto;
  }
dt{
  grid-row: 1;
  font-family: inherit;
  font-weight: bold;
  color: #bbbbbb;
  text-transform: uppercase;
}
dd{
  font-family: inherit;
  font-weight: bold;
  }
section{
  border-width:0.15em;
  border-style:solid;
  border-color: #d9d9d9;
  padding-left: 1em;
  padding-right: 1em;
}
</style>
