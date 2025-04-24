<script>
import * as d3 from "d3";
import { onMount } from "svelte";
import Stats from "$lib/Stats.svelte"; //Componente de stats
import {
    computePosition,
    autoPlacement,
    offset,
} from '@floating-ui/dom'; //Esse especificamente é pro tooltip


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

//Definição de espaço
let width = 1000, height = 600;
let margin = {top: 10, right: 10, bottom: 30, left: 20};
let usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left
};
usableArea.width = usableArea.right - usableArea.left;
usableArea.height = usableArea.bottom - usableArea.top;

//Eixos
$: minDate = d3.min(commits.map(d => d.date));
$: maxDate = d3.max(commits.map(d => d.date));
$: maxDatePlusOne = new Date(maxDate);
$: maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1);

$: xScale = d3.scaleTime()
              .domain([minDate, maxDatePlusOne])
              .range([usableArea.left, usableArea.right])
              .nice();

$: yScale = d3.scaleLinear()
              .domain([0, 24])
              .range([usableArea.bottom, usableArea.top]);

let xAxis, yAxis;
$: {
    d3.select(xAxis).call(d3.axisBottom(xScale));
    d3.select(yAxis).call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, "0") + ":00"));
}

//Gridlines
let yAxisGridLines, xAxisGridLines;
$: {
    d3.select(yAxisGridLines).call(
        d3.axisLeft(yScale).tickFormat("").tickSize(-usableArea.width)
    );
}
$: {
    d3.select(xAxisGridLines).call(
        d3.axisBottom(xScale).tickFormat("").tickSize(-usableArea.height)
    );
}

//Tooltips
let hoveredIndex = -1;
$: hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {};
let cursor = {x: 0, y: 0};
let commitTooltip;
function dotInteraction (index, evt){
    if (evt.type == "mouseenter") {
        hoveredIndex = index; cursor = {x: evt.x, y: evt.y};
    }
    else if (evt.type == "mouseleave") {
        hoveredIndex = -1;
    }
}
</script>

<h1>Meta</h1>
<p>Página destinada a ter informações da base de código desse site</p>
<p>Linhas de código: {dados.length}</p>
<Stats dados = {dados}/>
<svg viewBox = "0 0 {width} {height}">
    <g class = "gridlines" transform = "translate({usableArea.left}, 0)" bind:this = {yAxisGridLines}/>
    <g class = "gridlinesX" transform = "translate(0, {usableArea.bottom})" bind:this = {xAxisGridLines}/>
    <g transform = "translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g transform = "translate({usableArea.left}, 0)" bind:this={yAxis} />
    <g class = "dots">
        {#each commits as commit, index}
        <circle
            on:mouseenter = {evt => dotInteraction(index, evt)}
            on:mouseleave = {evt => dotInteraction(index, evt)}
            cx = {xScale(commit.datetime)}
            cy = {yScale(commit.hourFrac)}
            r = "5"
            fill = "purple"
        />
        {/each}
    </g>
</svg>

<dl class = "info tooltip"
    hidden = {hoveredIndex === -1}
    style = "top: {cursor.y}px; left: {cursor.x}px"
    bind:this = {commitTooltip}>
    <dt>Commit</dt>
    <dd><a href="{ hoveredCommit.url }" target="_blank">{ hoveredCommit.id }</a></dd>

    <dt>Date</dt>
    <dd>{ hoveredCommit.datetime?.toLocaleString("en", {dateStyle: "full"}) }</dd>

    <dt>Author</dt>
    <dd>{ hoveredCommit.author }</dd>

    <dt>Time</dt>
    <dd>{ hoveredCommit.time }</dd>
</dl>


<style>
svg {
    overflow: visible;
}
circle {
    transition: 200ms;
    transform-origin: center;
    transform-box: fill-box;
    &:hover {
        transform: scale(1.5);
    }
}
.gridlines {
    stroke-opacity: .2;
}
.gridlinesX {
    stroke-opacity: .1;
}
.info{
    display: grid;
    margin:0;
    grid-template-columns: 2;
    background-color: #FFEFFF;
    padding: 5px;
    box-shadow: 1px 1px gray;
    border-radius: 4px;

    transition-duration: 500ms;
    transition-property: opacity, visibility;

    &[hidden]:not(:hover, :focus-within) {
        opacity: 0;
        visibility: hidden;
    }
}

.info dt{
    grid-column:1;
    grid-row:auto;
}

.info dd{
    grid-column:2;
    grid-row:auto;
    font-weight: 400;
}

.tooltip{
    position: fixed;
    top: 1em;
    left: 1em;
}

</style>
