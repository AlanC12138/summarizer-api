# summarizer_api

![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi&logoColor=white)
![HuggingFace](https://img.shields.io/badge/HuggingFace-Transformers-FFD21E?style=flat&logo=huggingface&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat&logo=docker&logoColor=white)

FastAPI service wrapping BART-Large (and any compatible Hugging Face seq2seq model) for configurable text summarization. Features GPU/CPU auto-detection, token truncation, latency tracking, and a vanilla JS UI served as static files.

---

## Quick Start

### Docker (recommended)

```bash
docker build -t summarizer:latest .

docker run --rm -p 8000:8000 \
  -e MODEL_NAME=facebook/bart-large-cnn \
  -e DEVICE=auto \
  summarizer:latest
```

The server downloads the model on first run (~1.6 GB). Open `http://localhost:8000` for the UI.

> **GPU:** swap the base image for `nvidia/cuda:12.1.0-runtime-ubuntu22.04` and set `DEVICE=cuda`.

### Local (no Docker)

```bash
pip install -r requirements.txt
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

---

## API Reference

### `GET /health`

```
200 OK
{"status": "ok"}
```

### `POST /summarize`

**Request**

```json
{
  "text": "Your long document text here...",
  "max_new_tokens": 128,
  "min_new_tokens": 32,
  "temperature": 1.0
}
```

| Field            | Type    | Default | Description                              |
|------------------|---------|---------|------------------------------------------|
| `text`           | string  | —       | Input text to summarize (required)       |
| `max_new_tokens` | int     | `128`   | Max tokens in the generated summary      |
| `min_new_tokens` | int     | `32`    | Min tokens in the generated summary      |
| `temperature`    | float   | `1.0`   | Sampling temperature (1.0 = deterministic for BART) |

**Response**

```json
{
  "summary": "Concise summary of the input text.",
  "tokens": 116,
  "latency_ms": 245
}
```

**Example curl**

```bash
curl -s -X POST http://localhost:8000/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "The tower is 324 metres tall, about the same height as an 81-storey building. Its base is square, measuring 125 metres on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world.", "max_new_tokens": 64, "min_new_tokens": 16}'
```

---

## Configuration

All options are set via environment variables (copy `.env.example` to `.env`):

| Variable           | Default                      | Description                                   |
|--------------------|------------------------------|-----------------------------------------------|
| `MODEL_NAME`       | `facebook/bart-large-cnn`    | Any HF seq2seq model (T5, PEGASUS, etc.)      |
| `DEVICE`           | `auto`                       | `auto` (GPU if available), `cpu`, or `cuda`   |
| `MAX_INPUT_TOKENS` | `2048`                       | Input truncation limit (avoids OOM on long docs) |
| `SEED`             | `42`                         | Random seed for reproducible outputs           |

---

## Project Structure

```
summarizer_api/
├── api.py           # FastAPI app — endpoints, static UI mount
├── model.py         # Summarizer class — model loading and inference
├── requirements.txt
├── Dockerfile
├── .env.example
└── ui/
    ├── index.html   # Vanilla JS frontend
    ├── app.js
    └── styles.css
```

---

