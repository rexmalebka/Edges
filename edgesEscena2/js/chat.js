export const Chat = {
	init: function(){
		window.addEventListener('putChat', function(e){Chat.putChat(e.detail.from, e.detail.content)})
	},
	putChat: function(from, content){
		from = Users[from].nickname
		content = content

		const mensaje = document.createElement('div')
		mensaje.classList.add('mensaje')

		const nombre = document.createElement('span')
		nombre.classList.add('nombre')
		nombre.textContent = from

		const contenido = document.createElement('span')
		contenido.classList.add('contenido')
		contenido.textContent = content

		let nombres = document.querySelectorAll('.nombre')
		console.debug(nombres[nombres.length -1 ], "asdfsdf")
		if(nombres.length==0 || nombres[nombres.length - 1].innerText != from) mensaje.appendChild(nombre)
		mensaje.appendChild(contenido)

		document.querySelector('#mensajes').appendChild(mensaje)
		document.querySelector('#mensajes').scrollTo(0, mensajes.scrollHeight)
	},
	toggleShow: function(){
		document.querySelector("#chat").style.display = document.querySelector("#chat").style.display == 'none' ? '' : 'none'

	},
	blur: function(){
		document.querySelector('#inputMensaje').blur()
                document.querySelector("body").focus();
	},
	chat: function(msg){
		
		msg = msg.replace( /^(\s\n)+/g, '');
		msg = msg.replace(/(\s|\n)+$/,'')

		if(msg.length == 0) return
		Chat.putChat('me', msg)
		Server.socket.emit('chat', msg)
		document.querySelector('#inputMensaje').innerHTML = ""
	},
	ctrl: false
}

function onKeyDown(event){
	switch (event.key){
		case 'Control':
			Chat.ctrl = true
		case 'Enter':
			if(Chat.ctrl){
				console.debug("new line")
				document.querySelector('#inputMensaje').innerText += '\n '
				let range,selection;
				range = document.createRange();//Create a range (a range is a like the selection but invisible)
				range.selectNodeContents(document.querySelector("#inputMensaje"));//Select the entire contents of the element with the range
                                range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
                                selection = window.getSelection();//get the selection object (allows you to change selection)
                                selection.removeAllRanges();//remove any selections already made
                                selection.addRange(range);//make the range you have just created the visible selection

			}else{
				Chat.chat(document.querySelector('#inputMensaje').innerText)
				document.querySelector('#inputMensaje').innerHTML = ""
				Chat.blur();
				event.preventDefault();
			}
			break
	}
}

function onKeyUp(event){
	switch (event.key){
		case 'Control':
			Chat.ctrl = false
			break
		case 'Enter':
			break
	}
}

document.querySelector('#mostrarChat').addEventListener('click', function(e){ 
	Chat.toggleShow()
})
document.querySelector('#mandarMensaje').addEventListener('click', function(event){
	Chat.chat(document.querySelector("#inputMensaje").innerText)
	document.querySelector('#inputMensaje').innerHTML = ""
	event.preventDefault();
})

document.querySelector('#inputMensaje').addEventListener('keydown', onKeyDown, false)
document.querySelector('#inputMensaje').addEventListener('keyup', onKeyUp, false)


document.addEventListener('keyup', function(event){
	switch (event.key){
		case 't':
		case 'T':
			console.log("asdfsdfs")
			document.querySelector("#chat").style.display = ''
			document.querySelector('#inputMensaje').focus()
			break
	}

}, false)
