import conectar from "./DB.js";
import PacoteViagem from "../models/PacoteViagem.js";

export default class PacoteViagemDB {

    constructor() {
        this.init();
    }

async init() {
    try {
        const conexao = await conectar();
        const sql = `CREATE TABLE IF NOT EXISTS pacotes_viagens (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            departure DATE NOT NULL,
            destination VARCHAR(100) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            description TEXT NOT NULL,
            duration VARCHAR(50) NOT NULL,
            departureLocation VARCHAR(100) NOT NULL,
            availableSpots INT NOT NULL,
            image LONGTEXT NOT NULL
        )`;
        await conexao.execute(sql);
    }
    catch(erro) {
        console.error("Erro ao criar a tabela pacotes_viagens:", erro);
    }
}


async criar(pacote) {
        if (pacote instanceof PacoteViagem) {
            const conexao = await conectar();
            const sql = `INSERT INTO pacotes_viagens (name, departure, destination, price, description, duration, departureLocation, availableSpots, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const parametros = [pacote.name, pacote.departure, pacote.destination, pacote.price, pacote.description, pacote.duration, pacote.departureLocation, pacote.availableSpots, pacote.image];
            const resultado = await conexao.execute(sql, parametros);
            return resultado[0].insertId;
        }
        
    }
async alterar(pacote) {
        if (pacote instanceof PacoteViagem) {
            const conexao = await conectar();
            const sql = `UPDATE pacotes_viagens SET name = ?, departure = ?, destination = ?, price = ?, description = ?, duration = ?, departureLocation = ?, availableSpots = ?, image = ? WHERE id = ?`;
            const parametros = [pacote.name, pacote.departure, pacote.destination, pacote.price, pacote.description, pacote.duration, pacote.departureLocation, pacote.availableSpots, pacote.image, pacote.id];
            await conexao.execute(sql, parametros);
            conexao.release();
        }
    }
    


async excluirPacote(pacote) {
    if (pacote instanceof PacoteViagem) {
        const conexao = await conectar();
        const sql = `DELETE FROM pacotes_viagens WHERE id = ?`;
        const parametros = [pacote.id];
        await conexao.execute(sql, parametros);
        conexao.release();
    }
    }

    async consultar(termo) {
        const conexao = await conectar();
        const sql = `SELECT * FROM pacotes_viagens ORDER BY id`;
        const [pacotes] = await conexao.execute(sql);
        conexao.release();
        let listaPacotes = [];
        for (const pacoteID of pacotes) {
            const pacote = new PacoteViagem(pacoteID.id, pacoteID.name, pacoteID.departure, pacoteID.destination, pacoteID.price, pacoteID.description, pacoteID.duration, pacoteID.departureLocation, pacoteID.availableSpots, pacoteID.image);
            listaPacotes.push(pacote);
        }
        return listaPacotes;
    }

    async buscarPorId(id) {
        const conexao = await conectar();
        const sql = `SELECT * FROM pacotes_viagens WHERE id = ?`;
        const [pacotes] = await conexao.execute(sql, [id]);
        conexao.release();
        if (pacotes.length > 0) {
            const pacoteID = pacotes[0];
            const pacote = new PacoteViagem(pacoteID.id, pacoteID.name, pacoteID.departure, pacoteID.destination, pacoteID.price, pacoteID.description, pacoteID.duration, pacoteID.departureLocation, pacoteID.availableSpots, pacoteID.image);
            return pacote;
        }
        return null;
    }

}