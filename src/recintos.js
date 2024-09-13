import { Animais } from "./animais";
import { RecintosZoo } from "./recintos-zoo";

class Recinto {
    constructor() {
        this.numero = 0;
        this.biomas = [];
        this.tamanhoTotal = 0;
        this.animaisExistentes = [];
    }

    adicionaAnimais(animal, quantidade) {
        for (let i = 0; i < quantidade; i++) {
            this.animaisExistentes.push(animal)
        }
    }

    calculaEspacoLivre() {
        const espacoLivre = this.tamanhoTotal - this.calculaEspacoOcupado();
        return this.possuiEspeciesDiferentes()
            ? espacoLivre -1
            : espacoLivre;
    }

    calculaEspacoOcupado() {
        let espacosOcupados = 0;
        this.animaisExistentes.forEach(animal => {
            espacosOcupados += animal.tamanho;
        }
        );
        return espacosOcupados;
    }

    possuiEspeciesDiferentes() {
        return new Set(this.animaisExistentes).size > 1;
    }

    verificaSeRecintoJaPossuiEspecie(animal) {
        return this.animaisExistentes.includes(animal);
    }

    verificaSePossuiEspecieDiferenteDe(animal) {
        return !this.verificaSeRecintoVazio()
            && this.animaisExistentes.some(animalExistente =>
                animalExistente !== animal
            );
    }

    verificaSeRecintoVazio() {
        return this.animaisExistentes.length === 0;
    }

    verificaRecintoParaCarnivoro() {
        return this.animaisExistentes
            .some(animal => animal.carnivoro);
    }

    verificaRecintoParaHipopotamo() {
        if (this.animaisExistentes === 'HIPOPOTAMO' || novoAnimal === 'HIPOPOTAMO') {
            if (!this.biomas.includes('savana') || !this.biomas.includes('rio')) {
                return false;
            }
        }
    }

    verificaEspacoNecessario(animal, quantidade) {
        this.adicionaAnimais(animal, quantidade);
        const espacoLivre = this.calculaEspacoLivre();
        return espacoLivre >= 0;
    }   

    verificaCompatibilidadeDoBioma() {
        return this.animaisExistentes.some(biomas => this.biomas.includes(biomas));
    }

    apresenta() {
        return `Recinto ${this.numero} (espaço livre: ${this.calculaEspacoLivre()} total: ${this.tamanhoTotal})`;
    }
}

class RecintoBuilder {
    constructor() {
        this.recinto = new Recinto();
    }

    numero(numero) {
        this.recinto.numero = numero;
        return this
    }

    biomas(biomas) {
        this.recinto.biomas = biomas;
        return this;
    }

    tamanhoTotal(tamanhoTotal) {
        this.recinto.tamanhoTotal = tamanhoTotal;
        return this;
    }

    animais(animal, quantidade) {
        this.recinto.adicionaAnimais(animal, quantidade);
        return this;
    }

    build() {
        return this.recinto;
    }
}

export { Recinto, RecintoBuilder }