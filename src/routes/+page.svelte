<script>
  import projects from "$lib/projects.json";
  import Project from "$lib/Project.svelte";
</script>

<svelte:head>
    <title>Pedro Tokar</title>
</svelte:head>

<h1> Pedro Tokar </h1>

<p> I am a Data Science and AI student at FGV EMAp. I am also a big fan of One Piece and Rock Music!</p>

<img src="images/onepiece3.png" alt="One Piece">

<h2> Estatísticas do GitHub </h2>
{#await fetch("https://api.github.com/users/pedrotokar")}
    <p> Carregando </p>
{:then resposta} {#await resposta.json()}
    <p> Lendo JSON </p>
{:then dados}
    <dl>
        <dt>Seguidores</dt>
        <dd>{dados.followers}</dd>
        <dt>Seguindo</dt>
        <dd>{dados.following}</dd>
        <dt>Repositórios públicos</dt>
        <dd>{dados.public_repos}</dd>
      </dl>
<!--     <p> Informações: {JSON.stringify(dados)} </p> -->
{:catch error}
    <p class = "error">Deu xabu: {erro.message}</p>
{/await} {:catch error}
    <p class = "error">Deu xabu: {erro.message}</p>
{/await}

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
    color: var(--border-gray);
    text-transform: uppercase;
  }
  dd{
    font-family: inherit;
    font-weight: bold;
  }
  section{
    border-width:0.15em;
  	border-style:solid;
	  border-color:var(--border-gray);
    padding-left: 1em;
    padding-right: 1em;
  }

</style>
