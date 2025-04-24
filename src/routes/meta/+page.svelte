<script>
import * as d3 from "d3";
import { onMount } from "svelte";
import Stats from "$lib/Stats.svelte"; //Componente de stats
import Bar from "$lib/Bar.svelte"; //Componente do gráfico de barras

import {
    computePosition,
    autoPlacement,
    offset,
} from '@floating-ui/dom'; //Esse especificamente é pro tooltip


let dados = [];
let commits = [];

onMount(async () => {
    dados = await d3.csv("./loc.csv", row => ({
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
            totalLines: lines.length
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
    commits = d3.sort(commits, d => -d.totalLines);
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

//Filtro de tempo
let commitProgress = 100;
let timeScale, commitMaxTime, filteredCommits;
$: {
    timeScale = d3.scaleTime().domain([minDate,maxDatePlusOne]).range([0,100]);
    commitMaxTime = timeScale.invert(commitProgress);
    filteredCommits = commits.filter(
        commit => commit.datetime < commitMaxTime
    );
    console.log(filteredCommits);
}

//Refazendo para filtered commits
$: filteredMinDate = d3.min(filteredCommits.map(d => d.date));
$: filteredMaxDate = d3.max(filteredCommits.map(d => d.date));
$: filteredMaxDatePlusOne = new Date(filteredMaxDate);
$: filteredMaxDatePlusOne.setDate(filteredMaxDatePlusOne.getDate() + 1);

$: xScale = d3.scaleTime()
              .domain([filteredMinDate, filteredMaxDatePlusOne])
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

//Tooltips *e* seleção
let hoveredIndex = -1;
$: hoveredCommit = filteredCommits[hoveredIndex] ?? hoveredCommit ?? {};
let cursor = {x: 0, y: 0};
let commitTooltip;
let tooltipPosition = {x: 0, y: 0};

let clickedCommits = [];
async function dotInteraction (index, evt){
    let hoveredDot = evt.target;
    if (evt.type == "mouseenter") {

        hoveredIndex = index; cursor = {x: evt.x, y: evt.y};
         tooltipPosition = await computePosition(hoveredDot, commitTooltip, {
            strategy: "fixed", // because we use position: fixed
            middleware: [
                offset(5), // spacing from tooltip to dot
                autoPlacement() // see https://floating-ui.com/docs/autoplacement
            ],
        });
    }
    else if (evt.type == "mouseleave") {
        hoveredIndex = -1;
    }
    else if (evt.type == "click") {
        let commit = filteredCommits[index];
        if (!clickedCommits.includes(commit)) {
            //Adiciona o commit
            clickedCommits = [...clickedCommits, commit];
        } else {
            //Remove o commit
            clickedCommits = clickedCommits.filter(c => c !== commit);
        }
        console.log(clickedCommits);
    }
}

//Tamanho dos circulos
let rScale;
$: rScale = d3.scaleSqrt()
                .domain(d3.extent(commits.map(d=>d.totalLines)))
                .range([3, 30]);

//Gráfico de barras
let allTypes, selectedLines, selectedCounts, languageBreakdown;
$: {
    selectedLines = (clickedCommits.length > 0 ? clickedCommits : filteredCommits).flatMap(d => d.lines);
    allTypes = Array.from(new Set(dados.map(d => d.type)));
    selectedCounts = d3.rollup(
        selectedLines,
        v => v.length,
        d => d.type
    );
    languageBreakdown = allTypes.map(type => [type, selectedCounts.get(type) || 0]);
}

</script>

<h1>Meta</h1>
<p>Página destinada a ter informações da base de código desse site</p>

<Stats dados = {dados}/>

<h2>Sobre os commits</h2>



<Bar data={languageBreakdown} width={width} />

<svg viewBox = "0 0 {width} {height}">
    <g class = "gridlines" transform = "translate({usableArea.left}, 0)" bind:this = {yAxisGridLines}/>
    <g class = "gridlinesX" transform = "translate(0, {usableArea.bottom})" bind:this = {xAxisGridLines}/>
    <g transform = "translate(0, {usableArea.bottom})" bind:this={xAxis} />
    <g transform = "translate({usableArea.left}, 0)" bind:this={yAxis} />
    <g class = "dots">
        {#each filteredCommits as commit, index}
        <circle
            on:mouseenter = {evt => dotInteraction(index, evt)}
            on:mouseleave = {evt => dotInteraction(index, evt)}
            on:click = {evt => dotInteraction(index, evt)}
            class:selected = {clickedCommits.includes(commit)}
            cx = {xScale(commit.datetime)}
            cy = {yScale(commit.hourFrac)}
            r = {rScale(commit.totalLines)}
            fill = "purple"
            fill-opacity = "0.5"
        />
        {/each}
    </g>
</svg>

<dl class = "info tooltip"
    hidden = {hoveredIndex === -1}
    style = "top: {tooltipPosition.y}px; left: {tooltipPosition.x}px"
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

<div class="slider-container">
    <div class="slider">
        <label for="slider">Show commits until:</label>
        <input type="range" id="slider" name="slider" min=0 max=100 bind:value={commitProgress}/>
        <time class="time-label">{commitMaxTime.toLocaleString()}</time>
    </div>
</div>



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
    @starting-style {
        r: 0;
    }
}
circle.selected {
    fill: red;
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

.slider-container{
	display:grid;
}
.slider{
	display: flex;
}
#slider{
	flex:1;
}
.time-label{
	font-size: 0.75em;
	text-align: right;
}


</style>
