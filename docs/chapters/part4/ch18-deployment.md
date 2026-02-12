# 第 18 章 部署与 CI/CD

## Vercel 部署

```bash
npm i -g vercel
vercel --prod
```

## GitHub Actions

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install && npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

# 完结
