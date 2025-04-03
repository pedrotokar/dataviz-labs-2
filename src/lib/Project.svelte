<script>
export let data = {};
export let heading = 2;
</script>

<article>
    <svelte:element this={"h" + heading}>{data.title}</svelte:element>
    <img src="{data.image}" alt="" />
    <p>{data.description}<br>{data.year}</p>
    <p><a href = "{data.link}" target="_blank">link</a></p>
</article>

