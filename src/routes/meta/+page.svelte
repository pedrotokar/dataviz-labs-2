<script>
import * as d3 from "d3";
import { onMount } from "svelte";
import Stats from "$lib/Stats.svelte";

let dados = [];
let commits = [];

onMount(async () => {
    dados = await d3.csv("/loc.csv", row => ({
        ...row,
        line: Number(row.line),
        depth: Number(row.depth),
        length: Number(row.length),
        date: new Date(row.date + "T00:00" + row.timezone),
        datetime: new Date(row.datetime)
    }));
    commits = d3.groups(dados, d => d.commit).map(([commit, lines]) => {
        let first = lines[0];
        let {author, date, time, timezone, datetime} = first;
        let ret = {
            id: commit,
            url: "https://github.com/pedrotokar/dataviz-labs-2" + commit,
            author, date, time, timezone, datetime,
            hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
            totalLInes: lines.length
        };
        //Isso é para prevenir que as linhas apareçam em uma json stringfy da vida.
        Object.defineProperty(ret, "lines", {
            value: lines,
            configurable: true,
            writable: true,
            enumerable: false
        });
        return ret;
    });
})

let width = 1000, height = 600;

$: minDate = d3.min(commits.map(d => d.date));
$: maxDate = d3.max(commits.map(d => d.date));
$: maxDatePlusOne = new Date(maxDate);
$: maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1);

$: xScale = d3.scaleTime()
              .domain([minDate, maxDatePlusOne])
              .range([0, width])
              .nice();

$: yScale = d3.scaleLinear()
              .domain([24, 0])
              .range([height, 0]);

</script>

<h1>Meta</h1>
<p>Página destinada a ter informações da base de código desse site</p>
<p>Linhas de código: {dados.length}</p>
<Stats dados = {dados}/>
<svg viewBox = "0 0 {width} {height}">
<g class = "dots">
    {#each commits as commit, index}
    <circle
        cx = {xScale(commit.datetime)}
        cy = {yScale(commit.hourFrac)}
        r = "5"
        fill = "steelblue"
    />
    {/each}
</g>
</svg>

<style>
svg {
    overflow: visible;
}
</style>
