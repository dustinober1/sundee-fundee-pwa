#!/usr/bin/env python3
from __future__ import annotations

import argparse
import datetime as dt
import json
from dataclasses import dataclass
from pathlib import Path

CONTENT_DIR = Path("src/app/blog/content")

@dataclass
class Article:
    path: Path
    slug: str
    title: str
    published_at: str | None
    timestamp: float
    tags: list[str]
    primary_topic: str | None
    best_for: str | None

    def to_dict(self) -> dict[str, object]:
        return {
            "path": str(self.path),
            "slug": self.slug,
            "title": self.title,
            "publishedAt": self.published_at,
            "tags": self.tags,
            "primaryTopic": self.primary_topic,
            "bestFor": self.best_for,
        }


def parse_date(value: str | None) -> dt.datetime | None:
    if not value:
        return None
    candidate = value.strip().replace("Z", "+00:00")
    try:
        parsed = dt.datetime.fromisoformat(candidate)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=dt.timezone.utc)
        return parsed.astimezone(dt.timezone.utc)
    except ValueError:
        pass
    for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%m/%d/%Y", "%B %d, %Y", "%b %d, %Y"):
        try:
            parsed = dt.datetime.strptime(candidate, fmt)
            return parsed.replace(tzinfo=dt.timezone.utc)
        except ValueError:
            continue
    return None


def build_article(path: Path) -> Article | None:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    if not isinstance(payload, dict):
        return None

    slug = str(payload.get("slug") or path.stem)
    title = str(payload.get("title") or slug.replace("-", " ").title())
    published_at = payload.get("publishedAt") or payload.get("updatedAt")
    parsed = parse_date(str(published_at)) if published_at else None
    if parsed is None:
        stat = path.stat()
        parsed = dt.datetime.fromtimestamp(stat.st_mtime, tz=dt.timezone.utc)
        published_at = parsed.date().isoformat()

    tags = payload.get("tags")
    if not isinstance(tags, list):
        tags = []

    primary_topic = payload.get("primaryTopic")
    best_for = payload.get("bestFor")

    return Article(
        path=path,
        slug=slug,
        title=title,
        published_at=str(published_at) if published_at else None,
        timestamp=parsed.timestamp(),
        tags=[str(tag) for tag in tags],
        primary_topic=str(primary_topic) if primary_topic is not None else None,
        best_for=str(best_for) if best_for is not None else None,
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Discover recent blog JSON articles")
    parser.add_argument("--root", default=".", help="Repository root")
    parser.add_argument("--limit", type=int, default=10, help="Number of articles to return")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    content_dir = root / CONTENT_DIR
    if not content_dir.is_dir():
        print(json.dumps({
            "workspace_root": str(root),
            "content_dir": str(content_dir),
            "total_articles": 0,
            "latest_articles": [],
        }, indent=2))
        return 0

    articles = []
    for path in content_dir.glob("*.json"):
        article = build_article(path)
        if article is not None:
            articles.append(article)
    articles.sort(key=lambda article: article.timestamp, reverse=True)

    print(json.dumps({
        "workspace_root": str(root),
        "content_dir": str(content_dir),
        "total_articles": len(articles),
        "latest_articles": [article.to_dict() for article in articles[: args.limit]],
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
