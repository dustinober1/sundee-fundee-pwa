#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

REQUIRED_KEYS = [
    "slug",
    "title",
    "description",
    "author",
    "publishedAt",
    "updatedAt",
    "readMinutes",
    "tags",
    "primaryTopic",
    "bestFor",
    "body",
]


def main() -> int:
    parser = argparse.ArgumentParser(description="Write a blog article JSON file")
    parser.add_argument("--output", required=True, help="Output JSON path")
    parser.add_argument("--payload-file", required=True, help="Path to JSON payload file")
    args = parser.parse_args()

    output = Path(args.output).resolve()
    output.parent.mkdir(parents=True, exist_ok=True)

    payload = json.loads(Path(args.payload_file).read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise SystemExit("payload must be a JSON object")

    missing = [key for key in REQUIRED_KEYS if key not in payload]
    if missing:
        raise SystemExit(f"missing required keys: {', '.join(missing)}")

    output.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
