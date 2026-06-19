// Schema alinhado com o payload real do Sentinel-RS e da Netwatch-API.

// Simula o retorno do GET /scan/{id} (detalhe de um scan específico)
export const mockScanDetail = {
  scan_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  protocol: "tcp",
  start_time: "2026-06-18T09:00:00Z",
  end_time: "2026-06-18T09:01:15Z",
  duration_seconds: 75.23,
  total_targets: 6,
  results: [
    {
      target: "192.168.1.1",
      status: "completed",
      ports: [
        { port: 22, state: "open", service: "ssh", version: "OpenSSH 8.9p1" },
        { port: 80, state: "open", service: "http", version: "nginx/1.18.0" },
        { port: 443, state: "open", service: "https", version: "nginx/1.18.0" },
        { port: 53, state: "open", service: "dns", version: null },
      ],
    },
    {
      target: "192.168.1.14",
      status: "completed",
      ports: [
        { port: 445, state: "open", service: "smb", version: "Samba 4.15" },
        { port: 5000, state: "open", service: "http-alt", version: null },
        { port: 21, state: "filtered", service: "ftp", version: null },
      ],
    },
    {
      target: "192.168.1.22",
      status: "completed",
      ports: [
        { port: 22, state: "open", service: "ssh", version: "OpenSSH 9.0" },
        { port: 3000, state: "open", service: "http-dev", version: null },
        { port: 5432, state: "open", service: "postgresql", version: "PostgreSQL 15" },
        { port: 8080, state: "closed", service: "http-proxy", version: null },
      ],
    },
    {
      target: "192.168.1.30",
      status: "completed",
      ports: [
        { port: 554, state: "open", service: "rtsp", version: null },
        { port: 80, state: "open", service: "http", version: null },
        { port: 23, state: "open", service: "telnet", version: null },
      ],
    },
    {
      target: "192.168.1.45",
      status: "completed",
      ports: [],
    },
    {
      target: "192.168.1.50",
      status: "completed",
      ports: [
        { port: 9100, state: "open", service: "jetdirect", version: null },
        { port: 631, state: "open", service: "ipp", version: null },
      ],
    },
  ],
}

// Simula o retorno do GET /history (listagem paginada)
export const mockHistory = {
  items: [
    {
      id: 1,
      scan_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      protocol: "tcp",
      ports_searched: "22,80,443,53,445,5000,21,3000,5432,8080,554,23,9100,631",
      status: "completed",
      created_at: "2026-06-18T09:00:00Z",
      summary: { total_hosts: 6, alive_hosts: 5, open_ports_count: 14 },
    },
    {
      id: 2,
      scan_id: "aabbcc11-0000-4562-b3fc-111111111111",
      protocol: "tcp",
      ports_searched: "22,80,443",
      status: "completed",
      created_at: "2026-06-18T08:00:00Z",
      summary: { total_hosts: 6, alive_hosts: 4, open_ports_count: 11 },
    },
    {
      id: 3,
      scan_id: "ddeeff22-0000-4562-b3fc-222222222222",
      protocol: "tcp",
      ports_searched: "22,80,443",
      status: "completed",
      created_at: "2026-06-18T07:00:00Z",
      summary: { total_hosts: 6, alive_hosts: 5, open_ports_count: 13 },
    },
    {
      id: 4,
      scan_id: "ff001133-0000-4562-b3fc-333333333333",
      protocol: "tcp",
      ports_searched: "22,80,443",
      status: "completed",
      created_at: "2026-06-18T06:00:00Z",
      summary: { total_hosts: 6, alive_hosts: 5, open_ports_count: 13 },
    },
  ],
  pagination: { page: 1, limit: 10, total_items: 4, total_pages: 1 },
}
