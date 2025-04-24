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
    commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
        let firsst = lines[0];
        let {author, date, time, timezone, datetime} = first;
        let ret = {
            id: commit,
            url: "https://github.com/pedrotokar/dataviz-labs-2" + commit,
            autor, date, time, timezone, datetime,
            hourFrac: datatime.getHours() + datatime.getMinutes() / 60,
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
</script>

<h1>Meta</h1>
<p>Página destinada a ter informações da base de código desse site</p>
<p>Linhas de código: {dados.length}</p>
<Stats dados = dados/>
