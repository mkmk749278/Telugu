#!/usr/bin/env python3
"""Three thumbnails for Test & Compare (1280x720 JPEG). Same promise in all three, which sentence 1 confirms:
"Sonia Gandhi once said yes to the Prime Minister's post." Main: her face + the book + ఒకసారి "సరే".
A: Rajiv's 1984 oath beside her, "PM వద్దు". B: the book at a night window, "ఆ రాత్రి ఏమైంది?".
Bottom-right corner stays empty (YouTube's time stamp). Writes to assets/sonia-belonging/youtube/.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[3]
PUB = ROOT / 'projects/sonia-belonging/remotion/public'
OUT = ROOT / 'assets/sonia-belonging/youtube'
OUT.mkdir(parents=True, exist_ok=True)
W, H = 1280, 720
YEL, RED, CREAM = (255, 204, 0), (230, 40, 35), (248, 242, 228)
TE = str(PUB / 'fonts/noto-serif-telugu-telugu-800-normal.woff2')
EN = '/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf'


def font(p, s):
    return ImageFont.truetype(p, s, layout_engine=ImageFont.Layout.RAQM)


def cover(img, w, h, fx=0.5, fy=0.4):
    r = max(w / img.width, h / img.height)
    im = img.resize((round(img.width * r), round(img.height * r)), Image.LANCZOS)
    x = round((im.width - w) * fx); y = round((im.height - h) * fy)
    return im.crop((x, y, x + w, y + h))


def grade(im, sat=0.55, con=1.25, bri=0.95):
    im = ImageEnhance.Color(im).enhance(sat)
    im = ImageEnhance.Contrast(im).enhance(con)
    return ImageEnhance.Brightness(im).enhance(bri)


def ground():
    g = Image.new('RGB', (W, H), (14, 12, 11))
    glow = Image.new('L', (W, H), 0)
    ImageDraw.Draw(glow).ellipse((W * 0.35, -H * 0.3, W * 1.3, H * 1.1), fill=90)
    glow = glow.filter(ImageFilter.GaussianBlur(160))
    return Image.composite(Image.new('RGB', (W, H), (70, 46, 22)), g, glow)


def fade_right(im, start):
    m = Image.new('L', im.size, 255)
    d = ImageDraw.Draw(m)
    for x in range(start, im.width):
        d.line([(x, 0), (x, im.height)], fill=max(0, 255 - int(255 * (x - start) / (im.width - start))))
    return m


def book(h, rot):
    b = Image.open(PUB / 'media/book/cover.jpg').convert('RGB')
    b = b.resize((round(b.width * h / b.height), h), Image.LANCZOS)
    b = ImageOps.expand(b, 3, (230, 220, 200))
    shadow = Image.new('RGBA', (b.width + 120, b.height + 120), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rectangle((60, 70, b.width + 60, b.height + 70), fill=(0, 0, 0, 200))
    shadow = shadow.filter(ImageFilter.GaussianBlur(26))
    shadow.paste(b, (60, 60))
    return shadow.rotate(rot, resample=Image.BICUBIC, expand=True)


def text(d, xy, s, f, fill, stroke=10, anchor='la'):
    """Telugu in the Telugu face; Latin letters, digits and punctuation in Inter at the same size (the Telugu
    subset has no Latin glyphs)."""
    import re
    x, y = xy
    lat = font(EN, round(f.size * 0.82))
    for part in re.findall(r'[\u0C00-\u0C7F]+|[^\u0C00-\u0C7F]+', s):
        tel = '\u0C00' <= part[0] <= '\u0C7F'
        ff = f if tel else lat
        dy = 0 if tel else round(f.size * 0.18)
        d.text((x, y + dy), part, font=ff, fill=fill, stroke_width=stroke, stroke_fill=(0, 0, 0))
        x += d.textlength(part, font=ff)


def main_thumb():
    im = ground()
    face = grade(Image.open(PUB / 'media/sonia_01_gandhisonia05052007-jpg.jpg').convert('RGB'), sat=0.7)
    face = cover(face, 640, H, 0.5, 0.12)
    im.paste(face, (0, 0), fade_right(face, 430))
    bk = book(330, -6)
    im.paste(bk, (540, 190), bk)
    d = ImageDraw.Draw(im)
    text(d, (580, 30), 'ఒకసారి', font(TE, 118), CREAM)
    text(d, (860, 150), 'సరే', font(TE, 230), YEL, 14)
    return im


def thumb_a():
    im = ground()
    left = grade(Image.open(PUB / 'media/p2/rajiv_oath1984.jpg').convert('RGB'), sat=0, con=1.3, bri=0.8)
    left = cover(left, 660, H, 0.62, 0.3)
    im.paste(left, (0, 0))
    face = grade(Image.open(PUB / 'media/p2/sonia_vote2004.jpg').convert('RGB'), sat=0.8)
    face = cover(face, 640, H, 0.3, 0.2)
    im.paste(face, (640, 0))
    d = ImageDraw.Draw(im)
    d.rectangle((636, 0, 644, H), fill=YEL)
    text(d, (40, 40), '1984', font(EN, 96), CREAM, 8)
    text(d, (680, 40), '2004', font(EN, 96), YEL, 8)
    text(d, (40, 470), 'PM వద్దు', font(TE, 170), RED, 12)
    return im


def thumb_b():
    import subprocess
    fr = OUT / '_window.png'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', '3', '-i', str(PUB / 'media/stock/win_night.mp4'), '-frames:v', '1', str(fr)], check=True)
    bgim = grade(Image.open(fr).convert('RGB'), sat=0.8, con=1.2, bri=0.75)
    im = cover(bgim, W, H, 0.5, 0.5)
    shade = Image.new('L', (W, H), 0)
    ImageDraw.Draw(shade).rectangle((0, 0, 620, H), fill=170)
    im = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), im, shade.filter(ImageFilter.GaussianBlur(80)))
    bk = book(440, 6)
    im.paste(bk, (700, 40), bk)
    d = ImageDraw.Draw(im)
    text(d, (50, 120), 'ఆ రాత్రి', font(TE, 150), CREAM)
    text(d, (50, 330), 'ఏమైంది?', font(TE, 150), YEL)
    fr.unlink()
    return im


for name, fn in [('thumb_main', main_thumb), ('thumb_challenger_a', thumb_a), ('thumb_challenger_b', thumb_b)]:
    im = fn()
    im.save(OUT / f'{name}.jpg', quality=92)
    im.resize((320, 180), Image.LANCZOS).save(OUT / f'{name}_phone.png')
    print(name)
