console.log("IT’S ALIVE!");

var x = 0;

console.log(0);
function $$ (selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

const ARE_WE_HOME = document.documentElement.classList.contains("home");

let pages = [
    {url: "", title: "Home"},
    {url: "projects/", title: "Projects"},
    {url: "CV/", title: "CV"},
    {url: "contact/", title: "Contact"},
    {url: "https://github.com/pedrotokar", title: "GitHub"}
    // add the rest of your pages here
];

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    if (!ARE_WE_HOME && !url.startsWith("http")) {
        url = "../" + url;
    }
    let a = document.createElement("a");
    a.href = url;
    a.textContent = title;
    // Create link and add it to nav
    if(a.host == location.host && a.pathname == location.pathname){
        a.classList.add("current");
    }
    if(a.host != location.host){
        a.target = "_blank"
    }
    nav.append(a)
}

