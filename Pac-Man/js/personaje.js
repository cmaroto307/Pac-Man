var personaje = personaje || {};
personaje = {
    Personaje:class{
        constructor(posicionX, posicionY){
            this.posicionX = posicionX;
            this.posicionY = posicionY;
        }
        moverArriba(){
            this.posicionX--;
        }
        moverIzquierda(){
            this.posicionY--;
        }
        moverAbajo(){
            this.posicionX++;
        }
        moverDerecha(){
            this.posicionY++;
        }
    }
}