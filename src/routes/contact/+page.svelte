<svelte:head>
    <title>Contato</title>
</svelte:head>
<h1>Use o seguinte formulário para entrar em contato.</h1>
    <form action = "mailto:exemplo@gmail.com" method = "get">
        <label for = "email">Email: <input id = "email" name = "email" type = "email"></label>
        <label for = "subject">Assunto: <input id = "subject" name = "subject" type = "text"></label>
        <label for = "body">Texto: <textarea id = "body" name = "body"></textarea></label>
        <button>Enviar</button>

    </form>