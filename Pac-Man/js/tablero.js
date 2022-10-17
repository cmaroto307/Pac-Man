var tablero = tablero || {};
tablero = {
    Tablero:class{
        constructor(elemTablero){
            this.tableroMostrado = elemTablero;
            this.casillas = new Array(FILAS);
            for(let i=0; i<FILAS; i++) {
                this.casillas[i] = new Array(COLUMNAS);
            }
            this.copiaTablero = new Array(FILAS);
            for(let i=0; i<FILAS; i++) {
                this.copiaTablero[i] = new Array(COLUMNAS);
            }
            this.generarMapa();
            this.mostrarMapa();
        }
        generarMapa(){
            do{
                this.JUGADORINIX = 0;
                this.JUGADORINIY = 0;
                this.FANTASMAINIX = Math.floor(FILAS/2);
                this.FANTASMAINIY = Math.floor(COLUMNAS/2);
                this.METAX = FILAS-1;
                this.METAY = COLUMNAS-1;
                for(let i=0; i<FILAS; i++){
                    for(let j=0; j<COLUMNAS; j++){
                        this.casillas[i][j] = Math.floor(Math.random() * 2);
                    }
                }
                this.casillas[this.JUGADORINIX][this.JUGADORINIY] = VALORLIBRE;
                this.casillas[this.FANTASMAINIX][this.FANTASMAINIY] = VALORLIBRE;
                this.casillas[this.METAX][this.METAY] = VALORLIBRE;
            }while(!this.mapaValido());
            this.jugador = new personaje.Personaje(this.JUGADORINIX,this.JUGADORINIY);
            this.fantasma = new personaje.Personaje(this.FANTASMAINIX,this.FANTASMAINIY);
        }
        mapaValido(){
            let resultado = true;
            if((this.JUGADORINIX==this.FANTASMAINIX && this.JUGADORINIY==this.FANTASMAINIY) || 
               (this.JUGADORINIX==this.METAX && this.JUGADORINIY==this.METAY)){
                resultado = false;
            }
            if(resultado){
                this.copiarTablero();
                resultado = this.hayCamino(this.JUGADORINIX, this.JUGADORINIY, this.METAX, this.METAY);
                if(resultado){
                    this.copiarTablero();
                    resultado = this.hayCamino(this.FANTASMAINIX, this.FANTASMAINIY, this.JUGADORINIX, this.JUGADORINIY);
                }
            }
            return resultado;
        }
        copiarTablero(){
            for(let i=0; i<FILAS; i++){
                for(let j=0; j<COLUMNAS; j++){
                    this.copiaTablero[i][j] = this.casillas[i][j];
                }
            }
        }
        hayCamino(origenX, origenY, destinoX, destinoY){
            let resultado = false;
            if(origenX>=0 && origenX<FILAS && origenY>=0 && origenY<COLUMNAS && 
                this.copiaTablero[origenX][origenY]!=VALORMURO && this.copiaTablero[origenX][origenY]!=VALOREXPLORADO){
                if(origenX==destinoX && origenY==destinoY){
                    resultado = true;
                }
                else{
                    this.copiaTablero[origenX][origenY] = VALOREXPLORADO;
                    if(this.hayCamino(origenX-1, origenY, destinoX, destinoY) || this.hayCamino(origenX+1, origenY, destinoX, destinoY) ||
                       this.hayCamino(origenX, origenY-1, destinoX, destinoY) || this.hayCamino(origenX, origenY+1, destinoX, destinoY)){
                        resultado = true;
                    }
                }
            }
            return resultado;
        }
        mostrarMapa(){
            this.tableroMostrado.innerHTML = "";
            for(let i=0; i<FILAS; i++){
                for(let j=0; j<COLUMNAS; j++){
                    let elem = document.createElement("div");
                    if(i==this.fantasma.posicionX && j==this.fantasma.posicionY){
                        elem.setAttribute("class", "casilla fantasma");
                    }
                    else if(i==this.jugador.posicionX && j==this.jugador.posicionY){
                        elem.setAttribute("class", "casilla jugador");
                    }
                    else if(i==this.METAX && j==this.METAY){
                        elem.setAttribute("class", "casilla meta");
                    }
                    else{
                        if(this.casillas[i][j]==VALORMURO){
                            elem.setAttribute("class", "casilla muro");
                        }
                        else if(this.casillas[i][j]==VALORLIBRE){
                            elem.setAttribute("class", "casilla libre");
                        }
                    }
                    this.tableroMostrado.appendChild(elem);
                }
                let elem = document.createElement("div");
                elem.setAttribute("class", "limpia");
                this.tableroMostrado.appendChild(elem);
            }
        }
        jugadorAtrapado(){
            return this.jugador.posicionX==this.fantasma.posicionX && this.jugador.posicionY==this.fantasma.posicionY;
        }
        salidaEncontrada(){
            return this.jugador.posicionX==this.METAX && this.jugador.posicionY==this.METAY;
        }
        moverJugadorArriba(){
            if(this.jugador.posicionX>0 && this.casillas[this.jugador.posicionX-1][this.jugador.posicionY]!=VALORMURO){
                this.jugador.moverArriba();
            }
        }
        moverJugadorIzquierda(){
            if(this.jugador.posicionY>0 && this.casillas[this.jugador.posicionX][this.jugador.posicionY-1]!=VALORMURO){
                this.jugador.moverIzquierda();
            }
        }
        moverJugadorAbajo(){
            if(this.jugador.posicionX<FILAS-1 && this.casillas[this.jugador.posicionX+1][this.jugador.posicionY]!=VALORMURO){
                this.jugador.moverAbajo();
            }
        }
        moverJugadorDerecha(){
            if(this.jugador.posicionY<COLUMNAS-1 && this.casillas[this.jugador.posicionX][this.jugador.posicionY+1]!=VALORMURO){
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
                this.fantasma.moverArriba();
                puede = true;
            }
            return puede;
        }
        moverFantasmaIzquierda(){
            let puede = false;
            if(this.fantasma.posicionY>0 && this.casillas[this.fantasma.posicionX][this.fantasma.posicionY-1]!=VALORMURO){
                this.fantasma.moverIzquierda();
                puede = true;
            }
            return puede;
        }
        moverFantasmaAbajo(){
            let puede = false;
            if(this.fantasma.posicionX<FILAS-1 && this.casillas[this.fantasma.posicionX+1][this.fantasma.posicionY]!=VALORMURO){
                this.fantasma.moverAbajo();
                puede = true;
            }
            return puede;
        }
        moverFantasmaDerecha(){
            let puede = false;
            if(this.fantasma.posicionY<COLUMNAS-1 && this.casillas[this.fantasma.posicionX][this.fantasma.posicionY+1]!=VALORMURO){
                this.fantasma.moverDerecha();
                puede = true;
            }
            return puede;
        }
    }
}