var pacman = pacman || {};

pacman.Pacman = class {
    constructor(strTablero, strMensaje, strBotonIniPartida){
        this.tableroMostrado = document.getElementById(strTablero);
        this.mensajeMostrado = document.getElementById(strMensaje);
        this.mensajeMostrado.textContent = "Pulsa Inicio para empezar una partida";
        let botonIniPartida = document.getElementById(strBotonIniPartida);
        botonIniPartida.onclick = () => {this.iniciarPartida();};
    }
    iniciarPartida(){
        this.finalPartida = false;
        this.teclaPulsada = false;
        this.nuevoTablero = new pacman.Tablero(this.tableroMostrado);
        this.mensajeMostrado.textContent = "Encuentra la salida de los niveles evitando a los fantasmas. Controles->(W, A, S, D)";
        document.addEventListener('keydown', (event) => {this.eventoTecladoDown(event);});
        document.addEventListener('keyup', (event) => {this.eventoTecladoUp(event);});
        this.killThread();
        this.hiloFantasma = setInterval(()=>this.iniciarMovimientoFantasma(), 500);
    }
    eventoTecladoDown(event){
        if(!this.finalPartida && !this.teclaPulsada){
            this.teclaPulsada = true;
            let keyValue = event.key.toLowerCase();
            if(keyValue=='w' || keyValue=='a' || keyValue=='s' || keyValue=='d'){
                for (let i=0; i<this.nuevoTablero.entidades.length; i++) {
                    let entidad = this.nuevoTablero.entidades[i];
                    if (entidad.tipo === pacman.JUGADOR) {
                        switch(keyValue){
                            case 'w':
                                this.nuevoTablero.moverEntidad(entidad, entidad.x-1, entidad.y);
                            break;
                            case 'a':
                                this.nuevoTablero.moverEntidad(entidad, entidad.x, entidad.y-1);
                            break;
                            case 's':
                                this.nuevoTablero.moverEntidad(entidad, entidad.x+1, entidad.y);
                            break;
                            case 'd':
                                this.nuevoTablero.moverEntidad(entidad, entidad.x, entidad.y+1);
                            break;
                        }
                        this.comprobarFinal(entidad);
                        this.nuevoTablero.mostrarMapa();
                    }
                }
            }
        }
    }
    eventoTecladoUp(event){
        this.teclaPulsada = false;
    }
    iniciarMovimientoFantasma(){
        for (let i=0; i<this.nuevoTablero.entidades.length; i++) {
            let entidad = this.nuevoTablero.entidades[i];
            if (entidad.tipo === pacman.FANTASMA) {
                this.nuevoTablero.moverFantasma(entidad);
                this.comprobarFinal(entidad);
                this.nuevoTablero.mostrarMapa();
            }
        }
    }
    comprobarFinal(entidad){
        if(this.nuevoTablero.jugadorAtrapado(entidad)){
            this.mensajeMostrado.textContent = "¡Los fantasmas te han atrapado!";
            this.finalPartida = true;
            this.killThread();
        }
        else if(this.nuevoTablero.salidaEncontrada(entidad)){
            this.mensajeMostrado.textContent = "¡Has ganado!";
            this.finalPartida = true;
            this.killThread();
        }
    }
    killThread(){
        clearInterval(this.hiloFantasma);
    }
}