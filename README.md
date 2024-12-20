# Auth API

Este é um projeto de API de autenticação usando Node.js, Express, MongoDB e JWT. A API permite o registro de usuários, login, redefinição de senha e verificação de token.

## Requisitos

- Node.js
- MongoDB

## Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/auth-api.git
   cd auth-api
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:
   ```env
   MONGO_URI=sua-string-de-conexão-mongodb
   JWT_SECRET=sua-chave-secreta-jwt
   EMAIL_USER=seu-email@gmail.com
   EMAIL_PASS=sua-senha-de-email
   PORT=5000
   ```

## Uso

1. Inicie o servidor:
   ```sh
   npm start
   ```

2. A API estará disponível em `http://localhost:5000`.

## Endpoints

### Registro de Usuário

- **URL:** `/api/auth/register`
- **Método:** `POST`
- **Corpo da Requisição:**
  ```json
  {
    "username": "seu-usuario",
    "email": "seu-email@example.com",
    "password": "sua-senha",
    "cod": "seu-cod"
  }
  ```
- **Resposta de Sucesso:**
  ```json
  {
    "token": "seu-token-jwt",
    "message": "Usuário registrado com sucesso!"
  }
  ```

### Login de Usuário

- **URL:** `/api/auth/login`
- **Método:** `POST`
- **Corpo da Requisição:**
  ```json
  {
    "username": "seu-usuario",
    "password": "sua-senha"
  }
  ```
- **Resposta de Sucesso:**
  ```json
  {
    "token": "seu-token-jwt",
    "message": "Login bem-sucedido!"
  }
  ```

### Esqueci a Senha

- **URL:** `/api/auth/forgot-password`
- **Método:** `POST`
- **Corpo da Requisição:**
  ```json
  {
    "username": "seu-usuario"
  }
  ```
- **Resposta de Sucesso:**
  ```json
  {
    "message": "Link de redefinição de senha enviado para o e-mail."
  }
  ```

### Redefinir Senha

- **URL:** `/api/auth/reset-password/:token`
- **Método:** `POST`
- **Corpo da Requisição:**
  ```json
  {
    "password": "nova-senha"
  }
  ```
- **Resposta de Sucesso:**
  ```json
  {
    "message": "Senha redefinida com sucesso!"
  }
  ```

### Verificar Token

- **URL:** `/api/auth/verify`
- **Método:** `POST`
- **Cabeçalho da Requisição:**
  ```json
  {
    "Authorization": "Bearer seu-token-jwt"
  }
  ```
- **Resposta de Sucesso:**
  ```json
  {
    "message": "Token válido.",
    "userId": "id-do-usuario"
  }
  ```

## Estrutura do Projeto

```plaintext
auth-api/
├── models/
│   └── user.js
├── routes/
│   └── auth.js
├── public/
│   └── login.html
├── server.js
├── package.json
└── .env
```
