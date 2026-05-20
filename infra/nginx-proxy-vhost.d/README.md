# nginx-proxy vhost.d configs

Per-vhost nginx config snippets for the FolkUp VPS `nginx-proxy` reverse
proxy container (`nginxproxy/nginx-proxy`, Jason Wilder pattern).

## How nginx-proxy reads these

`nginx-proxy` is configured to read per-host overrides from
`/etc/nginx/vhost.d/${VIRTUAL_HOST}` (server-block content) and
`/etc/nginx/vhost.d/${VIRTUAL_HOST}_location` (location-block content).
The directory is a Docker volume (`folkup_vhost`) mounted into the
container at `/etc/nginx/vhost.d/`.

## Deployment

Manual for now (this is infra, not application code). To apply changes:

```bash
scp infra/nginx-proxy-vhost.d/underground.folkup.life vps:/tmp/vh
ssh vps 'docker cp /tmp/vh nginx-proxy:/etc/nginx/vhost.d/underground.folkup.life \
        && rm /tmp/vh \
        && docker exec nginx-proxy nginx -t \
        && docker exec nginx-proxy nginx -s reload'
```

Verify live:
```bash
curl -sI https://underground.folkup.life/ | grep -i '^content-security-policy'
```

## Rollback

```bash
ssh vps 'docker exec nginx-proxy rm /etc/nginx/vhost.d/underground.folkup.life \
        && docker exec nginx-proxy nginx -s reload'
```

## Why this exists alongside `astro/public/_headers`

`public/_headers` is Netlify-format. Plain nginx-proxy does not parse it.
This directory is the live source of truth for headers on production.
The two files should mirror each other for documentation purposes, but
production reads only the files here.

## Files

- `underground.folkup.life` — security headers (CSP, HSTS, X-Frame-Options, etc.)
  for `underground.folkup.life`. Mirrors the global `/*` block of
  `astro/public/_headers`. Fonts are self-hosted via `@fontsource`, so the CSP
  contains no `fonts.googleapis.com` / `fonts.gstatic.com` allowance.
