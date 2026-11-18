"""Run from an existing checkout: python tools/optimize_background.py."""
from pathlib import Path
from PIL import Image, ImageOps
from bs4 import BeautifulSoup
root=Path(__file__).resolve().parents[1]
src=root/'assets/img/background.png'
with Image.open(src) as original:
    im=ImageOps.exif_transpose(original)
    for width in (1000,1500,2000):
        scaled=im.copy()
        scaled.thumbnail((width,im.height),Image.Resampling.LANCZOS)
        path=src.with_name(f'background-{width}.webp')
        options={'quality':85,'method':6}
        if im.info.get('icc_profile'): options['icc_profile']=im.info['icc_profile']
        scaled.save(path,'WEBP',**options)
        print(f'{path}: {path.stat().st_size:,} bytes')
for page in (root/'index.html',root/'en/index.html'):
    soup=BeautifulSoup(page.read_text(encoding='utf-8'),'html.parser')
    img=soup.select_one('img.brand-background')
    if not img: raise RuntimeError(f'No brand background in {page}')
    if img.parent.name!='picture':
        img.wrap(soup.new_tag('picture'))
        for width,media in [(1000,'(max-width: 760px)'),(1500,'(max-width: 1300px)'),(2000,'(min-width: 1301px)')]:
            img.insert_before(soup.new_tag('source',attrs={'type':'image/webp','media':media,'srcset':f'/assets/img/background-{width}.webp'}))
    page.write_text(str(soup),encoding='utf-8')
