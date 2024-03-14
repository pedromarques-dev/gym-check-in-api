# App

GymPass style app

## RF's (Requisitos Funcionais)

- [X] Deve ser possível se cadastrar;
- [X] Deve ser possível se autenticar;
- [X] Deve ser possível obter o perfil de um usuário logado
- [X] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- [X] Deve ser possível o usuário obter seu histórico de check-ins;
- [X] Deve ser possível o usuário buscar academias proximas (ATÉ 10KM);
- [X] Deve ser possível o usuário buscar academias pelo nome;
- [X] Deve ser possível o usuário realizar check-in em uma academia;
- [x] Deve ser possível o usuário validar o check-in de um usuário;
- [x] Deve ser possível cadastrar UMA academia;


## RN's (Regras de Negócio)

- [X] O usuário nao deve poder se cadastrar com um e-mail duplicado
- [X] O usuário nao deve poder fazer 2 check-ins no mesmo dia;
- [x] O usuário nao pode fazer check-in se nao estiver perto (100m) da academia;
- [X] O check-in só pode ser validado até 20min após criado;
- [x] O check-in só pode ser validado por administradores;
- [x] A academia só pode ser cadastrada por administradores

## RNF's (Requisitos Nao Funcionais)

- [X] A senha do usuário precisa estar criptografada
- [X] Os dados da aplicação precisa estar persistidos em um banco postgresSQL
- [X] Todas listas de dados precisam estar paginada com 20 itens por pagina
- [x] O usuário deve ser identificado por um JWT