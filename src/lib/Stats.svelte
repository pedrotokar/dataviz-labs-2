<script>
    import * as d3 from 'd3';
    export let dados = {};
    export let commitMaxTime;
    let dadosFiltrados;
    $: dadosFiltrados = dados.filter(
        linha => linha.datetime < commitMaxTime
    )
</script>

<section>
    <h2>Summary</h2>

    <dl class="stats">
    <dt>Total <abbr title="Lines of code">LOC</abbr></dt> <dd>{dadosFiltrados.length}</dd>

    <dt>Files</dt> <dd>{d3.groups(dadosFiltrados, d => d.file).length}</dd>

    <dt>Commits</dt> <dd>{d3.groups(dadosFiltrados, d => d.commit).length}</dd>
    </dl>
</section>

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
