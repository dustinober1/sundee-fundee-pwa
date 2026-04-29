#!/usr/bin/env python3
"""
Generate a printable PDF workout plan for "The First Margarita" that matches the
same paper-log format used by the existing downloadable plans in /public/workout-plans.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re
from typing import Iterable

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
IOS_PROGRAM = Path(
    "/Users/dustinober/projects/sundee-fundee-ios/SundeeFundee/Sources/SundeeFundeeKit/DomainLayer/Program/FirstMargaritaProgram.swift"
)
OUT_DIR = ROOT / "public" / "workout-plans"
OUT_PDF = OUT_DIR / "the-first-margarita-strength-program.pdf"
OUT_COVER = OUT_DIR / "the-first-margarita-strength-program-cover.png"


# Letter @ 150 DPI (matches existing cover PNGs)
PAGE_W, PAGE_H = 1275, 1650

# Sheet bounds inside the PDF (inset within a white margin) derived from existing plan exports.
SHEET_L, SHEET_T = 62, 62
SHEET_R, SHEET_B = 1211, 1585

# Content padding within the sheet.
PAD_X = 70
CONTENT_L = SHEET_L + PAD_X
CONTENT_R = SHEET_R - PAD_X

# Theme colors (RGB)
NAVY = (13, 26, 64)
GOLD = (212, 165, 32)
ORANGE = (242, 115, 25)
CREAM = (244, 240, 223)
PAPER = (255, 253, 245)
WHITE = (255, 255, 255)
MUTED = (90, 101, 130)
BORDER = (211, 212, 212)


FONT_DIR = Path("/System/Library/Fonts/Supplemental")


def _font(filename: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_DIR / filename), size=size)


F_DISPLAY = _font("Georgia Bold.ttf", 86)
F_H1 = _font("Georgia Bold.ttf", 60)
F_H2 = _font("Georgia Bold.ttf", 40)
F_H3 = _font("Georgia Bold.ttf", 28)
F_SMALL_CAPS = _font("Arial Bold.ttf", 18)
F_BODY = _font("Arial.ttf", 24)
F_BODY_SM = _font("Arial.ttf", 20)
F_BODY_BOLD = _font("Arial Bold.ttf", 22)
F_TINY = _font("Arial.ttf", 16)
F_TINY_BOLD = _font("Arial Bold.ttf", 16)


@dataclass(frozen=True)
class Exercise:
    name: str
    sets: int
    reps: int
    pct_1rm: float | None
    rest_min: float
    bodyweight: bool


@dataclass(frozen=True)
class Session:
    week: int
    day: int
    name: str
    focus: str
    exercises: list[Exercise]


def parse_first_margarita_sessions(swift_path: Path) -> list[Session]:
    text = swift_path.read_text(encoding="utf-8")
    text = text.replace("\\u{2014}", "-").replace("\\u{2013}", "-")

    session_re = re.compile(
        r'fmSession\((\d+),\s*(\d+),\s*name:\s*"([^"]+)",\s*focus:\s*"([^"]+)",\s*\[(.*?)\]\)',
        re.S,
    )
    ex_re = re.compile(r'fmEx\("([^"]+)",\s*sets:\s*(\d+),\s*reps:\s*(\d+)(.*?)\)', re.S)

    sessions: list[Session] = []
    for m in session_re.finditer(text):
        week = int(m.group(1))
        day = int(m.group(2))
        name = m.group(3)
        focus = m.group(4)
        body = m.group(5)
        exercises: list[Exercise] = []
        for em in ex_re.finditer(body):
            tail = em.group(4)
            pct_m = re.search(r"pct:\\s*([0-9.]+)", tail)
            rest_m = re.search(r"rest:\\s*([0-9.]+)", tail)
            bw = "bw: true" in tail
            exercises.append(
                Exercise(
                    name=em.group(1),
                    sets=int(em.group(2)),
                    reps=int(em.group(3)),
                    pct_1rm=float(pct_m.group(1)) if pct_m else None,
                    rest_min=float(rest_m.group(1)) if rest_m else 2.0,
                    bodyweight=bw,
                )
            )
        sessions.append(Session(week=week, day=day, name=name, focus=focus, exercises=exercises))

    sessions.sort(key=lambda s: (s.week, s.day))
    if len(sessions) != 24:
        raise RuntimeError(f"Expected 24 sessions, got {len(sessions)}")
    return sessions


def _text_size(d: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont) -> tuple[int, int]:
    b = d.textbbox((0, 0), text, font=font)
    return (b[2] - b[0], b[3] - b[1])


def _wrap_lines(d: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, max_w: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    cur = ""
    for w in words:
        trial = w if not cur else f"{cur} {w}"
        if _text_size(d, trial, font)[0] <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def _draw_paragraph(
    d: ImageDraw.ImageDraw,
    x: int,
    y: int,
    text: str,
    font: ImageFont.ImageFont,
    fill: tuple[int, int, int],
    max_w: int,
    line_gap: int,
) -> int:
    for line in _wrap_lines(d, text, font, max_w):
        d.text((x, y), line, font=font, fill=fill)
        y += font.size + line_gap
    return y


def _base_page(fill: tuple[int, int, int] = PAPER) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = Image.new("RGB", (PAGE_W, PAGE_H), WHITE)
    d = ImageDraw.Draw(img)
    d.rectangle((SHEET_L, SHEET_T, SHEET_R, SHEET_B), fill=fill, outline=BORDER, width=2)
    return img, d


def _top_strip(d: ImageDraw.ImageDraw) -> None:
    # A 29px high strip inside the sheet, matching the other plan covers.
    y0 = SHEET_T
    y1 = SHEET_T + 29
    x = SHEET_L
    # Approx segment widths derived from an existing plan cover.
    segs = [
        (NAVY, 390),
        (GOLD, 126),
        (ORANGE, 114),
        (GOLD, 126),
        (NAVY, (SHEET_R - SHEET_L) - (390 + 126 + 114 + 126)),
    ]
    for color, w in segs:
        d.rectangle((x, y0, x + w, y1), fill=color)
        x += w


def _badge(d: ImageDraw.ImageDraw, text: str, x_right: int, y: int) -> None:
    pad_x, pad_y = 16, 10
    tw, th = _text_size(d, text, F_TINY_BOLD)
    w = tw + pad_x * 2
    h = th + pad_y * 2
    x0 = x_right - w
    d.rectangle((x0, y, x_right, y + h), fill=GOLD)
    d.text((x0 + pad_x, y + pad_y - 1), text, font=F_TINY_BOLD, fill=NAVY)


def _checkbox(d: ImageDraw.ImageDraw, cx: int, cy: int, size: int = 22) -> None:
    half = size // 2
    d.rectangle((cx - half, cy - half, cx + half, cy + half), outline=NAVY, width=2)


def _qr_crop_from_existing_cover() -> Image.Image:
    # Reuse the same QR visual used on existing covers so the format matches.
    cover = Image.open("/tmp/sundee-existing-pdf-db/db-01.png").convert("RGB")
    # Crop bounds chosen to include the QR code and its gold outline.
    return cover.crop((1006, 1365, 1165, 1526))


def build_cover() -> Image.Image:
    img, d = _base_page(fill=CREAM)
    _top_strip(d)

    d.text((CONTENT_L, 240), "SUNDEE FUNDEE STRENGTH SERIES", font=F_SMALL_CAPS, fill=(140, 115, 44))

    # Title
    d.text((CONTENT_L, 340), "8-Week", font=F_DISPLAY, fill=NAVY)
    d.text((CONTENT_L, 450), "First Margarita", font=F_DISPLAY, fill=NAVY)
    d.text((CONTENT_L, 560), "Strength Plan", font=F_DISPLAY, fill=NAVY)

    subtitle = (
        "An advanced, barbell-forward plan built around squat, bench, deadlift, and Olympic-pull practice. "
        "Use the blank set boxes as your gym log, then enter the session later in Sundee Fundee."
    )
    _draw_paragraph(d, CONTENT_L, 700, subtitle, F_BODY, fill=MUTED, max_w=900, line_gap=10)

    # Stat boxes (4 across)
    box_y = 870
    box_h = 150
    gap = 24
    total_w = CONTENT_R - CONTENT_L
    box_w = (total_w - gap * 3) // 4
    stats = [("8", "WEEKS"), ("3", "DAYS / WEEK"), ("60", "MINUTES / DAY"), ("ADV", "DIFFICULTY")]
    for i, (big, small) in enumerate(stats):
        x0 = CONTENT_L + i * (box_w + gap)
        d.rectangle((x0, box_y, x0 + box_w, box_y + box_h), outline=(190, 190, 190), width=2, fill=CREAM)
        d.text((x0 + 26, box_y + 28), big, font=F_H3, fill=NAVY)
        d.text((x0 + 26, box_y + 78), small, font=F_TINY_BOLD, fill=MUTED)

    # Callout bar
    bar_y = 1090
    bar_h = 190
    d.rectangle((CONTENT_L, bar_y, CONTENT_R, bar_y + bar_h), fill=NAVY)
    d.text((CONTENT_L + 60, bar_y + 46), "Use it in the gym.", font=F_BODY_BOLD, fill=GOLD)
    call = (
        "Print this plan, check off each workout, write down your actual sets, "
        "then log the session in Sundee Fundee to adapt the next one around cycle phase, "
        "recovery, energy, and soreness."
    )
    _draw_paragraph(d, CONTENT_L + 320, bar_y + 46, call, F_BODY_SM, fill=WHITE, max_w=720, line_gap=8)

    # Bottom bar with QR
    bottom_h = 250
    d.rectangle((SHEET_L, SHEET_B - bottom_h, SHEET_R, SHEET_B), fill=NAVY)
    d.text((CONTENT_L, SHEET_B - bottom_h + 110), "GENERATED FOR SHARING", font=F_TINY_BOLD, fill=GOLD)
    d.text((CONTENT_L, SHEET_B - bottom_h + 140), "sundeefundee.com", font=F_BODY_BOLD, fill=GOLD)
    qr = _qr_crop_from_existing_cover()
    img.paste(qr, (SHEET_R - 210, SHEET_B - bottom_h + 70))
    return img


def build_how_to_page() -> Image.Image:
    img, d = _base_page()
    title_y = 160
    d.text((CONTENT_L, title_y), "How To Run It", font=F_H1, fill=NAVY)
    d.line((CONTENT_L, title_y + 86, CONTENT_R, title_y + 86), fill=NAVY, width=4)
    _badge(d, "ADVANCED", CONTENT_R, title_y + 18)

    col_gap = 30
    col_w = (CONTENT_R - CONTENT_L - col_gap) // 2
    box_y = 320
    box_h = 460

    def box(x0: int, heading: str, bullets: list[str]) -> None:
        d.rectangle((x0, box_y, x0 + col_w, box_y + box_h), outline=(180, 180, 180), width=2, fill=PAPER)
        d.text((x0 + 30, box_y + 36), heading, font=F_H3, fill=NAVY)
        y = box_y + 96
        for b in bullets:
            d.text((x0 + 34, y), "•", font=F_BODY, fill=NAVY)
            y = _draw_paragraph(d, x0 + 64, y, b, F_BODY_SM, fill=NAVY, max_w=col_w - 90, line_gap=8) + 16

    box(
        CONTENT_L,
        "How To Use The Print Log",
        [
            "Train three days per week. Keep at least one rest day between heavy barbell sessions when possible.",
            "Write your actual load and reps in the blank set boxes. Use the Notes column for percent work, rest, and substitutions.",
            "Later, enter the session in Sundee Fundee so the app can retain your history and help you plan the next session.",
        ],
    )
    box(
        CONTENT_L + col_w + col_gap,
        "60-Minute Session Flow",
        [
            "10 min warm-up: raise temperature, then ramp to your first working set.",
            "40 min strength: log each set in the blank boxes. Rest fully on the main lift.",
            "10 min accessories + cool-down: keep quality high, stop before bar speed or form slips.",
        ],
    )

    # Why log bar
    bar_y = 830
    bar_h = 220
    d.rectangle((CONTENT_L, bar_y, CONTENT_R, bar_y + bar_h), fill=NAVY)
    d.text((CONTENT_L + 40, bar_y + 36), "Why Log It In The App?", font=F_H3, fill=GOLD)
    para = (
        "The PDF is your field notebook. Sundee Fundee is your training record: it tracks progress, remembers loads, "
        "and helps you keep decisions conservative when recovery, energy, or soreness changes."
    )
    _draw_paragraph(d, CONTENT_L + 40, bar_y + 88, para, F_BODY_SM, fill=WHITE, max_w=980, line_gap=8)

    # Footer disclaimer
    d.text(
        (CONTENT_L, SHEET_B - 40),
        "This plan is general fitness guidance. Stop if pain changes your movement, and choose substitutions that match your equipment and ability.",
        font=F_TINY,
        fill=MUTED,
    )
    return img


def phase_for_week(week: int) -> tuple[str, str]:
    if 1 <= week <= 4:
        return ("Build Work Capacity", "Moderate loads. Crisp reps. Leave 1-3 reps in reserve.")
    if 5 <= week <= 7:
        return ("Increase Intensity", "Heavier doubles and triples. Rest longer. Avoid grinders until test week.")
    return ("Deload And Test", "Reduce fatigue early in the week, then test clean singles with long rests.")


def weekly_progression_rule(week: int) -> str:
    if week <= 4:
        return "Add 2.5-5 lb when all sets stay crisp. Keep form clean before adding load."
    if week <= 7:
        return "Add load only if bar speed stays high. If a set grinds, hold weight next week."
    return "Deload Days 1-2 should feel easy. Testing day uses small jumps and long rests."


def weekly_recovery_rule(week: int) -> str:
    if week <= 4:
        return "If sleep or soreness is off, keep the main lift but drop one accessory exercise."
    if week <= 7:
        return "If readiness is low, keep intensity but reduce one set on the main lift."
    return "If anything hurts or technique changes, end the test and record the best clean single."


def build_week_overview(week: int, sessions: list[Session]) -> Image.Image:
    img, d = _base_page()
    phase_title, phase_desc = phase_for_week(week)

    title_y = 150
    d.text((CONTENT_L, title_y), f"Week {week}: {phase_title}", font=F_H1, fill=NAVY)
    d.line((CONTENT_L, title_y + 86, CONTENT_R, title_y + 86), fill=NAVY, width=4)
    _badge(d, "ADVANCED", CONTENT_R, title_y + 18)

    # Weekly stimulus callout
    call_y = 300
    call_h = 150
    d.rectangle((CONTENT_L, call_y, CONTENT_R, call_y + call_h), fill=NAVY)
    d.text((CONTENT_L + 40, call_y + 34), "Weekly Stimulus", font=F_H3, fill=GOLD)
    _draw_paragraph(d, CONTENT_L + 40, call_y + 80, phase_desc, F_BODY_SM, fill=WHITE, max_w=980, line_gap=8)

    # Table
    table_y = 500
    table_h = 420
    d.rectangle((CONTENT_L, table_y, CONTENT_R, table_y + table_h), outline=(180, 180, 180), width=2, fill=PAPER)
    header_h = 64
    d.rectangle((CONTENT_L, table_y, CONTENT_R, table_y + header_h), fill=NAVY)
    d.text((CONTENT_L + 18, table_y + 20), "DAY", font=F_TINY_BOLD, fill=WHITE)
    d.text((CONTENT_L + 150, table_y + 20), "FOCUS", font=F_TINY_BOLD, fill=WHITE)
    d.text((CONTENT_L + 390, table_y + 20), "PRIMARY STIMULUS", font=F_TINY_BOLD, fill=WHITE)

    row_h = (table_h - header_h) // 3
    for idx, s in enumerate(sessions):
        y0 = table_y + header_h + idx * row_h
        # Row separator
        if idx:
            d.line((CONTENT_L, y0, CONTENT_R, y0), fill=(200, 200, 200), width=2)
        d.text((CONTENT_L + 18, y0 + 22), f"Day {s.day}", font=F_BODY_BOLD, fill=NAVY)
        focus = {"squat": "Squat Focus", "bench": "Bench Focus", "deadlift": "Deadlift Focus", "testing": "Testing"}.get(
            s.focus, s.focus.title()
        )
        d.text((CONTENT_L + 150, y0 + 22), focus, font=F_BODY, fill=NAVY)
        stim = {
            "squat": "Heavy squat work with pulling assistance and strict pressing.",
            "bench": "Bench strength with upper-back work and an Olympic-pull variation.",
            "deadlift": "Deadlift strength with squat variation and shoulder health work.",
            "testing": "Deload early, then test clean singles with long rests.",
        }.get(s.focus, "Train the main lift, then build support work.")
        _draw_paragraph(d, CONTENT_L + 390, y0 + 22, stim, F_BODY, fill=NAVY, max_w=CONTENT_R - (CONTENT_L + 420), line_gap=8)

    # Bottom three boxes
    boxes_y = 980
    boxes_h = 260
    gap = 24
    box_w = (CONTENT_R - CONTENT_L - gap * 2) // 3
    box_titles = ["Progression", "Recovery Rule", "App Loop"]
    box_bodies = [weekly_progression_rule(week), weekly_recovery_rule(week), "Log the paper notes later so Sundee Fundee can keep your training history organized."]
    for i in range(3):
        x0 = CONTENT_L + i * (box_w + gap)
        d.rectangle((x0, boxes_y, x0 + box_w, boxes_y + boxes_h), outline=(180, 180, 180), width=2, fill=PAPER)
        d.text((x0 + 26, boxes_y + 34), box_titles[i], font=F_H3, fill=NAVY)
        _draw_paragraph(d, x0 + 26, boxes_y + 92, box_bodies[i], F_BODY_SM, fill=NAVY, max_w=box_w - 52, line_gap=8)

    footer = "Every workout in this week is different. Repeat the intent, not the exact exercises, unless a substitution fits your body better."
    d.text((CONTENT_L, SHEET_B - 40), footer, font=F_TINY, fill=MUTED)
    return img


def _cap_sets_for_log(sets: int) -> tuple[int, str | None]:
    if sets <= 4:
        return sets, None
    # Cap to 4 to match the printable log table. Note the extra work as optional.
    return 4, f"Optional: add {sets - 4} extra set(s) if bar speed stays crisp."


def build_workout_page(session: Session) -> Image.Image:
    img, d = _base_page()

    # Header
    title_y = 150
    short = session.name.replace("Day 1 - ", "").replace("Day 2 - ", "").replace("Day 3 - ", "")
    d.text((CONTENT_L, title_y), f"Week {session.week} Day {session.day}: {short}", font=F_H2, fill=NAVY)
    d.line((CONTENT_L, title_y + 72, CONTENT_R, title_y + 72), fill=NAVY, width=4)
    _badge(d, "60 MIN", CONTENT_R, title_y + 12)

    # Three info boxes
    box_y = 280
    box_h = 360
    gap = 24
    box_w = (CONTENT_R - CONTENT_L - gap * 2) // 3
    titles = ["Stimulus", "Tips", "Substitutions"]
    stimulus = {
        "squat": "Heavy squat work plus pulling support and strict pressing.",
        "bench": "Bench strength plus upper-back work and an Olympic pull variation.",
        "deadlift": "Deadlift strength plus squat variation and shoulder health work.",
        "testing": "Testing day: build to clean singles with long rests.",
    }.get(session.focus, "Train the main lift, then build supporting work.")
    tips = [
        "Ramp your warm-up sets gradually. Save energy for working sets.",
        "Rest fully on the main lift. Keep accessories crisp, not exhausting.",
        "Stop if pain changes mechanics; substitute conservatively.",
    ]
    subs_map: dict[str, list[str]] = {
        "squat": [
            "Squat: front squat, box squat, or leg press.",
            "Hinge: Romanian deadlift or hip hinge machine.",
            "Press: dumbbell overhead press or machine press.",
            "Row: chest-supported row or cable row.",
        ],
        "bench": [
            "Bench: dumbbell bench or machine press.",
            "Pull: high pull, clean pull, or row variation.",
            "Triceps: dips, pushdowns, or close-grip push-up.",
            "Row/pull-up: lat pulldown or cable row.",
        ],
        "deadlift": [
            "Deadlift: trap-bar pull, Romanian deadlift, or block pull.",
            "Olympic pull: clean pull or high pull.",
            "Squat: pause squat or goblet squat.",
            "Shoulders: face pull or band pull-aparts.",
        ],
        "testing": [
            "If you cannot test: perform a heavy single (RPE 8-9) and stop.",
            "If squats bother you: test front squat or box squat instead.",
            "If bench bothers shoulders: test a close-grip or dumbbell press.",
            "If pulls bother your back: test a trap-bar pull or Romanian deadlift.",
        ],
    }
    subs = subs_map.get(session.focus, subs_map["deadlift"])

    bodies: list[Iterable[str] | str] = [stimulus, tips, subs]
    for i in range(3):
        x0 = CONTENT_L + i * (box_w + gap)
        d.rectangle((x0, box_y, x0 + box_w, box_y + box_h), outline=(180, 180, 180), width=2, fill=PAPER)
        d.text((x0 + 22, box_y + 28), titles[i], font=F_H3, fill=NAVY)
        y = box_y + 88
        body = bodies[i]
        if isinstance(body, str):
            _draw_paragraph(d, x0 + 22, y, body, F_BODY_SM, fill=NAVY, max_w=box_w - 44, line_gap=8)
        else:
            for b in body:
                d.text((x0 + 22, y), "•", font=F_BODY, fill=NAVY)
                y = _draw_paragraph(d, x0 + 50, y, str(b), F_BODY_SM, fill=NAVY, max_w=box_w - 72, line_gap=8) + 12

    # Workout table
    table_y = 680
    table_h = 520
    d.rectangle((CONTENT_L, table_y, CONTENT_R, table_y + table_h), outline=(180, 180, 180), width=2, fill=PAPER)
    header_h = 64
    d.rectangle((CONTENT_L, table_y, CONTENT_R, table_y + header_h), fill=NAVY)

    # Column layout
    # Column x positions tuned to keep a usable Notes column (matching the other plans' paper logs).
    col_done = CONTENT_L + 24
    col_id = CONTENT_L + 92
    col_ex = CONTENT_L + 162
    col_target = CONTENT_L + 520
    col_set1 = CONTENT_L + 650
    col_set2 = CONTENT_L + 730
    col_set3 = CONTENT_L + 810
    col_set4 = CONTENT_L + 890
    col_notes = CONTENT_L + 970

    d.text((CONTENT_L + 18, table_y + 20), "DONE", font=F_TINY_BOLD, fill=WHITE)
    d.text((CONTENT_L + 88, table_y + 20), "ID", font=F_TINY_BOLD, fill=WHITE)
    d.text((CONTENT_L + 150, table_y + 20), "EXERCISE", font=F_TINY_BOLD, fill=WHITE)
    d.text((CONTENT_L + 520, table_y + 20), "TARGET", font=F_TINY_BOLD, fill=WHITE)
    for label, x in [("SET 1", col_set1), ("SET 2", col_set2), ("SET 3", col_set3), ("SET 4", col_set4)]:
        d.text((x, table_y + 20), label, font=F_TINY_BOLD, fill=(120, 140, 190))
    d.text((col_notes, table_y + 20), "NOTES", font=F_TINY_BOLD, fill=WHITE)

    # Rows
    rows: list[tuple[str, str, str, str]] = []

    # Warm row
    rows.append(("Warm", "Bike + dynamic warm-up", "10 min", "Ramp to your first working set."))

    # A-D rows from program exercises (cap at 4 movements)
    for idx, ex in enumerate(session.exercises[:4]):
        letter = chr(ord("A") + idx)
        capped_sets, extra_note = _cap_sets_for_log(ex.sets)
        target = f"{capped_sets} x {ex.reps}" if ex.reps > 0 else f"{capped_sets} sets"

        notes_parts: list[str] = []
        if ex.pct_1rm is not None:
            notes_parts.append(f"Work at {int(round(ex.pct_1rm * 100))}% 1RM")
        if ex.rest_min >= 2.0:
            notes_parts.append(f"Rest {ex.rest_min:g} min")
        if ex.bodyweight:
            notes_parts.append("Bodyweight")
        if extra_note:
            notes_parts.append(extra_note)
        notes = ". ".join(notes_parts) + ("." if notes_parts else "")

        rows.append((letter, ex.name, target, notes))

    # Finish row
    rows.append(("Finish", "Cooldown walk + breathing", "10 min", "Leave the gym feeling better than you arrived."))

    row_h = (table_h - header_h) // 6
    for i, (rid, exercise, target, notes) in enumerate(rows[:6]):
        y0 = table_y + header_h + i * row_h
        if i:
            d.line((CONTENT_L, y0, CONTENT_R, y0), fill=(200, 200, 200), width=2)

        for x in [
            col_id - 10,
            col_ex - 10,
            col_target - 10,
            col_set1 - 10,
            col_set2 - 10,
            col_set3 - 10,
            col_set4 - 10,
            col_notes - 10,
        ]:
            d.line((x, y0, x, y0 + row_h), fill=(210, 210, 210), width=1)

        cy = y0 + row_h // 2
        _checkbox(d, col_done + 12, cy)
        d.text((col_id, y0 + 18), rid, font=F_BODY_SM, fill=NAVY)
        _draw_paragraph(
            d,
            col_ex,
            y0 + 14,
            exercise,
            F_BODY_SM,
            fill=NAVY,
            max_w=col_target - col_ex - 18,
            line_gap=4,
        )
        d.text((col_target, y0 + 18), target, font=F_BODY_SM, fill=NAVY)
        _draw_paragraph(
            d,
            col_notes,
            y0 + 14,
            notes,
            F_TINY,
            fill=NAVY,
            max_w=CONTENT_R - col_notes - 16,
            line_gap=4,
        )

    # Bottom dashed box
    dash_y = table_y + table_h + 40
    dash_h = 190
    d.rectangle((CONTENT_L, dash_y, CONTENT_R, dash_y + dash_h), outline=(160, 170, 200), width=2)
    for x in range(CONTENT_L, CONTENT_R, 18):
        d.line((x, dash_y, x + 10, dash_y), fill=(160, 170, 200), width=2)
        d.line((x, dash_y + dash_h, x + 10, dash_y + dash_h), fill=(160, 170, 200), width=2)

    d.text((CONTENT_L + 30, dash_y + 26), "ENERGY BEFORE 1 2 3 4 5", font=F_TINY_BOLD, fill=NAVY)
    d.text((CONTENT_L + 30, dash_y + 62), "SORENESS AFTER Low / Med / High", font=F_TINY_BOLD, fill=NAVY)
    d.text((CONTENT_L + 30, dash_y + 98), "LOG LATER", font=F_TINY_BOLD, fill=NAVY)
    _draw_paragraph(
        d,
        CONTENT_L + 145,
        dash_y + 96,
        "Enter actual weights, reps, substitutions, and notes in Sundee Fundee so your next workout can adapt to your progress, recovery, and schedule.",
        F_TINY,
        fill=NAVY,
        max_w=920,
        line_gap=6,
    )
    d.text((CONTENT_L + 560, dash_y + 26), "SESSION RPE 1 2 3 4 5 6 7 8 9 10", font=F_TINY_BOLD, fill=NAVY)
    d.text((CONTENT_L + 560, dash_y + 62), "NEXT TIME Increase / Repeat / Reduce", font=F_TINY_BOLD, fill=NAVY)

    return img


def main() -> None:
    sessions = parse_first_margarita_sessions(IOS_PROGRAM)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    pages: list[Image.Image] = []
    cover = build_cover()
    cover.save(OUT_COVER, optimize=True)
    pages.append(cover)
    pages.append(build_how_to_page())

    for week in range(1, 9):
        week_sessions = [s for s in sessions if s.week == week]
        pages.append(build_week_overview(week, week_sessions))
        for s in week_sessions:
            pages.append(build_workout_page(s))

    pages[0].save(OUT_PDF, "PDF", resolution=150.0, save_all=True, append_images=pages[1:])
    print(str(OUT_PDF))
    print(str(OUT_COVER))


if __name__ == "__main__":
    main()
