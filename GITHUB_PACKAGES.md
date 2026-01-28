# Tutorial: ngx-css no GitHub Packages

Este documento descreve como publicar a lib **@squidit/ngx-css** no GitHub Packages e como consumi-la em outros projetos. A lib está no repositório da organização **squidit**.

---

## Índice

1. [Para quem publica a lib: workflow no GitHub Actions](#1-para-quem-publica-a-lib-workflow-no-github-actions)
2. [Para quem instala a lib: usar em um projeto](#2-para-quem-instala-a-lib-usar-em-um-projeto)
3. [Referência: token do GitHub (quando necessário)](#3-referência-token-do-github-quando-necessário)

---

## 1. Para quem publica a lib: workflow no GitHub Actions

O repositório **squidit/ngx-css** publica o pacote no GitHub Packages via GitHub Actions. Não é necessário configurar token na sua conta pessoal para isso: o **GITHUB_TOKEN** do workflow já tem permissão para publicar no Packages do próprio repositório.

### 1.1 Pré-requisitos no repositório

- O pacote publicado deve ter nome no formato **@squidit/ngx-css** (já está em `src/package.json`).
- O `repository` no `package.json` do pacote deve apontar para o repositório correto, ex.: `https://github.com/squidit/ngx-css`.

### 1.2 Arquivo `.npmrc` na raiz do repositório ngx-css

Crie ou edite o **`.npmrc`** na raiz do repositório:

```ini
@squidit:registry=https://npm.pkg.github.com
```

Isso faz com que pacotes do scope `@squidit` usem o registry do GitHub Packages.

### 1.3 (Opcional) `publishConfig` no package.json do pacote

No **`src/package.json`** (o que é publicado), você pode adicionar:

```json
"publishConfig": {
  "registry": "https://npm.pkg.github.com"
}
```

Assim fica explícito que a publicação é feita no GitHub Packages.

### 1.4 Workflow de publicação (GitHub Actions)

Crie o arquivo **`.github/workflows/deploy-github-packages.yml`** (ou ajuste o nome do workflow existente):

```yaml
name: Publish to GitHub Packages
on:
  release:
    types: [created]
jobs:
  build-and-publish:
    permissions:
      contents: read
      packages: write
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 8

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@squidit'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm run build:prod

      - name: Organize files
        run: |
          cp -r dist/@squidit/ngx-css src/dist
          cp README.md src/dist/README.md
          cp src/package.json src/dist/package.json

      - name: Publish to GitHub Packages
        run: cd src/dist && pnpm publish --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Pontos importantes:**

- **`pnpm/action-setup`** deve vir **antes** de `setup-node` para o cache de pnpm funcionar.
- **`registry-url`** e **`scope: '@squidit'`** fazem o npm/pnpm usar o GitHub Packages para o scope da organização.
- **`NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`** — não é necessário criar secret; o GitHub fornece esse token automaticamente e ele tem permissão para publicar no Packages do repositório.

O pacote será publicado sempre que um **release** for criado no repositório (aba **Releases** → **Create a new release** → **Publish release**).

---

## 2. Para quem instala a lib: usar em um projeto

Desenvolvedores que forem adicionar **@squidit/ngx-css** em outro projeto (ex.: web-ironman) precisam apontar o scope `@squidit` para o GitHub Packages e autenticar.

### 2.1 Configurar o projeto que vai consumir a lib

No **repositório do projeto** (não no ngx-css), crie ou edite o **`.npmrc`** na raiz:

```ini
@squidit:registry=https://npm.pkg.github.com
```

Assim, ao instalar `@squidit/ngx-css`, o pnpm/npm usará o registry do GitHub Packages.

### 2.2 Autenticação

O GitHub Packages exige autenticação para instalar pacotes. Há duas situações:

#### A) Instalação na máquina do desenvolvedor (local)

É necessário um **Personal Access Token (classic)** na **conta do desenvolvedor** com permissão **`read:packages`**. A organização pode exigir aprovação do token.

Configure **uma vez** no seu usuário (não commitar):

**Arquivo `~/.npmrc`** (Linux/macOS) ou `%USERPROFILE%\.npmrc` (Windows):

```ini
//npm.pkg.github.com/:_authToken=SEU_TOKEN_AQUI
```

Substitua `SEU_TOKEN_AQUI` pelo token. Como criar o token está na [seção 3](#3-referência-token-do-github-quando-necessário).

#### B) Instalação no CI (GitHub Actions do projeto consumidor)

No **workflow do projeto que usa a lib** (ex.: web-ironman), use o **GITHUB_TOKEN** para autenticar no registry:

```yaml
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'pnpm'
    registry-url: 'https://npm.pkg.github.com'
    scope: '@squidit'

# ... checkout, etc.

- name: Install dependencies
  run: pnpm install --frozen-lockfile
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Se o pacote for **público** ou o repositório do projeto tiver acesso ao pacote na organização, o `GITHUB_TOKEN` costuma ser suficiente. Para pacotes **privados** em outros repositórios, pode ser necessário configurar permissões do pacote ou usar um PAT em um secret.

### 2.3 Instalar a lib com pnpm

No projeto consumidor:

```bash
pnpm add @squidit/ngx-css
```

Ou adicione manualmente no `package.json`:

```json
"dependencies": {
  "@squidit/ngx-css": "^2.0.0"
}
```

Depois execute `pnpm install`.

### 2.4 Resumo para quem instala

| Onde        | O que fazer |
|------------|-------------|
| Repo do projeto | `.npmrc` na raiz: `@squidit:registry=https://npm.pkg.github.com` |
| Máquina local  | `~/.npmrc`: `//npm.pkg.github.com/:_authToken=TOKEN` (token com `read:packages`) |
| CI (GitHub Actions) | Usar `registry-url`, `scope` e `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` no setup-node e no step de install |

---

## 3. Referência: token do GitHub (quando necessário)

Só é necessário criar um token na **sua conta** quando você for **publicar ou instalar o pacote na sua máquina** (linha de comando). Para o **workflow de publicação da lib**, não use token pessoal — use `GITHUB_TOKEN`.

### 3.1 Quando usar token pessoal

- Publicar a lib manualmente: `pnpm publish` no seu PC.
- Instalar a lib no seu PC em um projeto que usa `@squidit/ngx-css`.

### 3.2 Como criar o token (Personal Access Token classic)

1. No GitHub: **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**.
2. **Generate new token** → **Generate new token (classic)**.
3. **Note**: ex. `GitHub Packages - squidit`.
4. **Expiration**: escolha o período (ex.: 90 dias, 1 ano).
5. Marque os scopes:
   - **`read:packages`** — para instalar pacotes.
   - **`write:packages`** — só se for publicar manualmente.
   - **`repo`** — se o repositório da lib for privado (para publicar de fora do CI).
6. **Generate token** e copie o valor (não é exibido de novo).

### 3.3 Onde colocar o token

- **Local (sua máquina):** no `~/.npmrc`:
  ```ini
  //npm.pkg.github.com/:_authToken=SEU_TOKEN
  ```
- **Nunca** commitar o token no repositório. Em CI, use **Secrets** (ex.: `GITHUB_TOKEN` ou um secret com PAT, se a org exigir).

---

## Resumo rápido

| Papel | Onde | Ação principal |
|-------|------|-----------------|
| Quem publica a lib | Repo **squidit/ngx-css** | Workflow com pnpm, `GITHUB_TOKEN`, `registry-url` e `scope: '@squidit'`. Não precisa PAT. |
| Quem instala a lib | Repo do **projeto consumidor** | `.npmrc` com `@squidit:registry=...`. Local: token no `~/.npmrc`. CI: `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`. |
| Token na sua conta | Só para uso local | Criar PAT (classic) com `read:packages` (e `write:packages` se for publicar manualmente). |
