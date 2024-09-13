import { Biomas } from "./biomas";

const Animais = {
    LEAO: { tamanho: 3, biomas: [Biomas.SAVANA], carnivoro: true },
    LEOPARDO: { tamanho: 2, biomas: [Biomas.SAVANA], carnivoro: true },
    CROCODILO: { tamanho: 3, biomas: [Biomas.RIO], carnivoro: true },
    MACACO: { tamanho: 1, biomas: [Biomas.SAVANA, Biomas.FLORESTA], carnivoro: false },
    GAZELA: { tamanho: 2, biomas: [Biomas.SAVANA], carnivoro: false},
    HIPOPOTAMO: { tamanho: 4, biomas: [Biomas.SAVANA, Biomas.RIO], carnivoro: false },
}

const verificaSeAnimalValido = (animal) =>  {
    if(!Object.keys(Animais).includes(animal)) {
        throw new Error("Animal inválido");
    }
}

const BuscaAnimal = (animal) => {
    return Animais[animal];
}

export { Animais }
export { verificaSeAnimalValido }
export { BuscaAnimal }