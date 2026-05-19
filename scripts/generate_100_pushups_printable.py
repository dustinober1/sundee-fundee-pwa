#!/usr/bin/env python3
"""
Generate the printable PDF and cover art for the 8-week 100 Push-Ups program.
"""

from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "workout-plans"
OUT_PDF = OUT_DIR / "8-week-100-push-ups-program.pdf"
OUT_COVER = OUT_DIR / "8-week-100-push-ups-program-cover.png"

PAGE_W, PAGE_H = 1275, 1650
SHEET_L, SHEET_T = 62, 62
SHEET_R, SHEET_B = 1211, 1585
CONTENT_L = SHEET_L + 72
CONTENT_R = SHEET_R - 72

NAVY = (13, 26, 64)
GOLD = (212, 165, 32)
ORANGE = (242, 115, 25)
CREAM = (244, 240, 223)
PAPER = (255, 253, 245)
WHITE = (255, 255, 255)
MUTED = (89, 97, 122)
BORDER = (212, 212, 212)
TEXT = (18, 22, 30)
GREEN = (42, 126, 92)

FONT_DIR = Path("/System/Library/Fonts/Supplemental")


def _font(filename: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_DIR / filename), size=size)


F_DISPLAY = _font("Georgia Bold.ttf", 84)
F_H1 = _font("Georgia Bold.ttf", 54)
F_H2 = _font("Georgia Bold.ttf", 36)
F_H3 = _font("Georgia Bold.ttf", 28)
F_SMALL = _font("Arial Bold.ttf", 18)
F_BODY = _font("Arial.ttf", 24)
F_BODY_SM = _font("Arial.ttf", 20)
F_BODY_BOLD = _font("Arial Bold.ttf", 22)
F_TINY = _font("Arial.ttf", 16)
F_TINY_BOLD = _font("Arial Bold.ttf", 16)

WEEK_NAMES = [
    "Baseline",
    "Groove",
    "Volume Build",
    "Capacity",
    "Density",
    "Endurance",
    "Peak Volume",
    "Taper and Test",
]

WEEK_FOCUS = [
    "Set repeatable push-up volume and keep every set clean.",
    "Add small reps while balancing shoulder and trunk work.",
    "Build total weekly push-up volume without grinding.",
    "Turn volume into longer repeat sets.",
    "Use denser work to make larger sets feel repeatable.",
    "Practice high-quality fatigue management before peaking.",
    "Reach the largest training week before the test taper.",
    "Reduce fatigue and finish with one clean max-rep test.",
]

PUSH_UP_SETS = [
    [(5, 5), (4, 4), (6, 4)],
    [(5, 7), (4, 6), (6, 6)],
    [(6, 8), (5, 7), (7, 7)],
    [(7, 10), (5, 8), (8, 8)],
    [(8, 11), (5, 10), (8, 10)],
    [(8, 13), (6, 11), (9, 11)],
    [(9, 15), (6, 12), (10, 12)],
    [(5, 8), (3, 6), (1, 0)],
]


def _base_page(fill: tuple[int, int, int] = PAPER) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = Image.new("RGB", (PAGE_W, PAGE_H), WHITE)
    d = ImageDraw.Draw(img)
    d.rectangle((SHEET_L, SHEET_T, SHEET_R, SHEET_B), fill=fill, outline=BORDER, width=2)
    return img, d


def _text_size(d: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont) -> tuple[int, int]:
    box = d.textbbox((0, 0), text, font=font)
    return box[2] - box[0], box[3] - box[1]


def _wrap_lines(d: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, max_w: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = word if not current else f"{current} {word}"
        if _text_size(d, trial, font)[0] <= max_w:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def _draw_paragraph(
    d: ImageDraw.ImageDraw,
    x: int,
    y: int,
    text: str,
    font: ImageFont.ImageFont,
    fill: tuple[int, int, int],
    max_w: int,
    line_gap: int = 8,
) -> int:
    for line in _wrap_lines(d, text, font, max_w):
        d.text((x, y), line, font=font, fill=fill)
        y += font.size + line_gap
    return y


def _top_strip(d: ImageDraw.ImageDraw) -> None:
    x = SHEET_L
    segments = [
        (NAVY, 430),
        (GOLD, 120),
        (ORANGE, 100),
        (GOLD, 120),
        (NAVY, (SHEET_R - SHEET_L) - 770),
    ]
    for color, width in segments:
        d.rectangle((x, SHEET_T, x + width, SHEET_T + 28), fill=color)
        x += width


def _badge(d: ImageDraw.ImageDraw, text: str, x_right: int, y: int, fill: tuple[int, int, int] = GOLD) -> None:
    pad_x = 18
    pad_y = 10
    tw, th = _text_size(d, text, F_TINY_BOLD)
    x0 = x_right - (tw + pad_x * 2)
    d.rectangle((x0, y, x_right, y + th + pad_y * 2), fill=fill)
    d.text((x0 + pad_x, y + pad_y - 1), text, font=F_TINY_BOLD, fill=NAVY if fill != NAVY else WHITE)


def _draw_stat_box(d: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int, big: str, small: str) -> None:
    d.rectangle((x, y, x + w, y + h), outline=BORDER, width=2, fill=CREAM)
    d.text((x + 24, y + 28), big, font=F_H2, fill=NAVY)
    d.text((x + 24, y + 82), small, font=F_TINY_BOLD, fill=MUTED)


def _pushup_rx(week: int, day: int) -> str:
    sets, reps = PUSH_UP_SETS[week - 1][day - 1]
    if week == 8 and day == 3:
        return "1 x AMRAP"
    return f"{sets} x {reps}"


def _session_rows(week: int, day: int) -> list[tuple[str, str, str, str]]:
    if day == 1:
        return [
            ("Push-Up", _pushup_rx(week, day), "90 sec", "Clean reps"),
            ("Prone W Raise", "4 x 10-15", "60 sec", "Squeeze shoulder blades"),
            ("Scap Push-Up", "3 x 8-12", "60 sec", "Keep elbows locked"),
            ("Dead Bug", "3 x 8/side", "60 sec", "Slow breathing"),
        ]
    if day == 2:
        accessory = "3 x 12-15" if week >= 5 else "3 x 10-12"
        plank = min(50, 20 + week * 5)
        return [
            ("Push-Up", _pushup_rx(week, day), "2 min", "Leave 1-2 reps"),
            ("Tempo Push-Up", "3 x 3 sec down", "90 sec", "Control the bottom"),
            ("Reverse Snow Angel", accessory, "60 sec", "No shrugging"),
            ("Front Plank", f"3 x {plank} sec", "60 sec", "Brace and breathe"),
        ]
    if week == 8:
        return [
            ("Push-Up", "1 x AMRAP", "3 min", "One clean max set"),
            ("Prone W Raise", "3 x 10-12", "60 sec", "Easy quality work"),
            ("Dead Bug", "2 x 6/side", "60 sec", "Downshift"),
        ]
    side_plank = min(45, 20 + week * 3)
    close_grip = f"3 x {max(4, week + 4)}-{week + 7}"
    return [
        ("Push-Up", _pushup_rx(week, day), "90 sec", "Steady density"),
        ("Close-Grip Push-Up", close_grip, "75 sec", "Smooth lockout"),
        ("Superman Pull", "3 x 12-15", "60 sec", "Pull elbows to ribs"),
        ("Side Plank", f"3 x {side_plank} sec/side", "60 sec", "Stack hips"),
    ]


def _session_name(week: int, day: int) -> str:
    if day == 1:
        return "Baseline Volume" if week == 1 else "Volume Ladders"
    if day == 2:
        return "Tempo Strength"
    return "100 Push-Up Test" if week == 8 else "Density Sets"


def build_cover() -> Image.Image:
    img, d = _base_page(fill=CREAM)
    _top_strip(d)

    d.text((CONTENT_L, 205), "SUNDEE FUNDEE PRINTABLE PLAN", font=F_SMALL, fill=(140, 115, 44))
    d.text((CONTENT_L, 320), "8-Week", font=F_DISPLAY, fill=NAVY)
    d.text((CONTENT_L, 430), "100 Push-Ups", font=F_DISPLAY, fill=NAVY)
    d.text((CONTENT_L, 540), "Program", font=F_DISPLAY, fill=NAVY)

    summary = (
        "A bodyweight-only plan that builds push-up volume, trunk control, and shoulder balance "
        "toward one final max-rep test. Print it, mark every session, and keep the reps clean."
    )
    _draw_paragraph(d, CONTENT_L, 690, summary, F_BODY, MUTED, 930, 10)

    stats_y = 860
    gap = 24
    total_w = CONTENT_R - CONTENT_L
    box_w = (total_w - gap * 3) // 4
    stats = [("8", "WEEKS"), ("24", "WORKOUTS"), ("3", "DAYS / WEEK"), ("BW", "EQUIPMENT")]
    for idx, (big, small) in enumerate(stats):
        _draw_stat_box(d, CONTENT_L + idx * (box_w + gap), stats_y, box_w, 150, big, small)

    bar_y = 1085
    d.rectangle((CONTENT_L, bar_y, CONTENT_R, bar_y + 215), fill=NAVY)
    d.text((CONTENT_L + 48, bar_y + 40), "Goal", font=F_H3, fill=GOLD)
    copy = (
        "Build toward 100 unbroken push-ups by adding repeatable volume first, then density, "
        "then a short taper. Scale to incline push-ups when clean full-range reps break down."
    )
    _draw_paragraph(d, CONTENT_L + 48, bar_y + 92, copy, F_BODY_SM, WHITE, 920, 8)

    d.text((CONTENT_L, 1400), "Best for: bodyweight endurance and at-home upper-body consistency.", font=F_BODY_BOLD, fill=NAVY)
    d.text((CONTENT_L, 1444), "Equipment: floor space only.", font=F_BODY, fill=MUTED)
    d.text((CONTENT_L, SHEET_B - 40), "Use the Sundee Fundee app for adaptive training, recovery context, and progress tracking.", font=F_TINY, fill=MUTED)
    return img


def build_how_to_page() -> Image.Image:
    img, d = _base_page()
    title_y = 150
    d.text((CONTENT_L, title_y), "How To Use This Plan", font=F_H1, fill=NAVY)
    d.line((CONTENT_L, title_y + 86, CONTENT_R, title_y + 86), fill=NAVY, width=4)
    _badge(d, "BODYWEIGHT", CONTENT_R, title_y + 18)

    y = 310
    sections = [
        ("Start conservative", "Every set should look like a rep you would be willing to count on test day. If form breaks, stop the set and log the clean reps."),
        ("Rest matters", "Keep the written rest periods. The goal is repeatable capacity, not turning every session into conditioning."),
        ("Scale without ego", "Use incline push-ups, shorter sets, or longer rest when needed. Return to full push-ups as clean reps improve."),
        ("Test once", "Week 8 Day 3 is one clean max-rep attempt. Warm up, rest, take the set near technical failure, and write down the number."),
    ]
    for heading, copy in sections:
        d.text((CONTENT_L, y), heading, font=F_H2, fill=NAVY)
        y = _draw_paragraph(d, CONTENT_L, y + 52, copy, F_BODY, TEXT, CONTENT_R - CONTENT_L, 10) + 42

    d.rectangle((CONTENT_L, 1245, CONTENT_R, 1448), fill=CREAM, outline=BORDER, width=2)
    d.text((CONTENT_L + 34, 1280), "Test-day standard", font=F_H3, fill=NAVY)
    copy = (
        "Count only reps with a rigid torso, controlled lower, chest near the floor, and full elbow lockout. "
        "Stop when your next rep would not meet that standard."
    )
    _draw_paragraph(d, CONTENT_L + 34, 1332, copy, F_BODY_SM, MUTED, CONTENT_R - CONTENT_L - 68, 8)
    return img


def _draw_table_header(d: ImageDraw.ImageDraw, y: int) -> None:
    d.rectangle((CONTENT_L, y, CONTENT_R, y + 52), fill=NAVY)
    headers = [("Exercise", 0), ("Sets x Reps", 420), ("Rest", 650), ("Notes", 800)]
    for label, offset in headers:
        d.text((CONTENT_L + 18 + offset, y + 16), label, font=F_TINY_BOLD, fill=WHITE)


def _draw_session(d: ImageDraw.ImageDraw, y: int, week: int, day: int) -> int:
    d.text((CONTENT_L, y), f"Day {day} - {_session_name(week, day)}", font=F_H3, fill=NAVY)
    y += 52
    _draw_table_header(d, y)
    y += 52
    row_h = 62
    for idx, (exercise, rx, rest, notes) in enumerate(_session_rows(week, day)):
        fill = WHITE if idx % 2 == 0 else (250, 247, 237)
        d.rectangle((CONTENT_L, y, CONTENT_R, y + row_h), fill=fill, outline=BORDER, width=1)
        d.text((CONTENT_L + 18, y + 20), exercise, font=F_BODY_SM, fill=TEXT)
        d.text((CONTENT_L + 438, y + 20), rx, font=F_BODY_SM, fill=TEXT)
        d.text((CONTENT_L + 668, y + 20), rest, font=F_BODY_SM, fill=MUTED)
        d.text((CONTENT_L + 818, y + 20), notes, font=F_BODY_SM, fill=MUTED)
        y += row_h
    y += 34
    d.line((CONTENT_L, y, CONTENT_R, y), fill=BORDER, width=2)
    return y + 32


def build_week_page(week: int) -> Image.Image:
    img, d = _base_page()
    _top_strip(d)
    title_y = 132
    d.text((CONTENT_L, title_y), f"Week {week}: {WEEK_NAMES[week - 1]}", font=F_H1, fill=NAVY)
    _badge(d, f"{_pushup_rx(week, 1)} START", CONTENT_R, title_y + 18, GREEN if week == 8 else GOLD)
    y = _draw_paragraph(d, CONTENT_L, 235, WEEK_FOCUS[week - 1], F_BODY, MUTED, CONTENT_R - CONTENT_L, 8) + 45

    for day in (1, 2, 3):
        y = _draw_session(d, y, week, day)

    d.text((CONTENT_L, 1508), "Session notes:", font=F_BODY_BOLD, fill=NAVY)
    d.line((CONTENT_L + 170, 1522, CONTENT_R, 1522), fill=BORDER, width=2)
    d.line((CONTENT_L, 1562, CONTENT_R, 1562), fill=BORDER, width=2)
    return img


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    pages = [build_cover(), build_how_to_page()]
    pages.extend(build_week_page(week) for week in range(1, 9))
    pages[0].save(OUT_COVER, "PNG")
    pages[0].save(OUT_PDF, "PDF", resolution=150.0, save_all=True, append_images=pages[1:])
    print(f"Wrote {OUT_PDF}")
    print(f"Wrote {OUT_COVER}")


if __name__ == "__main__":
    main()
