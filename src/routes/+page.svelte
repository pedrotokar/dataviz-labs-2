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

<h2> Latest projects </h2>
<div class = "projects">
    {#each projects.slice(0, 3) as p}
        <Project data = {p} heading = 3/>
    {/each}
</div>
