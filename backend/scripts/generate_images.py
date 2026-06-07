"""Генерирует изображения самолётов для seed_images/."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

IMAGES = [
    ('gulfstream_g650.jpg', 'Gulfstream G650', (20, 30, 55), (201, 168, 76)),
    ('bombardier_global_7500.jpg', 'Bombardier Global 7500', (15, 25, 45), (180, 150, 70)),
    ('cessna_citation_x.jpg', 'Cessna Citation X', (25, 35, 60), (210, 185, 100)),
    ('embraer_phenom_300e.jpg', 'Embraer Phenom 300E', (18, 28, 48), (195, 165, 80)),
    ('dassault_falcon_8x.jpg', 'Dassault Falcon 8X', (22, 32, 52), (205, 175, 90)),
    ('hondajet_elite_ii.jpg', 'HondaJet Elite II', (12, 22, 42), (190, 160, 75)),
]

OUT_DIR = Path(__file__).resolve().parent.parent / 'seed_images'


def draw_plane(draw, w, h, color):
    cx, cy = w // 2, h // 2
    draw.polygon([
        (cx - 180, cy + 10), (cx - 60, cy - 5), (cx + 120, cy - 5),
        (cx + 200, cy + 5), (cx + 120, cy + 15), (cx - 60, cy + 15),
    ], fill=color)
    draw.polygon([
        (cx - 20, cy - 5), (cx + 10, cy - 80), (cx + 40, cy - 5),
    ], fill=color)
    draw.polygon([
        (cx + 30, cy + 5), (cx + 50, cy + 60), (cx + 70, cy + 5),
    ], fill=color)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for filename, title, bg1, accent in IMAGES:
        img = Image.new('RGB', (800, 500))
        draw = ImageDraw.Draw(img)
        for y in range(500):
            t = y / 500
            r = int(bg1[0] + (bg1[0] + 15 - bg1[0]) * t)
            g = int(bg1[1] + (bg1[1] + 15 - bg1[1]) * t)
            b = int(bg1[2] + (bg1[2] + 20 - bg1[2]) * t)
            draw.line([(0, y), (800, y)], fill=(r, g, b))
        draw_plane(draw, 800, 500, accent)
        try:
            font = ImageFont.truetype('arial.ttf', 36)
        except OSError:
            font = ImageFont.load_default()
        draw.text((40, 40), title, fill=(240, 240, 240), font=font)
        img.save(OUT_DIR / filename, 'JPEG', quality=90)
        print(f'Created {filename}')


if __name__ == '__main__':
    main()
