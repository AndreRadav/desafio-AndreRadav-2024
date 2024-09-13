import { RecintoBuilder } from "./recintos";
import { Animais, verificaSeAnimalValido, BuscaAnimal} from "./animais";
import { Biomas } from "./biomas";

const recintosZoo = [
    new RecintoBuilder()
        .numero(1)
        .biomas([Biomas.SAVANA])
        .tamanhoTotal(10)
        .animais(Animais.MACACO, 3)
        .build(),

    new RecintoBuilder()
        .numero(2)
        .biomas([Biomas.FLORESTA])
        .tamanhoTotal(5)
        .build(),

    new RecintoBuilder()
        .numero(3)
        .biomas([Biomas.SAVANA, Biomas.RIO])
        .tamanhoTotal(7)
        .animais(Animais.GAZELA, 1)
        .build(),

    new RecintoBuilder()
        .numero(4)
        .biomas([Biomas.RIO])
        .tamanhoTotal(8)
        .build(),

    new RecintoBuilder()
        .numero(5)
        .biomas([Biomas.SAVANA])
        .tamanhoTotal(9)
        .animais(Animais.LEAO, 1)
        .build(),
]

class RecintosZoo {

    analisaRecintos(animal, quantidade) {
        try {
            let analisaRecintosDto = this.montaAnalisaRecintosDto(animal, quantidade);

            this.verificaAnimalValido(analisaRecintosDto);
            this.verificaQuantidadeDeAnimais(analisaRecintosDto);
            this.verificaSeRecintoTemBiomaCompativel(analisaRecintosDto);
            this.verificaPorHabitoAlimentar(analisaRecintosDto);
            this.verificaRecintosComEspacoNecessario(analisaRecintosDto);
            this.verificaRecintosParaHipopotamos(analisaRecintosDto);
            this.verificaRecintosParaMacacos(analisaRecintosDto);
            this.verificaRecintosViaveisDisponiveis(analisaRecintosDto)
            this.adicionaAnimaisNosRecintosViaveis(analisaRecintosDto);

            const recintosViaveis = this.buscaRecintosViaveis(analisaRecintosDto);

            return { recintosViaveis };

        } catch (error) {
            return { erro : error.message }
        }
    }

    montaAnalisaRecintosDto(animal, quantidade) {
        return  {
            animal,
            quantidade, 
            recintosViaveis: recintosZoo
        };
    }

    verificaAnimalValido(analisaRecintosDto) {
        verificaSeAnimalValido(analisaRecintosDto.animal);
    }

    verificaQuantidadeDeAnimais(analisaRecintosDto) {
        const quantidade = analisaRecintosDto.quantidade;
        if (quantidade <= 0 || !Number.isInteger) {
            throw new Error("Quantidade inválida");
        }
    }

    verificaSeRecintoTemBiomaCompativel(analiseRecintosDto) {
        const animal = BuscaAnimal(analiseRecintosDto.animal);
        const recintosTemBiomaCompativel = analiseRecintosDto.recintosViaveis.filter(recinto =>
            recinto.biomas.some(bioma => 
                animal.biomas.includes(bioma)
            )
        );
        analiseRecintosDto.recintosViaveis = [... recintosTemBiomaCompativel];
    }

    verificaPorHabitoAlimentar(analiseRecintosDto) {
        const animal = BuscaAnimal(analiseRecintosDto.animal);
        const recintosPorHabitoAlimentar = analiseRecintosDto.recintosViaveis.filter(recinto => {
            return recinto.verificaSeRecintoVazio()
            || (animal.carnivoro && recinto.verificaRecintoParaCarnivoro())
            || (!animal.carnivoro && !recinto.verificaRecintoParaCarnivoro())
        });
        analiseRecintosDto.recintosViaveis = [...recintosPorHabitoAlimentar];
    }

    verificaRecintosComEspacoNecessario(analisaRecintosDto) {
        const recintosComEspaco = analisaRecintosDto.recintosViaveis.filter(recinto =>
            this.calculaEspacoLivreDoRecintoAposInclusao(analisaRecintosDto, recinto) >= 0
        );
        analisaRecintosDto.recintosViaveis = [...recintosComEspaco];
    }

    calculaEspacoLivreDoRecintoAposInclusao(analisaRecintosDto, recinto) {
        const recintoJaTemEspeciesDiferentes = recinto.possuiEspeciesDiferentes();
        const recintoTemAlgumaEspeciaDirenteDaIncluida = !recinto.verificaSeRecintoVazio()
            && !recinto.verificaSeRecintoJaPossuiEspecie(analisaRecintosDto.animal);
        const espacoLivreAposInclusao = recinto.calculaEspacoLivre() - analisaRecintosDto.quantidade;
        
        return recintoJaTemEspeciesDiferentes || recintoTemAlgumaEspeciaDirenteDaIncluida
            ? espacoLivreAposInclusao -1
            : espacoLivreAposInclusao;
    }
 
    verificaRecintosParaHipopotamos(analiseRecintosDto) {
        if (analiseRecintosDto.animal !== Animais.HIPOPOTAMO) {
            return;
        }
        const recintosParaHipopotamos = analiseRecintosDto.recintosViaveis.filter(recinto => {
            const recintoTemAnimalDiferente = recinto.verificaSePossuiEspecieDiferenteDe(
                analiseRecintosDto.animal
            );
            const recintoTemSavanaERio = recinto.biomas.include(Biomas.SAVANA)
                && recinto.biomas.include(Biomas.RIO);

            return recintoTemAnimalDiferente
                ? recintoTemSavanaERio
                : true;
        });
        analiseRecintosDto.recintosViaveis = [...recintosParaHipopotamos];
    }

    verificaRecintosParaMacacos(analiseRecintosDto) {
        if (analiseRecintosDto.animal !== Animais.MACACO || analiseRecintosDto.quantidade > 1) {
            return;
        }
        const recintoParaMacacoSozinho = analiseRecintosDto.recintosViaveis.filter(recinto => {
            return !recinto.verificaSeRecintoVazio();
        });
        analiseRecintosDto.recintosViaveis = [...recintoParaMacacoSozinho];
    }

    verificaRecintosViaveisDisponiveis(analisaRecintosDto) {
        if (analisaRecintosDto.recintosViaveis.length === 0) {
            throw new Error('Não há recinto viável');
        }
    }

    adicionaAnimaisNosRecintosViaveis(analisaRecintosDto) {
        const animalEnum = BuscaAnimal(analisaRecintosDto.animal);
        const quantidade = analisaRecintosDto.quantidade;

        analisaRecintosDto.recintosViaveis.forEach(recinto =>
            recinto.adicionaAnimais(animalEnum, quantidade)
        );
    }

    buscaRecintosViaveis(analisaRecintosDto) {
        return analisaRecintosDto.recintosViaveis.map(
            recinto => recinto.apresenta()
        );
    }

}
   
export { RecintosZoo as RecintosZoo };
