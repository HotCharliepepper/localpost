from playwright.sync_api import sync_playwright
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import json, time, sys
root=Path(__file__).resolve().parents[1]
url='inline-document'
html=(root/'index.html').read_text(encoding='utf-8')
css=(root/'style.css').read_text(encoding='utf-8')
js=(root/'motion.js').read_text(encoding='utf-8')
html=html.replace('<link rel="stylesheet" href="./style.css">', '<style>'+css+'</style>').replace('<script src="./motion.js" defer></script>', '').replace('</body>','<script>'+js+'</script></body>')
prev=root/'previews';prev.mkdir(exist_ok=True)
report={'source':url,'viewports':{},'issues':[],'chrome_errors':[]}
with sync_playwright() as p:
    b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    for name,w,h in [('desktop',1440,900),('tablet',820,920),('mobile',390,844),('small',360,780)]:
        page=b.new_page(viewport={'width':w,'height':h},device_scale_factor=1, reduced_motion='no-preference')
        failures=[]
        page.on('pageerror', lambda ex: failures.append(str(ex)))
        page.on('console',lambda msg: failures.append('console: '+msg.text) if msg.type=='error' else None)
        page.set_content(html,wait_until='load')
        page.wait_for_timeout(300)
        height=page.locator('#intro').evaluate('(n)=>n.offsetHeight')
        maxScroll=height-h
        stats=[]
        positions=[('01_identity',0),('02_spiral',.24),('03_question',.40),('04_point',.56),('05_compass',.72),('06_final',.92)]
        for state,pct in positions:
            page.evaluate('(y)=>window.scrollTo(0,y)',maxScroll*pct)
            page.wait_for_timeout(800)
            snapshot=page.evaluate('''()=>({actualScene:document.documentElement.dataset.scene,
                chapterText:document.querySelector('.chapter.active')?.innerText?.slice(0,110),
                width:document.documentElement.scrollWidth,viewport:window.innerWidth,
                canvasOpacity:parseFloat(document.getElementById('vortex').style.opacity||'0'),
                bodyOverflow:document.documentElement.scrollWidth>window.innerWidth+1,
                layerScale:document.getElementById('cinema-stage').style.getPropertyValue('--spiral-scale')
            })''')
            snapshot['state']=state;snapshot['at']=pct;stats.append(snapshot)
            if name in ('desktop','mobile'):
                page.screenshot(path=str(prev/f'{name}_{state}.png'),animations='disabled')
            if snapshot['bodyOverflow']: report['issues'].append({'viewport':name,'state':state,'problem':'horizontal overflow'})
        # reduce-motion test should show final result not force scroll
        page.locator('#motion-toggle').click()
        page.wait_for_timeout(200)
        reduced=page.evaluate('''()=>({reduced:document.documentElement.classList.contains('reduced-motion'),
              scene:document.documentElement.dataset.scene,aria:document.querySelector('.chapter.active')?.getAttribute('aria-hidden'),
              link:document.getElementById('main-analyze')?.getAttribute('href')})''')
        report['viewports'][name]={'states':stats,'reduced':reduced,'errors':failures}
        if failures:report['issues'].extend({'viewport':name,'problem':e} for e in failures)
        if not reduced['reduced'] or reduced['scene']!='6':report['issues'].append({'viewport':name,'problem':'reduced motion not final'})
        page.close()
    b.close()
(root/'QA'/'BROWSER_QA.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'issues':report['issues'],'summaries':{k:[(s['state'],s['actualScene'],s['bodyOverflow']) for s in v['states']] for k,v in report['viewports'].items()}},ensure_ascii=False,indent=2))
# contact sheet of 6 scenes per viewport
for n in ('desktop','mobile'):
    files=[prev/f'{n}_{s}.png' for s in ['01_identity','02_spiral','03_question','04_point','05_compass','06_final']]
    thumbs=[]
    for f in files:
        im=Image.open(f).convert('RGB')
        targetw=570 if n=='desktop' else 320
        targeth=round(im.height*targetw/im.width)
        im=im.resize((targetw,targeth),Image.Resampling.LANCZOS)
        thumbs.append(im)
    cols=2 if n=='desktop' else 3
    rows=(len(thumbs)+cols-1)//cols
    margin=16
    W=cols*thumbs[0].width+(cols+1)*margin
    H=rows*thumbs[0].height+(rows+1)*margin
    contact=Image.new('RGB',(W,H),'#E9EDE9')
    for i,im in enumerate(thumbs):
        x=margin+(i%cols)*(im.width+margin)
        y=margin+(i//cols)*(im.height+margin)
        contact.paste(im,(x,y))
    contact.save(prev/f'{n}_contact.png',quality=90)
