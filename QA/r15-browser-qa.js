/* Run with Playwright browser_run_code_unsafe(filename), which supplies page.
   Official destinations are intercepted BEFORE navigation: no live analysis is requested.
   Set R15_QA_URL in this function to a verified Deploy Preview for the same smoke suite. */
async (page) => {
  const R15_QA_URL = 'http://127.0.0.1:8765/';
  const output = 'C:/Users/smmmj/Downloads/localpost-r10-git-20261117/previews/r15/';
  const report = {url:R15_QA_URL, checks:[], viewports:[], officialIntercepts:[], errors:[], requests:[]};
  const check = (name, pass, detail) => { report.checks.push({name,pass:!!pass,detail}); };
  const browser = page.context().browser();
  const context = await browser.newContext({deviceScaleFactor:1});
  await context.route('https://localscope.co.kr/**', async route => {
    report.officialIntercepts.push(route.request().url());
    await route.fulfill({contentType:'text/html',body:'<!doctype html><title>QA intercepted destination</title>'});
  });
  await context.route('**/favicon.ico',r=>r.fulfill({status:204}));
  const test = await context.newPage();
  test.on('pageerror',e=>report.errors.push(e.message));
  test.on('request',r=>report.requests.push({url:r.url(),method:r.method()}));
  const settle = () => test.waitForTimeout(1200);
  const top = async () => { await test.goto(R15_QA_URL); await settle(); };
  const rects = () => test.evaluate(() => {
    const box = selector => document.querySelector(selector).getBoundingClientRect().toJSON();
    const visible = selector => {const r=box(selector);return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;};
    const textRects = [];
    for(const element of document.querySelectorAll('.title,.subtitle,.actions a,.official-entry-note')) {
      const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
      while(walker.nextNode()){if(!walker.currentNode.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(walker.currentNode);textRects.push(...range.getClientRects());}
    }
    const north = box('.north-label');
    return {width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth,
      primaryVisible:visible('.btn-primary'),secondaryVisible:visible('.btn-secondary'),fastPathVisible:visible('.btn-tertiary'),northVisible:visible('.north-label'),
      northOverlapsText:textRects.some(r=>r.left<north.right&&r.right>north.left&&r.top<north.bottom&&r.bottom>north.top),
      compassCropped:box('.compass-viewport').right>innerWidth};
  });
  for (const [name,width,height] of [['desktop',1440,900],['tablet',768,1024],['mobile',390,844],['small',360,780],['short',360,640]]) {
    await test.setViewportSize({width,height}); await top();
    const layout=await rects(); report.viewports.push({name,...layout});
    check(name+' first viewport',!layout.overflow&&layout.primaryVisible&&layout.secondaryVisible&&layout.fastPathVisible&&layout.northVisible&&!layout.northOverlapsText&&layout.compassCropped,layout);
    await test.screenshot({path:output+'r15-'+name+'.png',scale:'css'});
    await test.locator('.btn-secondary').click(); await settle();
    check(name+' case anchor',new URL(test.url()).hash==='#first-answer'&&await test.locator('#first-answer').evaluate(e=>Math.abs(e.getBoundingClientRect().top-28)<4));
    check(name+' public proof visible',await test.locator('.case-verdict').isVisible()&&await test.locator('.case-next').isVisible()&&await test.locator('.case-evidence').isVisible());
    if(name==='desktop'||name==='mobile') {
      await test.screenshot({path:output+'r15-'+name+'-case.png',scale:'css'});
      await test.locator('.main-content').screenshot({path:output+'r15-'+name+'-content.png',scale:'css'});
    }
    const hasOverflow=await test.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    check(name+' content width',!hasOverflow);
    await test.goBack(); await settle();
    check(name+' anchor back',!new URL(test.url()).hash&&await test.locator('.btn-primary').isVisible());
    // Exercise both native disclosures with the keyboard.
    for(const selector of ['.first-answer details','.result-spec']) {
      await test.locator(selector+' summary').focus(); await test.keyboard.press('Enter');
      check(name+' '+selector+' open',await test.locator(selector).evaluate(e=>e.open));
      check(name+' '+selector+' focus ring',await test.locator(selector+' summary').evaluate(e=>getComputedStyle(e).outlineStyle!=='none'));
      check(name+' '+selector+' expanded width',await test.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await test.keyboard.press('Space'); check(name+' '+selector+' close',!(await test.locator(selector).evaluate(e=>e.open)));
    }
    await top(); await test.keyboard.press('Tab');
    check(name+' first Tab skip',await test.evaluate(()=>document.activeElement.classList.contains('skip')));
    await test.keyboard.press('Enter'); await settle();
    check(name+' skip focus destination',await test.evaluate(()=>document.activeElement.id==='pathways'));
    await test.keyboard.press('Tab');
    check(name+' skip next path',await test.evaluate(()=>document.activeElement.getAttribute('href')==='https://localscope.co.kr/explore'));
  }
  await test.setViewportSize({width:1440,height:900}); await top();
  const expected=['.btn-primary','.path[href$="/explore"]','.path[href$="/place"]','.path[href$="/analyze"]'];
  for(const selector of expected) {
    const link=test.locator(selector); const href=await link.getAttribute('href');
    const popupPromise=context.waitForEvent('page');await link.click();const popup=await popupPromise;await popup.waitForLoadState();
    check('official destination '+selector,popup.url()===href&&report.officialIntercepts.includes(href),{href,url:popup.url(),intercepted:true});
    check('safe new tab '+selector,await popup.evaluate(()=>window.opener===null));await popup.close();
  }
  await top();
  for(const progress of [0.25,0.6,0.98,0]) {
    await test.evaluate(p=>scrollTo({top:(document.querySelector('#intro').offsetHeight-document.querySelector('#cinema-stage').clientHeight)*p,behavior:'instant'}),progress);await settle();
    const state=await test.evaluate(()=>({phase:document.querySelector('#cinema-stage').dataset.phase,needle:document.querySelector('#cinema-stage').style.getPropertyValue('--needle-angle'),contentInert:document.querySelector('.content').inert,revealInert:document.querySelector('#scene-overlay').inert}));
    check('R13 scroll phase '+progress,progress>=.76?state.phase==='clarity'&&state.contentInert&&!state.revealInert:state.phase==='question'&&!state.contentInert&&state.revealInert,state);
    if(progress===.98)await test.screenshot({path:output+'r15-desktop-clarity.png',scale:'css'});
  }
  await test.evaluate(()=>scrollTo({top:700,behavior:'instant'}));await settle();
  await test.emulateMedia({reducedMotion:'reduce'});
  await test.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await settle();
  const reduced=await test.evaluate(()=>({contentVisible:getComputedStyle(document.querySelector('.title')).visibility,opacity:getComputedStyle(document.querySelector('.content')).opacity,inert:document.querySelector('.content').inert,animation:getComputedStyle(document.querySelector('.needle-mover')).animationName,scroll:getComputedStyle(document.documentElement).scrollBehavior,overlay:getComputedStyle(document.querySelector('#scene-overlay')).display}));
  check('runtime reduced motion after clarity',reduced.contentVisible==='visible'&&reduced.opacity==='1'&&!reduced.inert&&reduced.animation==='none'&&reduced.scroll==='auto'&&reduced.overlay==='none',reduced);
  for (const [name,width,height] of [['desktop',1440,900],['mobile',390,844],['small',360,780]]) {
    await test.setViewportSize({width,height}); await top();
    check(name+' reduced first viewport',(await rects()).primaryVisible&&(await rects()).secondaryVisible);
    await test.screenshot({path:output+'r15-'+name+'-reduced.png',scale:'css'});
    await test.locator('.btn-secondary').click();check(name+' reduced direct proof',new URL(test.url()).hash==='#first-answer');
  }
  await test.emulateMedia({reducedMotion:'no-preference'});
  // Existing weekly prototype: select both periods and verify it never calls a service.
  await test.setViewportSize({width:390,height:844});await test.goto(R15_QA_URL+'r13-weekly/index.html');
  check('weekly non-purchase label',await test.locator('.top-note').textContent()==='가격 실험 · 결제 불가');
  check('weekly cannot advance unanswered',await test.locator('#step1next').isDisabled());
  for(const [term,basic,pro] of [['7','9,900','19,900'],['14','16,900','34,900'],['free','9,900','19,900']]) {
    await test.locator('[data-question="stage"] [data-answer="compare"]').click();
    await test.locator('[data-question="focus"] [data-answer="fit"]').click();
    await test.locator('[data-question="term"] [data-answer="'+term+'"]').click();
    await test.locator('#step1next').click();
    check('weekly prices '+term,(await test.locator('#basic-amount').textContent())===basic&&(await test.locator('#pro-amount').textContent())===pro);
    await test.locator('#step2next').click();await test.locator('#finish').click();
    check('weekly mock completion '+term,(await test.locator('#after-intro').textContent()).includes('실제 결제나 권한 활성화는 없었습니다'));
    await test.locator('#share-trigger').click();check('weekly summary '+term,(await test.locator('#share-text').inputValue()).includes('시연용'));
    check('weekly mobile width '+term,await test.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    if(term==='14')await test.screenshot({path:output+'r15-weekly-mobile.png',scale:'css'});
    await test.locator('.step[data-step="1"]').click();
  }
  await test.locator('.top .brand').click();await settle();check('weekly returns to experiment',new URL(test.url()).hash==='#decision');
  check('no POST requests',report.requests.every(r=>r.method==='GET'));
  check('no API or remote page requests',report.requests.every(r=>r.url.startsWith(new URL(R15_QA_URL).origin)));
  check('no JavaScript errors',report.errors.length===0,report.errors);
  await context.close();
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const plain=await nojs.newPage();await plain.goto(R15_QA_URL+'#first-answer');
  check('public proof works without JS',await plain.locator('.case-verdict').isVisible()&&await plain.locator('.case-next').isVisible());await nojs.close();
  report.failed=report.checks.filter(c=>!c.pass);return report;
}
