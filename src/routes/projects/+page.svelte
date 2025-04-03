<script>
    import * as d3 from 'd3';
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte";
    import Pie from '$lib/Pie.svelte';


    let data = [
        {value: 1, label: "Guilherme"},
        {value: 7, label: "Paulo"},
        {value: 9, label: "Tokão"},
        {value: 4, label: "Luciano"},
        {value: 1, label: "Larissa 2"},
        {value: 3, label: "Vitor"},
        {value: 6, label: "Matheus"},
        {value: 8, label: "Samuel"},
        {value: 4, label: "Kaiky"}
    ];

    let query = "";
    let pieData;

    $: filteredProjects = projects.filter(project => {
        if (query){
            let values = Object.values(project).join("\n").toLowerCase();
            return values.includes(query.toLowerCase());
        }
        return true;
    });
    $: filteredByYear = filteredProjects.filter(project => {
        if (selectedYear) {
            return project.year === selectedYear;
        }
        return true;
    });
    $: {
        // Initialize to an empty object every time this runs
        pieData = {};

        // Calculate rolledData and pieData based on filteredProjects here
        let rolledData = d3.rollups(filteredProjects, v => v.length, d => d.year);

        // We don't need 'let' anymore since we already defined pieData
        pieData = rolledData.map(([year, count]) => {
            return { value: count, label: year };
        });
    }

    let selectedYearIndex = -1;
    let selectedYear;
    $: selectedYear = selectedYearIndex > -1 ? pieData[selectedYearIndex].label : null;

</script>

<svelte:head>
    <title>Projetos</title>
</svelte:head>
<h1>Projetos</h1>

    <p>Contagem: {filteredByYear.length}</p>
      <input type="search" bind:value={query} aria-label="Procure projetos" placeholder="🔍 escreve aí..." />
      <Pie data={pieData} bind:selectedIndex={selectedYearIndex} />
      <div class = "projects">
        {#each filteredByYear as p}
            <Project data = {p} />
        {/each}
        <!--<article>
            <h2>Lorem ipsum dolor sit.</h2>
            <img src="../images/onepiece.jpg" alt="">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum, libero, reprehenderit architecto officiis ullam voluptate cumque dignissimos hic cupiditate quod minima ut ab sequi! Numquam, sint tempora est vitae aspernatur.</p>
        </article>
        <article>
            <h2>Nam necessitatibus magnam similique.</h2>
            <img src="../images/onepiece.jpg" alt="">
            <p>Minus, ipsa, quis, neque cum quaerat labore quae est aut ullam doloribus excepturi commodi odio quos nostrum repellat nisi dolorem dicta velit ex optio. Corporis doloremque illo blanditiis nemo soluta.</p>
        </article>
        <article>
            <h2>Recusandae eaque commodi perferendis?</h2>
            <img src="../images/onepiece.jpg" alt="">
            <p>Eius, praesentium, dicta possimus iste ullam suscipit nihil dolor rem vero incidunt libero culpa dolores odio esse fuga ut officia harum reprehenderit facere reiciendis. Eos, maxime praesentium quasi eius consectetur.</p>
        </article>
        <article>
            <h2>Odio, fugiat atque pariatur!</h2>
            <img src="../images/onepiece.jpg" alt="">
            <p>Reprehenderit eos inventore dolor molestiae repudiandae cumque error expedita! Cum, quaerat, illo repudiandae ad consequatur eius sapiente inventore dolore recusandae aspernatur expedita aliquid labore necessitatibus placeat facere autem nemo! Sit.</p>
        </article>
        <article>
            <h2>Delectus eos ex itaque.</h2>
            <img src="../images/onepiece.jpg" alt="">
            <p>Cupiditate, soluta, quis praesentium nisi dignissimos totam magni reprehenderit laborum quia doloribus molestias saepe deleniti recusandae odit accusamus iure eos quibusdam corrupti explicabo id vero nobis laboriosam numquam consectetur provident!</p>
        </article>
        <article>
            <h2>Aspernatur explicabo quasi ea.</h2>
            <img src="../images/onepiece.jpg" alt="">
            <p>Odio, architecto, hic dolores repellendus assumenda sed dicta quisquam quaerat eius quos alias nulla suscipit nostrum iure ut ipsa amet labore iste numquam fugiat nesciunt! Ratione architecto beatae porro maiores.</p>
        </article>-->
    </div>
