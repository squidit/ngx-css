# Tutorial: Configurar a lib ngx-css para publicação no GitHub Packages

Este documento é um passo a passo para **configurar o repositório da lib** (@squidit/ngx-css) para ser publicada no GitHub Packages. A lib está no GitHub da organização **squidit**. Usamos **pnpm**.

---

## Índice

- [Tutorial: Configurar a lib ngx-css para publicação no GitHub Packages](#tutorial-configurar-a-lib-ngx-css-para-publicação-no-github-packages)
  - [Índice](#índice)
  - [1. Requisitos](#1-requisitos)
  - [2. Passo 1: Ajustar o package.json do pacote](#2-passo-1-ajustar-o-packagejson-do-pacote)
    - [2.1 Verificar o nome](#21-verificar-o-nome)
    - [2.2 Verificar o repository](#22-verificar-o-repository)
    - [2.3 Adicionar publishConfig (recomendado)](#23-adicionar-publishconfig-recomendado)
  - [3. Passo 2: Criar o .npmrc na raiz do repositório](#3-passo-2-criar-o-npmrc-na-raiz-do-repositório)
  - [4. Passo 3: Criar o workflow do GitHub Actions](#4-passo-3-criar-o-workflow-do-github-actions)
    - [4.1 Estrutura de pastas](#41-estrutura-de-pastas)
    - [4.2 Conteúdo do workflow](#42-conteúdo-do-workflow)
    - [4.3 Explicação rápida](#43-explicação-rápida)
    - [4.4 Ajustar caminhos (se necessário)](#44-ajustar-caminhos-se-necessário)
  - [5. Passo 4: Publicar (criar um release)](#5-passo-4-publicar-criar-um-release)
  - [6. Publicação manual (opcional)](#6-publicação-manual-opcional)
  - [7. Checklist final](#7-checklist-final)

---

## 1. Requisitos

- Repositório **squidit/ngx-css** no GitHub (organização).
- O nome do pacote no **`src/package.json`** (o que será publicado) deve ser no formato **@squidit/ngx-css** (scope = owner do repositório, no caso a organização **squidit**).
- GitHub Packages aceita apenas **scoped packages** (`@owner/nome-do-pacote`); pacotes sem scope não podem ser publicados no registry do GitHub.

Não é necessário criar token na sua conta para o CI: o workflow usa o **GITHUB_TOKEN** fornecido automaticamente pelo GitHub.

---

## 2. Passo 1: Ajustar o package.json do pacote

O arquivo que será publicado é o **`src/package.json`** (o que acompanha o build da lib).

### 2.1 Verificar o nome

O campo **`name`** deve ser exatamente o scope da organização + nome do pacote, em minúsculas:

```json
"name": "@squidit/ngx-css"
```

### 2.2 Verificar o repository

O campo **`repository`** deve apontar para o repositório correto:

```json
"repository": {
  "type": "git",
  "url": "git+https://github.com/squidit/ngx-css"
}
```

Ou, em formato curto:

```json
"repository": "https://github.com/squidit/ngx-css"
```

### 2.3 Adicionar publishConfig (recomendado)

Adicione **`publishConfig`** para fixar o registry de publicação no GitHub Packages:

```json
"publishConfig": {
  "registry": "https://npm.pkg.github.com"
}
```

Assim, ao rodar `pnpm publish` (ou `npm publish`), o pacote será enviado ao GitHub Packages e não ao npm público.

**Exemplo de trecho final do `src/package.json`:**

```json
{
  "name": "@squidit/ngx-css",
  "version": "2.0.1",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/squidit/ngx-css"
  },
  ...
}
```

---

## 3. Passo 2: Criar o .npmrc na raiz do repositório

Na **raiz** do repositório ngx-css (mesmo nível do `package.json` da raiz), crie ou edite o arquivo **`.npmrc`**.

Conteúdo:

```ini
@squidit:registry=https://npm.pkg.github.com
```

Isso indica que todo pacote do scope **@squidit** deve ser resolvido e publicado no registry do GitHub Packages. Você pode commitar este arquivo.

---

## 4. Passo 3: Criar o workflow do GitHub Actions

Crie o arquivo **`.github/workflows/deploy-github-packages.yml`** no repositório.

### 4.1 Estrutura de pastas

```
ngx-css/
├── .github/
│   └── workflows/
│       └── deploy-github-packages.yml
├── .npmrc
├── package.json
├── src/
│   ├── package.json
│   └── ...
└── ...
```

### 4.2 Conteúdo do workflow

O workflow segue a mesma estrutura do `deploy-npm.yml`, trocando apenas o registry, o scope e o token:

```yaml
name: Publish to GitHub Packages
on:
  release:
    types: [created]
jobs:
  build:
    permissions:
      contents: read
      packages: write
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@squidit'
      - name: Install dependencies and build 🔧
        run: npm install && npm run build:prod
      - name: Organize Files 📁
        run: cp -r dist/@squidit/ngx-css src/dist && cp README.md src/dist/README.md && cp src/package.json src/dist/package.json
      - name: Publish package on GitHub Packages 📦
        run: cd src/dist && npm publish --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 4.3 Explicação rápida

| Item | Descrição |
|------|-----------|
| `on: release: types: [created]` | O workflow roda quando um **release** é criado no repositório. |
| `permissions: packages: write` | Permite publicar no GitHub Packages. |
| `registry-url` e `scope: '@squidit'` | Faz o npm usar o GitHub Packages para o scope da organização. |
| `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` | Autenticação para publicar. Não é preciso criar secret; o GitHub fornece esse token. |
| `npm publish --no-git-checks` | Publica sem verificar estado do git (útil em CI). |

### 4.4 Ajustar caminhos (se necessário)

Se no seu projeto os artefatos do build ficarem em outro lugar, ajuste o step **Organize Files**:

- Origem do build: `dist/@squidit/ngx-css` (ou o path que o `ng build` gera).
- Destino: a pasta de onde você roda `npm publish` (no exemplo, `src/dist`).
- O step **Publish** deve rodar dentro da pasta que contém o `package.json` do pacote e os arquivos listados em `files` (ou o conteúdo padrão do build).

Depois de editar, faça commit e push do workflow.

---

## 5. Passo 4: Publicar (criar um release)

A publicação acontece quando um **release** é criado no GitHub.

1. No repositório **squidit/ngx-css**, vá em **Releases** (lado direito da página do repo).
2. Clique em **Create a new release**.
3. Escolha a **tag** (ex.: `v2.0.1`). Crie a tag se ainda não existir.
4. Preencha **Title** e **Description** (ex.: notas da versão).
5. Clique em **Publish release**.

O workflow **Publish to GitHub Packages** será disparado. Você pode acompanhar em **Actions**. Ao terminar, o pacote estará em **Packages** do repositório (ou da organização).

---

## 6. Publicação manual (opcional)

Se precisar publicar **na sua máquina** (sem criar release):

1. Crie um **Personal Access Token (classic)** na sua conta com o scope **`write:packages`** (e **`repo`** se o repositório for privado). Ver [GITHUB_PACKAGES.md](./GITHUB_PACKAGES.md#3-referência-token-do-github-quando-necessário).
2. No seu usuário, configure o `~/.npmrc`:
   ```ini
   //npm.pkg.github.com/:_authToken=SEU_TOKEN
   ```
3. No repositório da lib:
   ```bash
   pnpm install
   pnpm run build:prod
   cp -r dist/@squidit/ngx-css src/dist
   cp README.md src/dist/README.md
   cp src/package.json src/dist/package.json
   cd src/dist && pnpm publish
   ```

---

## 7. Checklist final

Antes de considerar a lib configurada para publicação no GitHub Packages:

- [ ] **`src/package.json`**: `name` = `@squidit/ngx-css`, `repository` correto, `publishConfig.registry` = `https://npm.pkg.github.com`
- [ ] **Raiz do repo**: arquivo `.npmrc` com `@squidit:registry=https://npm.pkg.github.com`
- [ ] **`.github/workflows/deploy-github-packages.yml`**: criado com os steps de pnpm, build, organize e publish usando `GITHUB_TOKEN`
- [ ] **Primeiro release**: criar um release no GitHub para disparar o workflow e publicar a primeira versão

Para **instalar** essa lib em outros projetos, use o tutorial em [GITHUB_PACKAGES.md](./GITHUB_PACKAGES.md).
