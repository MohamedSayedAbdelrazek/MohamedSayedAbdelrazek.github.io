"""Draw images/LearningPlatform.svg: the entity diagram of the EFCoreSession03 data model.

Run: python tools/build_erd.py
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
W, H = 800, 440
BOX_W, HEAD, ROW = 180, 30, 19
SANS = "Inter, 'Segoe UI', Arial, sans-serif"
MONO = "'Fira Code', Consolas, 'Courier New', monospace"

# name: (x, y, header colour, [(field, type, key)])
ENTITIES = {
    "Instructor": (60, 64, "#00d4ff", [("Id", "int", "PK"), ("FullName", "nvarchar(100)", ""), ("Email", "nvarchar", ""), ("JoinDate", "datetime2", "")]),
    "Course": (310, 40, "#7b2ff7", [("Id", "int", "PK"), ("Title", "nvarchar", ""), ("Price", "decimal(16,2)", ""), ("Level", "enum", ""),
                                    ("InstructorId", "int", "FK"), ("CategoryId", "int", "FK")]),
    "Category": (560, 64, "#f107a3", [("Id", "int", "PK"), ("Name", "nvarchar(100)", ""), ("ParentId", "int?", "FK")]),
    "Student": (60, 270, "#00d4ff", [("Id", "int", "PK"), ("Name", "nvarchar(100)", ""), ("Email", "nvarchar", ""), ("DOB", "datetime2", "")]),
    "StudentCourse": (310, 252, "#00f5a0", [("StudentId", "int", "PK FK"), ("CourseId", "int", "PK FK"), ("ProgressPercentage", "int", ""),
                                            ("Status", "enum", ""), ("FinalGrade", "decimal(18,2)", "")]),
}


def height(fields) -> int:
    return HEAD + len(fields) * ROW + 10


def entity(name, x, y, colour, fields) -> str:
    h = height(fields)
    out = [
        f'<g filter="url(#shadow)"><rect x="{x}" y="{y}" width="{BOX_W}" height="{h}" rx="10" fill="#151528" stroke="rgba(255,255,255,0.12)"/></g>',
        f'<path d="M{x} {y + HEAD}V{y + 10}a10 10 0 0 1 10 -10H{x + BOX_W - 10}a10 10 0 0 1 10 10V{y + HEAD}z" fill="{colour}" fill-opacity="0.18"/>',
        f'<rect x="{x}" y="{y}" width="{BOX_W}" height="3" rx="1.5" fill="{colour}"/>',
        f'<text x="{x + 12}" y="{y + 20}" font-family="{SANS}" font-size="13" font-weight="700" fill="#ffffff">{name}</text>',
    ]
    for i, (field, typ, key) in enumerate(fields):
        fy = y + HEAD + 15 + i * ROW
        if key:
            badge_colour = "#00f5a0" if key.startswith("PK") else "#00d4ff"
            out.append(f'<text x="{x + BOX_W - 10}" y="{fy}" text-anchor="end" font-family="{MONO}" font-size="9" font-weight="600" fill="{badge_colour}">{key}</text>')
        out.append(f'<text x="{x + 12}" y="{fy}" font-family="{MONO}" font-size="11" fill="#e2e8f0">{field}</text>')
    return "".join(out)


def label(x, y, text) -> str:
    return f'<text x="{x}" y="{y}" font-family="{SANS}" font-size="11" font-weight="700" fill="#94a3b8">{text}</text>'


def main() -> None:
    e = ENTITIES
    ix, iy = e["Instructor"][:2]
    cx, cy = e["Course"][:2]
    gx, gy = e["Category"][:2]
    sx, sy = e["Student"][:2]
    jx, jy = e["StudentCourse"][:2]
    course_h = height(e["Course"][3])

    links = [
        # Instructor 1 -> N Course
        (f"M{ix + BOX_W} {iy + 60}H{cx}", [(ix + BOX_W + 6, iy + 54, "1"), (cx - 16, iy + 54, "N")]),
        # Category 1 -> N Course
        (f"M{gx} {gy + 50}H{cx + BOX_W}", [(gx - 12, gy + 44, "1"), (cx + BOX_W + 6, gy + 44, "N")]),
        # Course 1 -> N StudentCourse
        (f"M{cx + BOX_W / 2} {cy + course_h}V{jy}", [(cx + BOX_W / 2 + 6, cy + course_h + 14, "1"), (cx + BOX_W / 2 + 6, jy - 6, "N")]),
        # Student 1 -> N StudentCourse
        (f"M{sx + BOX_W} {sy + 60}H{jx}", [(sx + BOX_W + 6, sy + 54, "1"), (jx - 16, sy + 54, "N")]),
        # Category self reference (parent / children)
        (f"M{gx + BOX_W} {gy + 40}h18a14 14 0 0 1 14 14v30a14 14 0 0 1 -14 14h-18", [(gx + BOX_W + 2, gy + 116, "parent")]),
    ]

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" '
        'aria-label="Entity relationship diagram: Instructor, Course, Category, Student and StudentCourse">',
        "<defs>",
        '<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b0b17"/><stop offset="1" stop-color="#160f2e"/></linearGradient>',
        f'<linearGradient id="line" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="{W}" y2="{H}"><stop offset="0" stop-color="#00d4ff"/><stop offset="1" stop-color="#7b2ff7"/></linearGradient>',
        '<radialGradient id="glow" cx="0.5" cy="0.45" r="0.6"><stop offset="0" stop-color="#7b2ff7" stop-opacity="0.22"/><stop offset="1" stop-color="#7b2ff7" stop-opacity="0"/></radialGradient>',
        '<pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="rgba(255,255,255,0.035)"/></pattern>',
        '<filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity="0.45"/></filter>',
        "</defs>",
        f'<rect width="{W}" height="{H}" fill="url(#bg)"/><rect width="{W}" height="{H}" fill="url(#grid)"/><rect width="{W}" height="{H}" fill="url(#glow)"/>',
    ]
    for d, labels in links:
        parts.append(f'<path d="{d}" fill="none" stroke="url(#line)" stroke-width="1.8" stroke-dasharray="5 4" stroke-linecap="round"/>')
        parts.extend(label(x, y, t) for x, y, t in labels)
    for name, (x, y, colour, fields) in ENTITIES.items():
        parts.append(entity(name, x, y, colour, fields))
    parts.append(
        f'<text x="{W - 60}" y="{H - 26}" text-anchor="end" font-family="{MONO}" font-size="11" fill="#94a3b8">EF Core 9 · SQL Server · Code-First</text>'
    )
    parts.append("</svg>")
    out = ROOT / "images" / "LearningPlatform.svg"
    out.write_text("".join(parts))
    print(out.name, f"{out.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
