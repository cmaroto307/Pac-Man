var tablero = tablero || {};
tablero = {
    Tablero:class{
        constructor(elemTablero){
            this.tableroMostrado = elemTablero,
            this.casillas = new Array(FILAS);
            for(let i=0; i<FILAS; i++) {
                this.casillas[i] = new Array(COLUMNAS);
            }
            this.jugador = new personaje.Personaje(0,0);
            this.fantasma = new personaje.Personaje(Math.floor(FILAS/2),Math.floor(COLUMNAS/2));
            this.generarMapa();
            this.mostrarMapa();
        }
        generarMapa(){
            do{
                for(let i=0; i<FILAS; i++){
                    for(let j=0; j<COLUMNAS; j++){
                        this.casillas[i][j] = Math.floor(Math.random() * 2);
                    }
                }
                this.casillas[this.jugador.posicionX][this.jugador.posicionY] = 0;
                this.casillas[this.fantasma.posicionX][this.fantasma.posicionY] = 0;
                this.metaX = FILAS-1;
                this.metaY = COLUMNAS-1;
                this.casillas[this.metaX][this.metaY] = MARCASALIDA;
            }while(!this.mapaValido());
        }
        mapaValido(){
            let valido = true;

            return valido;
        }
        mostrarMapa(){
            this.tableroMostrado.innerHTML = "";
            for(let i=0; i<FILAS; i++){
                for(let j=0; j<COLUMNAS; j++){
                    let elem = document.createElement("div");
                    if(i==this.fantasma.posicionX && j==this.fantasma.posicionY){
                        elem.setAttribute("class", "casilla fantasma");
                        elem.appendChild(document.createTextNode(MARCAFANTASMA));
                    }
                    else if(i==this.jugador.posicionX && j==this.jugador.posicionY){
                        elem.setAttribute("class", "casilla jugador");
                        elem.appendChild(document.createTextNode(MARCAJUGADOR));
                    }
                    else if(i==this.metaX && j==this.metaY){
                        elem.setAttribute("class", "casilla meta");
                        elem.appendChild(document.createTextNode(MARCASALIDA));
                    }
                    else{
                        if(this.casillas[i][j]==VALORMURO){
                            elem.setAttribute("class", "casilla muro");
                        }
                        else if(this.casillas[i][j]==VALORLIBRE){
                            elem.setAttribute("class", "casilla");
                        }
                        elem.appendChild(document.createTextNode(this.casillas[i][j]));
                    }
                    this.tableroMostrado.appendChild(elem);
                }
                let elem = document.createElement("div");
                elem.setAttribute("class", "limpia");
                this.tableroMostrado.appendChild(elem);
            }
        }
        jugadorAtrapado(){
            let atrapado = false;
            if(this.jugador.posicionX==this.fantasma.posicionX && this.jugador.posicionY==this.fantasma.posicionY){
                atrapado = true;
            }
            return atrapado;
        }
        salidaEncontrada(){
            let encontrada = false;
            if(this.jugador.posicionX==this.metaX && this.jugador.posicionY==this.metaY){
                encontrada = true;
            }
            return encontrada;
        }
        moverJugadorArriba(){
            if(this.jugador.posicionX>0 && this.casillas[this.jugador.posicionX-1][this.jugador.posicionY]!=VALORMURO){
                this.casillas[this.jugador.posicionX][this.jugador.posicionY] = VALORLIBRE;
                this.jugador.moverArriba();
            }
        }
        moverJugadorIzquierda(){
            if(this.jugador.posicionY>0 && this.casillas[this.jugador.posicionX][this.jugador.posicionY-1]!=VALORMURO){
                this.casillas[this.jugador.posicionX][this.jugador.posicionY] = VALORLIBRE;
                this.jugador.moverIzquierda();
            }
        }
        moverJugadorAbajo(){
            if(this.jugador.posicionX<this.metaX && this.casillas[this.jugador.posicionX+1][this.jugador.posicionY]!=VALORMURO){
                this.casillas[this.jugador.posicionX][this.jugador.posicionY] = VALORLIBRE;
                this.jugador.moverAbajo();
            }
        }
        moverJugadorDerecha(){
            if(this.jugador.posicionY<this.metaY && this.casillas[this.jugador.posicionX][this.jugador.posicionY+1]!=VALORMURO){
                this.casillas[this.jugador.posicionX][this.jugador.posicionY] = VALORLIBRE;
                this.jugador.moverDerecha();
            }
        }
        moverFantasma(){
            let puede = false;
            while(!puede){
                let dado = Math.floor(Math.random() * 4);
                switch(dado){
                    case 0:
                        puede = this.moverFantasmaArriba();
                    break;
                    case 1:
                        puede = this.moverFantasmaIzquierda();
                    break;
                    case 2:
                        puede = this.moverFantasmaAbajo();
                    break;
                    case 3:
                        puede = this.moverFantasmaDerecha();
                    break;
                }
            }
        }
        moverFantasmaArriba(){
            let puede = false;
            if(this.fantasma.posicionX>0 && this.casillas[this.fantasma.posicionX-1][this.fantasma.posicionY]!=VALORMURO){
                this.casillas[this.fantasma.posicionX][this.fantasma.posicionY] = VALORLIBRE;
                this.fantasma.moverArriba();
                puede = true;
            }
            return puede;
        }
        moverFantasmaIzquierda(){
            let puede = false;
            if(this.fantasma.posicionY>0 && this.casillas[this.fantasma.posicionX][this.fantasma.posicionY-1]!=VALORMURO){
                this.casillas[this.fantasma.posicionX][this.fantasma.posicionY] = VALORLIBRE;
                this.fantasma.moverIzquierda();
                puede = true;
            }
            return puede;
        }
        moverFantasmaAbajo(){
            let puede = false;
            if(this.fantasma.posicionX<this.metaX && this.casillas[this.fantasma.posicionX+1][this.fantasma.posicionY]!=VALORMURO){
                this.casillas[this.fantasma.posicionX][this.fantasma.posicionY] = VALORLIBRE;
                this.fantasma.moverAbajo();
                puede = true;
            }
            return puede;
        }
        moverFantasmaDerecha(){
            let puede = false;
            if(this.fantasma.posicionY<this.metaY && this.casillas[this.fantasma.posicionX][this.fantasma.posicionY+1]!=VALORMURO){
                this.casillas[this.fantasma.posicionX][this.fantasma.posicionY] = VALORLIBRE;
                this.fantasma.moverDerecha();
                puede = true;
            }
            return puede;
        }
    }
}
