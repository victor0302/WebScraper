# TS-Crawler

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)

A robust, high-performance web crawler designed to audit internal linking structures and media assets. Built with a focus on concurrency control and structured data extraction.

---

## 🛠 Tech Stack

| Category | Tools |
| :--- | :--- |
| **Language** | TypeScript |
| **Runtime** | Node.js (v22.x) |
| **Parsing** | JSDOM |
| **Concurrency** | p-limit |
| **Testing** | Vitest |
| **Execution** | tsx (TypeScript Execute) |

## 🚀 Key Features

- **Asynchronous Concurrency**: Managed execution using `p-limit` to prevent socket exhaustion and server-side rate limiting.
- **Data Normalization**: Intelligent URL processing to prevent duplicate crawling of the same resource (strips protocols and trailing slashes).
- **Depth-First Extraction**: 
  - Target-specific content extraction (`h1`, first `<p>` inside `<main>`).
  - Comprehensive asset discovery (all `<a>` and `<img>` tags).
- **Safety Features**: Integrated `AbortController` for request timeouts and domain-locking to prevent "infinite" external crawling.
- **Reporting**: Automatic generation of RFC-compliant CSV reports with escaped special characters.

## 📋 Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/ts-crawler.git](https://github.com/yourusername/ts-crawler.git)
   cd ts-crawler
