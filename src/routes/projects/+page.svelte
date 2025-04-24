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

    </div>
