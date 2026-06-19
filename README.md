# netwatch-dashboard

Painel web para visualização e execução de scans de rede, integrando o
[Sentinel-RS](https://github.com/LuizGrochevski/Sentinel-RS) (scanner em Rust)
através da [Netwatch-API](https://github.com/LuizGrochevski/netwatch-api)
(FastAPI + JWT).

Construído e testado inteiramente em ambiente mobile via Termux.

## Funcionalidades

- Login com autenticação JWT contra a Netwatch-API
- Visualização de hosts escaneados com status (aberta/fechada) por porta
- Execução de novos scans diretamente pela interface (target, portas, protocolo)
- Histórico das últimas execuções
- Layout responsivo (mobile e desktop), com identidade visual de
  "terminal de operações"

## Stack

- React 18 + Vite
- CSS puro com sistema de tokens de design (`src/styles/tokens.css`)
- Sem dependências externas de gráfico ou UI — tudo construído à mão

## Rodando localmente

Pré-requisito: a [Netwatch-API](https://github.com/LuizGrochevski/netwatch-api)
rodando em `http://localhost:8000`.

```bash
npm install
npm run dev
```

Abre em http://localhost:5173

## Arquitetura de dados
Toda comunicação com a API passa por src/data/netwatchClient.js:

| Função | Endpoint | Descrição |
|---|---|---|
| login(username, password | `POST`  /auth/login | Retorna o token JWT |
| fetchHistory(token, page) | `GET` /history | Lista os últimos scans |
| fetchScanDetail(token, id) | `GET` /scan/{id} | Detalhe de um scan específico |
| createScan(token, params) | `POST` /scan | Executa um novo scan |

Nenhum componente faz fetch diretamente — todos passam por esse client,
o que mantém a troca de API ou ajuste de schema isolada a um único arquivo.

## Schema de scan (retorno real da API)

```bash
{
  "id": 167,
  "targets": ["192.168.0.1"],
  "status": "completed",
  "results": [
    {
      "target": "192.168.0.1",
      "engine": "sentinel-rs",
      "protocol": "tcp",
      "ports_scanned": "22,80,443,53",
      "open_ports": [
        { "port": 80, "service": "HTTP", "status": "Aberta (TCP)" }
      ],
      "error": null
    }
  ],
  "created_at": "2026-06-18 22:58:11"
}
```

As portas que foram solicitadas no escaneamento mas não retornaram no array de `ports` com o estado `open` são automaticamente calculadas e exibidas como "fechadas" no card do host, separando o que não respondeu do que não foi testado.

## Estrutura
```
src/
  components/
    Login.jsx          # tela de autenticação JWT
    StatusBar.jsx       # métricas agregadas do scan mais recente
    HostCard.jsx        # card expansível por host/target
    NewScanForm.jsx      # formulário para disparar POST /scan
    Timeline.jsx          # lista do histórico de execuções
  data/
    netwatchClient.js     # única camada de acesso à Netwatch-API
    utils.js               # cálculo de stats e formatação de tempo
  styles/
    tokens.css              # paleta, tipografia, variáveis de design
    app.css                   # layout e estilos dos componentes
  App.jsx
  main.jsx
```

## Notas de desenvolvimento
Construído de ponta a ponta no Termux, incluindo debugging de CSS e CORS
diretamente do celular. O CORS precisou ser habilitado manualmente na
Netwatch-API (CORSMiddleware) para aceitar requisições de
`http://localhost:5173`.

## Próximos passos sugeridos
- Paginação real do histórico (page/limit já suportados pela API)
- Refresh automático (polling) após um scan ser executado
- Exportar relatório (CSV/Markdown) direto da interface, usando o endpoint GET /scan/{id}/report já disponível na API
- Indicador visual de scan em andamento vs. completo

​## 👨‍💻 Autor

**Luiz Felipe Grochevski** — [LinkedIn](https://www.linkedin.com/in/luiz-felipe-grochevski) | [GitHub](https://github.com/LuizGrochevski)

