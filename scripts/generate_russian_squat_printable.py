#!/usr/bin/env python3
"""
Generate a branded printable PDF for the classic 6-week Russian Squat Program.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import shutil
import subprocess
import tempfile

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "workout-plans"
OUT_PDF = OUT_DIR / "6-week-russian-squat-program.pdf"
OUT_COVER = OUT_DIR / "6-week-russian-squat-program-cover.png"

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

GRADE_COLORS = {
    "Mod +": (255, 241, 76),
    "Heavy": (247, 163, 87),
    "Heavy +": (239, 117, 47),
    "MAX": (255, 36, 36),
    "MAX +": (190, 18, 18),
}

FONT_DIR = Path("/System/Library/Fonts/Supplemental")


def _font(filename: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_DIR / filename), size=size)


F_DISPLAY = _font("Georgia Bold.ttf", 78)
F_H1 = _font("Georgia Bold.ttf", 52)
F_H2 = _font("Georgia Bold.ttf", 34)
F_H3 = _font("Georgia Bold.ttf", 26)
F_SMALL = _font("Arial Bold.ttf", 18)
F_BODY = _font("Arial.ttf", 24)
F_BODY_SM = _font("Arial.ttf", 20)
F_BODY_BOLD = _font("Arial Bold.ttf", 22)
F_TINY = _font("Arial.ttf", 16)
F_TINY_BOLD = _font("Arial Bold.ttf", 16)


@dataclass(frozen=True)
class Session:
    week: int
    session: int
    actual_intensity: str
    sets: int
    reps: int
    relative_intensity: str
    grade: str


PROGRAM = [
    Session(1, 1, "80%", 6, 2, "84%", "Mod +"),
    Session(1, 2, "80%", 6, 3, "86%", "Mod +"),
    Session(1, 3, "80%", 6, 2, "84%", "Mod +"),
    Session(2, 4, "80%", 6, 4, "88%", "Heavy"),
    Session(2, 5, "80%", 6, 2, "84%", "Mod +"),
    Session(2, 6, "80%", 6, 5, "91%", "Heavy"),
    Session(3, 7, "80%", 6, 2, "84%", "Mod +"),
    Session(3, 8, "80%", 6, 6, "94%", "Heavy +"),
    Session(3, 9, "80%", 6, 2, "84%", "Mod +"),
    Session(4, 10, "85%", 5, 5, "97%", "Heavy +"),
    Session(4, 11, "80%", 6, 2, "84%", "Mod +"),
    Session(4, 12, "90%", 4, 4, "100%", "MAX"),
    Session(5, 13, "80%", 6, 2, "84%", "Mod +"),
    Session(5, 14, "95%", 3, 3, "102%", "MAX +"),
    Session(5, 15, "80%", 6, 2, "84%", "Mod +"),
    Session(6, 16, "100%", 2, 2, "105%", "MAX +"),
    Session(6, 17, "80%", 6, 2, "84%", "Mod +"),
    Session(6, 18, "105%", 1, 1, "105%", "MAX +"),
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


def build_cover() -> Image.Image:
    img, d = _base_page(fill=CREAM)
    _top_strip(d)

    d.text((CONTENT_L, 220), "SUNDEE FUNDEE PRINTABLE PLAN", font=F_SMALL, fill=(140, 115, 44))
    d.text((CONTENT_L, 320), "6-Week", font=F_DISPLAY, fill=NAVY)
    d.text((CONTENT_L, 430), "Russian Squat", font=F_DISPLAY, fill=NAVY)
    d.text((CONTENT_L, 540), "Program", font=F_DISPLAY, fill=NAVY)

    summary = (
        "A classic high-frequency squat block built around three barbell sessions per week. "
        "Use it from a conservative training max, print it for the gym, and log your actual loads by hand."
    )
    _draw_paragraph(d, CONTENT_L, 690, summary, F_BODY, MUTED, 920, 10)

    stats_y = 860
    gap = 24
    total_w = CONTENT_R - CONTENT_L
    box_w = (total_w - gap * 3) // 4
    stats = [("6", "WEEKS"), ("18", "SESSIONS"), ("3", "DAYS / WEEK"), ("ADV", "DIFFICULTY")]
    for idx, (big, small) in enumerate(stats):
        _draw_stat_box(d, CONTENT_L + idx * (box_w + gap), stats_y, box_w, 150, big, small)

    bar_y = 1080
    bar_h = 210
    d.rectangle((CONTENT_L, bar_y, CONTENT_R, bar_y + bar_h), fill=NAVY)
    d.text((CONTENT_L + 48, bar_y + 40), "How To Run It", font=F_H3, fill=GOLD)
    copy = (
        "Base all percentages on a training max you can hit cleanly today, not an all-time grinder. "
        "Rest 3-5 minutes on work sets, train on non-consecutive days when possible, and stop the cycle if pain changes your squat."
    )
    _draw_paragraph(d, CONTENT_L + 48, bar_y + 92, copy, F_BODY_SM, WHITE, 920, 8)

    footer_y = 1400
    d.text((CONTENT_L, footer_y), "Best for: experienced lifters focused on driving up their squat.", font=F_BODY_BOLD, fill=NAVY)
    d.text((CONTENT_L, footer_y + 44), "Equipment: squat rack, barbell, plates, and safeties.", font=F_BODY, fill=MUTED)
    d.text((CONTENT_L, SHEET_B - 40), "Print it, write in your loads, then keep the sheet as your training record.", font=F_TINY, fill=MUTED)
    return img


def build_how_to_page() -> Image.Image:
    img, d = _base_page()
    title_y = 150
    d.text((CONTENT_L, title_y), "How To Use This Plan", font=F_H1, fill=NAVY)
    d.line((CONTENT_L, title_y + 86, CONTENT_R, title_y + 86), fill=NAVY, width=4)
    _badge(d, "ADVANCED", CONTENT_R, title_y + 18)

    boxes_y = 320
    gap = 28
    box_w = (CONTENT_R - CONTENT_L - gap * 2) // 3
    box_h = 420
    titles = ["Set Your Max", "Weekly Rhythm", "When To Adjust"]
    bodies = [
        "Use a training max, not your true all-time max. If 100 percent feels questionable, reduce the starting number before week one begins.",
        "Run three sessions per week. Monday, Wednesday, Friday works well, but any non-consecutive pattern is fine if recovery stays solid.",
        "If bar speed falls apart, form shifts, or your knees and hips feel worse instead of just tired, stop the session and repeat or lower the load next time.",
    ]
    for idx in range(3):
        x0 = CONTENT_L + idx * (box_w + gap)
        d.rectangle((x0, boxes_y, x0 + box_w, boxes_y + box_h), outline=BORDER, width=2, fill=PAPER)
        d.text((x0 + 24, boxes_y + 32), titles[idx], font=F_H3, fill=NAVY)
        _draw_paragraph(d, x0 + 24, boxes_y + 96, bodies[idx], F_BODY_SM, TEXT, box_w - 48, 8)

    cues_y = 820
    d.rectangle((CONTENT_L, cues_y, CONTENT_R, cues_y + 250), fill=NAVY)
    d.text((CONTENT_L + 36, cues_y + 34), "Session Cues", font=F_H3, fill=GOLD)
    cues = [
        "Warm up gradually until your first work set feels technically obvious.",
        "Rest long enough that every prescribed set still looks like a squat, not a survival test.",
        "Treat the easier 80 percent days like skill practice. They are how you survive the hard days.",
        "Write the exact load used for each session on the printed schedule before you leave the rack.",
    ]
    y = cues_y + 92
    for cue in cues:
        d.text((CONTENT_L + 40, y), "•", font=F_BODY, fill=WHITE)
        y = _draw_paragraph(d, CONTENT_L + 68, y, cue, F_BODY_SM, WHITE, 920, 8) + 14

    notes_y = 1130
    d.text((CONTENT_L, notes_y), "Load planner", font=F_H2, fill=NAVY)
    d.text((CONTENT_L, notes_y + 50), "Training Max: ____________________", font=F_BODY, fill=TEXT)
    d.text((CONTENT_L + 420, notes_y + 50), "Bar Weight: ____________________", font=F_BODY, fill=TEXT)
    for idx, pct in enumerate(["80%", "85%", "90%", "95%", "100%", "105%"]):
        row_y = notes_y + 126 + idx * 46
        d.text((CONTENT_L, row_y), pct, font=F_BODY_BOLD, fill=NAVY)
        d.line((CONTENT_L + 86, row_y + 24, CONTENT_L + 430, row_y + 24), fill=BORDER, width=2)
        d.text((CONTENT_L + 460, row_y), "Planned load", font=F_BODY_SM, fill=MUTED)

    d.text((CONTENT_L, SHEET_B - 40), "This plan is general fitness guidance and is not medical advice.", font=F_TINY, fill=MUTED)
    return img


def _draw_program_table(
    d: ImageDraw.ImageDraw,
    sessions: list[Session],
    top_y: int,
) -> int:
    left = CONTENT_L
    right = CONTENT_R
    week_w = 138
    session_w = 120
    intensity_w = 240
    sets_w = 95
    reps_w = 95
    rel_w = 240
    grade_w = right - left - week_w - session_w - intensity_w - sets_w - reps_w - rel_w
    row_h = 56
    header_h = 54

    x_positions = [
        left,
        left + week_w,
        left + week_w + session_w,
        left + week_w + session_w + intensity_w,
        left + week_w + session_w + intensity_w + sets_w,
        left + week_w + session_w + intensity_w + sets_w + reps_w,
        left + week_w + session_w + intensity_w + sets_w + reps_w + rel_w,
        right,
    ]

    d.rectangle((left, top_y, right, top_y + header_h), fill=NAVY)
    headers = ["", "Session", "Actual Intensity", "Sets", "Reps", "Relative Intensity", "Grade"]
    for idx, label in enumerate(headers):
        x0 = x_positions[idx]
        x1 = x_positions[idx + 1]
        d.rectangle((x0, top_y, x1, top_y + header_h), outline=WHITE, width=2)
        if label:
            tw, th = _text_size(d, label, F_TINY_BOLD)
            d.text((x0 + (x1 - x0 - tw) / 2, top_y + (header_h - th) / 2 - 2), label, font=F_TINY_BOLD, fill=WHITE)

    weeks = sorted({session.week for session in sessions})
    y = top_y + header_h
    for week in weeks:
        week_sessions = [s for s in sessions if s.week == week]
        d.rectangle((left, y, left + week_w, y + row_h * len(week_sessions)), outline=TEXT, width=2, fill=PAPER)
        week_label = f"Week {week}"
        tw, th = _text_size(d, week_label, F_BODY_BOLD)
        d.text((left + (week_w - tw) / 2, y + (row_h * len(week_sessions) - th) / 2 - 2), week_label, font=F_BODY_BOLD, fill=TEXT)

        for row_idx, session in enumerate(week_sessions):
            row_y = y + row_idx * row_h
            cells = [
                (x_positions[1], x_positions[2], str(session.session)),
                (x_positions[2], x_positions[3], session.actual_intensity),
                (x_positions[3], x_positions[4], str(session.sets)),
                (x_positions[4], x_positions[5], str(session.reps)),
                (x_positions[5], x_positions[6], session.relative_intensity),
            ]
            for x0, x1, label in cells:
                d.rectangle((x0, row_y, x1, row_y + row_h), outline=TEXT, width=2, fill=PAPER)
                tw, th = _text_size(d, label, F_BODY_SM)
                d.text((x0 + (x1 - x0 - tw) / 2, row_y + (row_h - th) / 2 - 2), label, font=F_BODY_SM, fill=TEXT)

            grade_fill = GRADE_COLORS[session.grade]
            d.rectangle((x_positions[6], row_y, x_positions[7], row_y + row_h), outline=TEXT, width=2, fill=grade_fill)
            grade_font = F_BODY_BOLD if len(session.grade) <= 6 else F_BODY_SM
            grade_color = NAVY if session.grade == "Mod +" else WHITE if session.grade.startswith("MAX") else TEXT
            tw, th = _text_size(d, session.grade, grade_font)
            d.text((x_positions[6] + (grade_w - tw) / 2, row_y + (row_h - th) / 2 - 2), session.grade, font=grade_font, fill=grade_color)

        y += row_h * len(week_sessions) + 28

    return y


def build_week_overview(week: int, sessions: list[Session]) -> Image.Image:
    img, d = _base_page()
    title_y = 150
    d.text((CONTENT_L, title_y), f"Week {week} Overview", font=F_H1, fill=NAVY)
    d.line((CONTENT_L, title_y + 86, CONTENT_R, title_y + 86), fill=NAVY, width=4)
    _badge(d, "PRINT + LOG", CONTENT_R, title_y + 18, fill=ORANGE)

    call_y = 300
    d.rectangle((CONTENT_L, call_y, CONTENT_R, call_y + 140), fill=NAVY)
    d.text((CONTENT_L + 34, call_y + 34), "Weekly focus", font=F_H3, fill=GOLD)
    note = (
        "Build quality first, then survive the volume. Keep the easy day easy, rest long enough on the big day, "
        "and record the exact load you used on every sheet before you leave the rack."
        if week <= 3
        else "The volume drops and the intensity climbs. Stay conservative if bar speed collapses, and protect the final test by not turning the early week sessions into grinders."
    )
    _draw_paragraph(d, CONTENT_L + 34, call_y + 84, note, F_BODY_SM, WHITE, 960, 8)

    end_y = _draw_program_table(d, sessions, 500)

    notes_y = min(end_y + 10, 1350)
    d.text((CONTENT_L, notes_y), "Week notes", font=F_H2, fill=NAVY)
    for idx in range(4):
        y = notes_y + 64 + idx * 46
        d.line((CONTENT_L, y, CONTENT_R, y), fill=BORDER, width=2)
    d.text((CONTENT_L, SHEET_B - 40), "Use the notes lines for actual load, rest changes, and how the sets felt.", font=F_TINY, fill=MUTED)
    return img


def _checkbox(d: ImageDraw.ImageDraw, cx: int, cy: int, size: int = 22) -> None:
    half = size // 2
    d.rectangle((cx - half, cy - half, cx + half, cy + half), outline=NAVY, width=2)


def _set_count_label(sets: int) -> str:
    return "set" if sets == 1 else "sets"


def _session_focus(session: Session) -> str:
    if session.reps <= 2 and session.actual_intensity in {"100%", "105%"}:
        return "Peak strength"
    if session.reps >= 5:
        return "High-volume tolerance"
    if session.actual_intensity in {"90%", "95%"}:
        return "Heavy exposure"
    return "Technique under fatigue"


def _session_tip(session: Session) -> str:
    if session.reps >= 5:
        return "Break every set like it matters. The goal is crisp repetitions, not survival reps."
    if session.actual_intensity in {"95%", "100%", "105%"}:
        return "Take full rest. If bar speed falls apart or depth disappears, stop forcing the prescription."
    return "Own the descent, stay braced at the bottom, and keep every rep looking the same."


def _session_adjustment(session: Session) -> str:
    if session.actual_intensity in {"100%", "105%"}:
        return "If the load moves poorly in warm-ups, cap the day at the heaviest clean single or double you actually own."
    if session.reps >= 5:
        return "If you miss depth or lose position, strip load and finish the remaining sets cleanly."
    return "If soreness or recovery is off, keep the weight but extend rests before you change the load."


def build_workout_page(session: Session) -> Image.Image:
    img, d = _base_page()

    title_y = 150
    d.text((CONTENT_L, title_y), f"Week {session.week} Session {session.session}", font=F_H1, fill=NAVY)
    d.line((CONTENT_L, title_y + 86, CONTENT_R, title_y + 86), fill=NAVY, width=4)
    _badge(d, f"{session.actual_intensity} x {session.reps}", CONTENT_R, title_y + 18, fill=GOLD)

    box_y = 300
    gap = 24
    box_w = (CONTENT_R - CONTENT_L - gap * 2) // 3
    box_h = 250
    titles = ["Focus", "Execution", "If It Feels Off"]
    bodies = [
        f"{_session_focus(session)}. Complete {session.sets} {_set_count_label(session.sets)} of {session.reps} reps at {session.actual_intensity} from your training max.",
        _session_tip(session),
        _session_adjustment(session),
    ]
    for idx in range(3):
        x0 = CONTENT_L + idx * (box_w + gap)
        d.rectangle((x0, box_y, x0 + box_w, box_y + box_h), outline=BORDER, width=2, fill=PAPER)
        d.text((x0 + 24, box_y + 28), titles[idx], font=F_H3, fill=NAVY)
        _draw_paragraph(d, x0 + 24, box_y + 88, bodies[idx], F_BODY_SM, TEXT, box_w - 48, 8)

    table_y = 610
    table_h = 560
    d.rectangle((CONTENT_L, table_y, CONTENT_R, table_y + table_h), outline=BORDER, width=2, fill=PAPER)
    header_h = 64
    d.rectangle((CONTENT_L, table_y, CONTENT_R, table_y + header_h), fill=NAVY)

    col_done = CONTENT_L + 20
    col_id = CONTENT_L + 86
    col_ex = CONTENT_L + 150
    col_target = CONTENT_L + 430
    set_start = CONTENT_L + 560
    set_w = 52
    set_gap = 8
    notes_x = CONTENT_L + 920

    d.text((CONTENT_L + 16, table_y + 20), "DONE", font=F_TINY_BOLD, fill=WHITE)
    d.text((col_id, table_y + 20), "ID", font=F_TINY_BOLD, fill=WHITE)
    d.text((col_ex, table_y + 20), "EXERCISE", font=F_TINY_BOLD, fill=WHITE)
    d.text((col_target, table_y + 20), "TARGET", font=F_TINY_BOLD, fill=WHITE)
    for idx in range(6):
        d.text((set_start + idx * (set_w + set_gap), table_y + 20), f"S{idx + 1}", font=F_TINY_BOLD, fill=(190, 205, 255))
    d.text((notes_x, table_y + 20), "NOTES", font=F_TINY_BOLD, fill=WHITE)

    rows = [
        ("Warm", "Warm-up + ramp sets", "10-15 min", "Ramp steadily."),
        ("A", "Back squat", f"{session.sets} x {session.reps} @ {session.actual_intensity}", f"{session.relative_intensity} RI. {session.grade}."),
        ("Finish", "Cooldown walk + notes", "5-10 min", "Write the load."),
    ]

    row_h = (table_h - header_h) // 6
    line_xs = [
        col_id - 10,
        col_ex - 10,
        col_target - 10,
        set_start - 12,
        notes_x - 14,
    ]
    for idx in range(6):
        line_xs.append(set_start + idx * (set_w + set_gap) + set_w)

    for row_idx, (rid, exercise, target, notes) in enumerate(rows):
        y0 = table_y + header_h + row_idx * row_h
        if row_idx:
            d.line((CONTENT_L, y0, CONTENT_R, y0), fill=(210, 210, 210), width=2)

        for x in line_xs:
            d.line((x, y0, x, y0 + row_h), fill=(220, 220, 220), width=1)

        cy = y0 + row_h // 2
        _checkbox(d, col_done + 12, cy)
        d.text((col_id, y0 + 18), rid, font=F_BODY_SM, fill=NAVY)
        _draw_paragraph(d, col_ex, y0 + 14, exercise, F_BODY_SM, NAVY, col_target - col_ex - 18, 4)
        _draw_paragraph(d, col_target, y0 + 14, target, F_BODY_SM, NAVY, set_start - col_target - 22, 4)
        _draw_paragraph(d, notes_x, y0 + 14, notes, F_TINY, NAVY, CONTENT_R - notes_x - 14, 4)

        if rid == "A":
            box_y = y0 + 16
            for idx in range(session.sets):
                x0 = set_start + idx * (set_w + set_gap)
                d.rectangle((x0, box_y, x0 + set_w, box_y + row_h - 32), outline=NAVY, width=2)

    # Leave extra blank rows so the user has space for hand-written notes or warm-up details.
    for blank_idx in range(len(rows), 6):
        y0 = table_y + header_h + blank_idx * row_h
        d.line((CONTENT_L, y0, CONTENT_R, y0), fill=(210, 210, 210), width=2)
        for x in line_xs:
            d.line((x, y0, x, y0 + row_h), fill=(220, 220, 220), width=1)

    dash_y = table_y + table_h + 38
    dash_h = 190
    d.rectangle((CONTENT_L, dash_y, CONTENT_R, dash_y + dash_h), outline=(160, 170, 200), width=2)
    for x in range(CONTENT_L, CONTENT_R, 18):
        d.line((x, dash_y, x + 10, dash_y), fill=(160, 170, 200), width=2)
        d.line((x, dash_y + dash_h, x + 10, dash_y + dash_h), fill=(160, 170, 200), width=2)

    d.text((CONTENT_L + 26, dash_y + 24), "ACTUAL LOAD ____________________", font=F_TINY_BOLD, fill=NAVY)
    d.text((CONTENT_L + 26, dash_y + 58), "ENERGY BEFORE 1 2 3 4 5", font=F_TINY_BOLD, fill=NAVY)
    d.text((CONTENT_L + 26, dash_y + 92), "SESSION RPE 1 2 3 4 5 6 7 8 9 10", font=F_TINY_BOLD, fill=NAVY)
    d.text((CONTENT_L + 26, dash_y + 126), "NEXT TIME Increase / Repeat / Reduce", font=F_TINY_BOLD, fill=NAVY)
    d.text((CONTENT_L + 560, dash_y + 24), "TECHNIQUE NOTES", font=F_TINY_BOLD, fill=NAVY)
    _draw_paragraph(
        d,
        CONTENT_L + 560,
        dash_y + 60,
        "Write what actually happened here, then enter the same load, reps, notes, and adjustments in Sundee Fundee later so the app has the real result instead of the planned one.",
        F_TINY,
        NAVY,
        430,
        6,
    )
    for idx in range(3):
        y = dash_y + 116 + idx * 22
        d.line((CONTENT_L + 560, y, CONTENT_R - 20, y), fill=(170, 180, 205), width=1)

    return img


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    pages = [
        build_cover(),
        build_how_to_page(),
    ]
    for week in range(1, 7):
        week_sessions = [session for session in PROGRAM if session.week == week]
        pages.append(build_week_overview(week, week_sessions))
        for session in week_sessions:
            pages.append(build_workout_page(session))
    pages[0].save(OUT_COVER)
    sips_bin = shutil.which("sips")
    pdfunite_bin = shutil.which("pdfunite")
    if not sips_bin or not pdfunite_bin:
        raise RuntimeError("Expected both 'sips' and 'pdfunite' to be available on this machine.")

    with tempfile.TemporaryDirectory(prefix="russian-squat-pages-") as tmp_dir:
        tmp_root = Path(tmp_dir)
        pdf_parts: list[str] = []
        for idx, page in enumerate(pages, start=1):
            png_path = tmp_root / f"page-{idx:02d}.png"
            pdf_path = tmp_root / f"page-{idx:02d}.pdf"
            page.save(png_path)
            subprocess.run(
                [sips_bin, "-s", "format", "pdf", str(png_path), "--out", str(pdf_path)],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            pdf_parts.append(str(pdf_path))

        subprocess.run([pdfunite_bin, *pdf_parts, str(OUT_PDF)], check=True)

    print(f"Wrote {OUT_PDF}")
    print(f"Wrote {OUT_COVER}")


if __name__ == "__main__":
    main()
