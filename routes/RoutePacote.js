import { Router } from "express";

import PacoteCtrl from "../control/PacoteCtrl.js";

const RoutePacote = new Router();
const pacoteCtrl = new PacoteCtrl();

RoutePacote.post('/', pacoteCtrl.gravar)
.put('/', pacoteCtrl.atualizar)
.delete('/', pacoteCtrl.excluir)
.get('/', pacoteCtrl.consultar)
.get('/:id', pacoteCtrl.consultarPeloID);

export default RoutePacote;
