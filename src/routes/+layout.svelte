<script>
let pages = [
    { url: "/", title: "Home" },
    { url: "/projects", title: "Projetos" },
    { url: "/contact", title: "Contato" },
    { url: "/CV", title: "CV" },
    { url: "/meta", title: "Meta"},
    {url: "https://github.com/pedrotokar", title: "GitHub"}
];
import {base} from "$app/paths";
import {page} from "$app/stores";
</script>

<nav>
    {#each pages as p}
        <a href = {p.url.startsWith("http") ? p.url : `${base}${p.url}`}
           class:current = {$page.route.id === p.url}
           target={p.url.startsWith("http") ? "_blank" : undefined}>
           {p.title}
        </a>
    {/each}
</nav>

<slot />

<style>
nav {
	display: flex;
	border-bottom-width: 2px;
	border-bottom-style: solid;
	border-bottom-color: #8c8c8c;
}

nav a{
	flex: 1;
	text-decoration: none;
	color: inherit;
	text-align: center;
	padding: 0.5em;
}

nav .current{
	border-bottom-width: 0.6ch;
	border-bottom-style: solid;
	border-bottom-color: #676767;
}

nav a:hover{
	border-bottom-width: 0.6ch;
	border-bottom-style: solid;
	border-bottom-color: var(--accent-strong)/*#676767*/;
	background-color: var(--accent-light)
}
</style>
