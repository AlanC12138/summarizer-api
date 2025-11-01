# AI Document Summarizer

End-to-end NLP module: model inference (BART/T5), FastAPI service, Docker packaging, and basic evaluation.

## Features
- Pretrained abstractive summarization (Hugging Face `transformers`)
- FastAPI endpoints: `/health`, `/summarize`
- Batch + single text support
- Deterministic runs (`seed`), CPU/GPU compatible
- Dockerized deployment

## Project layout

