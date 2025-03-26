import Pacote from '../models/PacoteViagem.js';

export default class PacoteCtrl {
    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if(requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const name = dados.name;
            const departure = dados.departure;
            const destination = dados.destination;
            const price = dados.price;
            const description = dados.description;
            const duration = dados.duration;
            const departureLocation = dados.departureLocation;
            const availableSpots = dados.availableSpots;
            const image = dados.image;
            if(name && departure && destination && price && description && duration && departureLocation && availableSpots && image) {
                const pacote = new Pacote(0, name, departure, destination, price, description, duration, departureLocation, availableSpots, image);
                pacote.criar().then(() => {
                    resposta.status(201).json({
                        status: true,
                        codigo: pacote.id,
                        mensagem: 'Pacote de viagem cadastrado com sucesso'
                    });
                }).catch(erro => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: `Erro ao cadastrar o pacote de viagem: ${erro.message}`
                    })
                });
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: 'informe corretamente os dados do pacote de viagem'
                });
            }
          }
        else {
            resposta.status(400).json({
                status:false,
                mensagem: 'Requisição inválida consulte a documentação da API'
            });
        }

}
atualizar(requisicao, resposta) {
    
        resposta.type('application/json');
        if(requisicao.method === 'PUT' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const id = dados.id;
            const name = dados.name;
            const departure = dados.departure;
            const destination = dados.destination;
            const price = dados.price;
            const description = dados.description;
            const duration = dados.duration;
            const departureLocation = dados.departureLocation;
            const availableSpots = dados.availableSpots;
            const image = dados.image;
            if(id && name && departure && destination && price && description && duration && departureLocation && availableSpots && image) {
                const pacote = new Pacote(id, name, departure, destination, price, description, duration, departureLocation, availableSpots, image);
                pacote.alterar().then(() => {
                    resposta.status(201).json({
                        status: true,
                        mensagem: 'Pacote de viagem atualizado com sucesso'
                    });
                }).catch(erro => {
                    resposta.status(500).json({
                        status: false,
                        mensagem: `Erro ao atualizar o pacote de viagem: ${erro.message}`
                    })
                });
            }
            else {
                resposta.status(400).json({
                    status: false,
                    mensagem: 'informe corretamente os dados do pacote de viagem'
                });
            }
          }
        else {
            resposta.status(400).json({
                status:false,
                mensagem: 'Requisição inválida consulte a documentação da API'
            });
        }
    
}
excluir(requisicao, resposta) {
    
    resposta.type('application/json');
    if(requisicao.method === 'DELETE' && requisicao.is('application/json')) {
        const dados = requisicao.body;
        const id = dados.id;
        if(id) {
            const pacote = new Pacote(id);
            pacote.excluirPacote().then(() => {
                resposta.status(201).json({
                    status: true,
                    mensagem: 'Pacote de viagem excluido com sucesso'
                });
            }).catch(erro => {
                resposta.status(500).json({
                    status: false,
                    mensagem: `Erro ao excluir o pacote de viagem: ${erro.message}`
                })
            });
        }
        else {
            resposta.status(400).json({
                status: false,
                mensagem: 'informe corretamente o id do pacote de viagem'
            });
        }
      }
    else {
        resposta.status(400).json({
            status:false,
            mensagem: 'Requisição inválida consulte a documentação da API'
        });
    }

}
consultar(requisicao, resposta) {
    
    resposta.type('application/json');
    if(requisicao.method === 'GET') {

      const pacote = new Pacote();
            pacote.consultar('').then((listaPacotes) => {
                resposta.status(200).json(
                    {
                        status: true,
                        pacotes: listaPacotes
                    }
                );
            }).catch(erro => {
                resposta.status(500).json({
                    status: false,
                    mensagem: `Erro ao buscar o pacote de viagem: ${erro.message}`
                })
            });
        }
    else {
        resposta.status(400).json({
            status:false,
            mensagem: 'Requisição inválida consulte a documentação da API'
        });
    }

}
consultarPeloID(requisicao, resposta) {
    
    resposta.type('application/json');
    const id = requisicao.params['id'];
    if(requisicao.method === 'GET') {

      const pacote = new Pacote();
            pacote.buscarPorId(id).then((pacotes) => {
                resposta.status(201).json(pacotes);
            }).catch(erro => {
                resposta.status(500).json({
                    status: false,
                    mensagem: `Erro ao buscar o pacote de viagem: ${erro.message}`
                })
            });
        }
    else {
        resposta.status(400).json({
            status:false,
            mensagem: 'Requisição inválida consulte a documentação da API'
        });
    }

}
}