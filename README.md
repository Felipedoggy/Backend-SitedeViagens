# Cadastro de Pacotes de Viagens 🛫🌍

Este projeto faz parte do sistema de gerenciamento de pacotes de viagens. Ele inclui um **front-end completo** e um **back-end com API RESTful**, permitindo que os usuários cadastrem, editem, visualizem e excluam pacotes de viagens.

---

## 📌 Tecnologias Utilizadas

### 🔹 **Front-end**
- HTML5, CSS3 e JavaScript (ES6+)
- Bootstrap para estilização responsiva
- Consumo da API via Fetch API

### 🔹 **Back-end**
- Node.js com Express
- Banco de Dados MySQL
- API RESTful com os métodos **GET, POST, PUT e DELETE**
- Cors para integração segura com o front-end

---

## ✨ Funcionalidades

### **Front-end**
✔️ Exibição dos pacotes cadastrados em uma tabela interativa  
✔️ Formulário dinâmico para **cadastro, atualização e exclusão** de pacotes  
✔️ Mensagens de sucesso ou erro após cada ação  
✔️ Botão "Limpar Formulário" para resetar os campos e reativar o botão de cadastro  

### **Back-end**
✔️ Endpoints para CRUD de pacotes de viagem:  
- `GET /cadastro` → Retorna todos os pacotes  
- `POST /cadastro` → Cria um novo pacote  
- `PUT /cadastro` → Atualiza um pacote existente  
- `DELETE /cadastro` → Remove um pacote do banco de dados  

---

## ⚙️ Como Instalar e Rodar o Projeto

### **1️⃣ Clonar o Repositório**
Abra o terminal e execute:
```sh
git clone [https://github.com/seu-usuario/Backend-SitedeViagens.git](https://github.com/Felipedoggy/Backend-SitedeViagens)
cd Backend-SitedeViagens
