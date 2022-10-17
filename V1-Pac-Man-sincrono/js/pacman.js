var pacman = pacman || {};
pacman = {
    Pacman:class{
        constructor(strTablero, strMensaje, strBotonIniPartida){
            this.tableroMostrado = document.getElementById(strTablero);
            this.mensajeMostrado = document.getElementById(strMensaje);
            this.mensajeMostrado.textContent = "Pulsa Inicio para empezar una partida";
            let botonIniPartida = document.getElementById(strBotonIniPartida);
            this.teclaPulsada = false;
            botonIniPartida.onclick = () => {this.iniciarPartida();};
        }
        iniciarPartida(){
            this.finalPartida = false;
            this.nuevoTablero = new tablero.Tablero(this.tableroMostrado);
            this.mensajeMostrado.textContent = "Encuentra la salida evitando al fantasma. Controles->(W, A, S, D)";
            document.addEventListener('keydown', (event) => {this.eventoTecladoDown(event);});
            document.addEventListener('keyup', (event) => {this.eventoTecladoUp(event);});
        }
        eventoTecladoDown(event){
            if(!this.finalPartida && !this.teclaPulsada){
                this.teclaPulsada = true;
                let teclaCorrecta = false;
                let keyValue = event.key.toLowerCase();
                switch(keyValue){
                    case 'w':
                        this.nuevoTablero.moverJugadorArriba();
                        teclaCorrecta = true;
                    break;
                    case 'a':
                        this.nuevoTablero.moverJugadorIzquierda();
                        teclaCorrecta = true;
                    break;
                    case 's':
                        this.nuevoTablero.moverJugadorAbajo();
                        teclaCorrecta = true;
                    break;
                    case 'd':
                        this.nuevoTablero.moverJugadorDerecha();
                        teclaCorrecta = true;
                    break;
                }
                if(teclaCorrecta){
                    this.comprobarFinal();
                    if(!this.finalPartida){
                        this.nuevoTablero.moverFantasma();
                        this.comprobarFinal();
                    }
                    this.nuevoTablero.mostrarMapa();
                }
            }
        }
        eventoTecladoUp(event){
            this.teclaPulsada = false;
        }
        comprobarFinal(){
            if(this.nuevoTablero.jugadorAtrapado()){
                this.mensajeMostrado.textContent = "¡El fantasma te ha atrapado!";
                this.finalPartida = true;
            }
            else if(this.nuevoTablero.salidaEncontrada()){
                this.mensajeMostrado.textContent = "¡Has ganado!";
                this.finalPartida = true;
            }
        }
    }
}