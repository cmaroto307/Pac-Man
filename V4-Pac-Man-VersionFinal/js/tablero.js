pacman.FILAS = 10;
pacman.COLUMNAS = 10;
pacman.NIVELES = 3;
pacman.FANTASMA = 'F';
pacman.JUGADOR = 'J';
pacman.ENTRADA = 'E';
pacman.SALIDA = 'S';
pacman.VALORMURO = 1;
pacman.VALORLIBRE = 0;
pacman.VALOREXPLORADO = -1;

pacman.Tablero = class {
    constructor(elemTablero){
        this.tableroMostrado = elemTablero;
        this.inicializarVariablesDePosicion();
        this.casillas = new Array(pacman.NIVELES);
        for(let i=0; i<pacman.NIVELES; i++) {
            this.casillas[i] = new Array(pacman.FILAS);
        }
        for(let i=0; i<pacman.NIVELES; i++) {
            for(let j=0; j<pacman.FILAS; j++) {
                this.casillas[i][j] = new Array(pacman.COLUMNAS);
            }
        }
        this.generarMapa();
        this.entidades = [];
        this.aniadirEntidad(pacman.JUGADOR);
        this.aniadirEntidad(pacman.FANTASMA);
        this.aniadirEntidad(pacman.SALIDA);
        this.aniadirEntidad(pacman.ENTRADA);
        this.mostrarMapa();
    }
    inicializarVariablesDePosicion(){
        this.nivelActual = 0;
        this.jugadorIniX = 0;
        this.jugadorIniY = 0;
        this.fantasmaIniX = Math.floor(pacman.FILAS/2);
        this.fantasmaIniY = Math.floor(pacman.COLUMNAS/2);
        this.salidaX = pacman.FILAS-1;
        this.salidaY = pacman.COLUMNAS-1;
    }
    aniadirEntidad(tipo) {
        if (tipo === pacman.JUGADOR) {
            let jugador = new pacman.Entidad(this.jugadorIniX,this.jugadorIniY, this.nivelActual, pacman.JUGADOR);
            this.entidades.push(jugador);
        }
        else if (tipo === pacman.FANTASMA) {
            let fantasma = new pacman.Entidad(this.fantasmaIniX,this.fantasmaIniY, this.nivelActual, pacman.FANTASMA);
            this.entidades.push(fantasma);
        }
        else if (tipo === pacman.SALIDA) {
            let salida = new pacman.Entidad(this.salidaX,this.salidaY, this.nivelActual, pacman.SALIDA);
            this.entidades.push(salida);
        } 
        else if (tipo === pacman.ENTRADA) {
            let entrada = new pacman.Entidad(this.jugadorIniX,this.jugadorIniY, this.nivelActual, pacman.ENTRADA);
            this.entidades.push(entrada);
        } 
    }
    generarMapa(){
        do{
            do{
                for(let i=0; i<pacman.FILAS; i++){
                    for(let j=0; j<pacman.COLUMNAS; j++){
                        this.casillas[this.nivelActual][i][j] = Math.floor(Math.random() * 2);
                    }
                }
                this.casillas[this.nivelActual][this.jugadorIniX][this.jugadorIniY] = pacman.VALORLIBRE;
                this.casillas[this.nivelActual][this.fantasmaIniX][this.jugadorIniY] = pacman.VALORLIBRE;
                this.casillas[this.nivelActual][this.salidaX][this.salidaY] = pacman.VALORLIBRE;
            }while(!this.mapaValido());
            this.nivelActual++;
            let aux = this.jugadorIniX;
            this.jugadorIniX = this.salidaX;
            this.salidaX = aux;
            aux = this.jugadorIniY;
            this.jugadorIniY = this.salidaY;
            this.salidaY = aux;
        }while(this.nivelActual<pacman.NIVELES)
        this.inicializarVariablesDePosicion();
    }
    mapaValido(){
        this.copiarTablero();
        let resultado = this.hayCamino(this.jugadorIniX, this.jugadorIniY, this.salidaX, this.salidaY);
        if(resultado){
            this.copiarTablero();
            resultado = this.hayCamino(this.fantasmaIniX, this.fantasmaIniY, this.jugadorIniX, this.jugadorIniY);
        }
        return resultado;
    }
    copiarTablero(){
        this.copiaTablero = JSON.parse(JSON.stringify(this.casillas[this.nivelActual]));
    }
    hayCamino(origenX, origenY, destinoX, destinoY){
        let resultado = false;
        if(origenX>=0 && origenX<pacman.FILAS && origenY>=0 && origenY<pacman.COLUMNAS && 
            this.copiaTablero[origenX][origenY]!=pacman.VALORMURO && this.copiaTablero[origenX][origenY]!=pacman.VALOREXPLORADO){
            if(origenX==destinoX && origenY==destinoY){
                resultado = true;
            }
            else{
                this.copiaTablero[origenX][origenY] = pacman.VALOREXPLORADO;
                if(this.hayCamino(origenX-1, origenY, destinoX, destinoY) || this.hayCamino(origenX+1, origenY, destinoX, destinoY) ||
                    this.hayCamino(origenX, origenY-1, destinoX, destinoY) || this.hayCamino(origenX, origenY+1, destinoX, destinoY)){
                    resultado = true;
                }
            }
        }
        return resultado;
    }
    crearTableroAMostrar(){
        this.copiarTablero();
        for (let i=0; i<this.entidades.length; i++) {
            let entidad = this.entidades[i];
            if(entidad.z==this.nivelActual){
                let casilla = this.copiaTablero[entidad.x][entidad.y];
                if(typeof casilla != 'object'){
                    this.copiaTablero[entidad.x][entidad.y] = entidad;
                }
                else{
                    if(casilla.tipo===pacman.SALIDA || casilla.tipo===pacman.ENTRADA){
                        this.copiaTablero[entidad.x][entidad.y] = entidad;
                    }
                    else if(casilla.tipo===pacman.JUGADOR && entidad.tipo===pacman.FANTASMA){
                        this.copiaTablero[entidad.x][entidad.y] = entidad;
                    }
                }
            }
        }
    }
    mostrarMapa(){
        this.tableroMostrado.innerHTML = "";
        this.crearTableroAMostrar();
        for(let i=0; i<this.copiaTablero.length; i++){
            for(let j=0; j<this.copiaTablero[i].length; j++){
                let elem = document.createElement("div");
                let casilla = this.copiaTablero[i][j];
                if(typeof casilla == 'object'){
                    if(casilla.tipo === pacman.FANTASMA){
                        elem.setAttribute("class", "casilla fantasma");
                    }
                    else if(casilla.tipo === pacman.JUGADOR){
                        elem.setAttribute("class", "casilla jugador");
                    }
                    else if(casilla.tipo === pacman.SALIDA){
                        elem.setAttribute("class", "casilla salida");
                    }
                    else if(casilla.tipo === pacman.ENTRADA){
                        if(this.nivelActual>0){
                            elem.setAttribute("class", "casilla entrada");
                        }
                        else{
                            elem.setAttribute("class", "casilla libre");
                        }
                    }
                }
                else{
                    if(casilla == pacman.VALORMURO){
                        elem.setAttribute("class", "casilla muro");
                    }
                    else if(casilla == pacman.VALORLIBRE){
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
    comprobarEntidadEnCasilla(tipo, x, y, z){
        let encontrado = false;
        for (let i=0; i<this.entidades.length && !encontrado; i++) {
            if(x==this.entidades[i].x && y==this.entidades[i].y && z==this.entidades[i].z && tipo===this.entidades[i].tipo){
                encontrado = true;
            }
        }
        return encontrado;
    }
    jugadorAtrapado(entidad){
        let atrapado = false;
        for (let i=0; i<this.entidades.length && !atrapado; i++) {
            if(entidad.x==this.entidades[i].x && entidad.y==this.entidades[i].y && entidad.z==this.entidades[i].z){
                if((entidad.tipo===pacman.JUGADOR && this.entidades[i].tipo===pacman.FANTASMA) ||
                   (entidad.tipo===pacman.FANTASMA && this.entidades[i].tipo===pacman.JUGADOR)){
                    atrapado = true;
                }
            }
        }
        return atrapado;
    }
    salidaEncontrada(entidad){
        let resultado = false;
        if(entidad.tipo===pacman.JUGADOR){
            if(this.comprobarEntidadEnCasilla(pacman.SALIDA, entidad.x, entidad.y, entidad.z)){
                if(entidad.z==pacman.NIVELES-1){
                    resultado = true;
                }
                else{
                    this.nivelActual = entidad.z+1;
                    let aux = this.jugadorIniX;
                    this.jugadorIniX = this.salidaX;
                    this.salidaX = aux;
                    aux = this.jugadorIniY;
                    this.jugadorIniY = this.salidaY;
                    this.salidaY = aux;
                    for (let i=0; i<this.entidades.length; i++) {
                        if(this.entidades[i].tipo===pacman.JUGADOR){
                            this.entidades[i].x = this.jugadorIniX
                            this.entidades[i].y = this.jugadorIniY;
                            this.entidades[i].z = this.nivelActual;
                        }
                        else if(this.entidades[i].tipo===pacman.FANTASMA){
                            this.entidades[i].x = this.fantasmaIniX
                            this.entidades[i].y = this.fantasmaIniY;
                            this.entidades[i].z = this.nivelActual;
                        }
                        else if(this.entidades[i].tipo===pacman.SALIDA){
                            this.entidades[i].x = this.salidaX
                            this.entidades[i].y = this.salidaY;
                            this.entidades[i].z = this.nivelActual;
                        }
                        else if(this.entidades[i].tipo===pacman.ENTRADA){
                            this.entidades[i].x = this.jugadorIniX
                            this.entidades[i].y = this.jugadorIniY;
                            this.entidades[i].z = this.nivelActual;
                        }
                    }
                }
            }
            else if(entidad.z>0 && this.comprobarEntidadEnCasilla(pacman.ENTRADA, entidad.x, entidad.y, entidad.z)){
                this.nivelActual = entidad.z-1;
                let aux = this.jugadorIniX;
                this.jugadorIniX = this.salidaX;
                this.salidaX = aux;
                aux = this.jugadorIniY;
                this.jugadorIniY = this.salidaY;
                this.salidaY = aux;
                for (let i=0; i<this.entidades.length; i++) {
                    if(this.entidades[i].tipo===pacman.JUGADOR){
                        this.entidades[i].x = this.salidaX
                        this.entidades[i].y = this.salidaY;
                        this.entidades[i].z = this.nivelActual;
                    }
                    else if(this.entidades[i].tipo===pacman.FANTASMA){
                        this.entidades[i].x = this.fantasmaIniX
                        this.entidades[i].y = this.fantasmaIniY;
                        this.entidades[i].z = this.nivelActual;
                    }
                    else if(this.entidades[i].tipo===pacman.SALIDA){
                        this.entidades[i].x = this.salidaX
                        this.entidades[i].y = this.salidaY;
                        this.entidades[i].z = this.nivelActual;
                    }
                    else if(this.entidades[i].tipo===pacman.ENTRADA){
                        this.entidades[i].x = this.jugadorIniX
                        this.entidades[i].y = this.jugadorIniY;
                        this.entidades[i].z = this.nivelActual;
                    }
                }
            }
        }
        return resultado;
    }
    moverEntidad(entidad, x, y){
        let resultado = false;
        let mapa = this.casillas[entidad.z];
        if(x>=0 && y>=0 && x<mapa.length && y<mapa[x].length){
            if(mapa[x][y] == pacman.VALORLIBRE){
                entidad.x = x;
                entidad.y = y;
                resultado = true;
            }
        }
        return resultado;
    }
    moverFantasma(entidad){
        let puede = false;
        while(!puede){
            let dado = Math.floor(Math.random() * 4);
            switch(dado){
                case 0:
                    puede = this.moverEntidad(entidad, entidad.x-1, entidad.y);
                break;
                case 1:
                    puede = this.moverEntidad(entidad, entidad.x, entidad.y-1);
                break;
                case 2:
                    puede = this.moverEntidad(entidad, entidad.x+1, entidad.y);
                break;
                case 3:
                    puede = this.moverEntidad(entidad, entidad.x, entidad.y+1);
                break;
            }
        }
    }
}