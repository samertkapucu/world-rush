const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const output = path.resolve(process.env.WORLD_RUSH_TEST_OUTPUT || path.join(root, 'work/live-check'));
const source = fs.readFile(path.join(root, 'index.html'), 'utf8');
const instrumentation = `
const renderFrame=composer.render.bind(composer);
composer.render=()=>{if(!window.__skipRender)renderFrame()};
window.__nextArena=()=>resetRound();
window.__inspectRace=()=>{
 const area=el.getBoundingClientRect(),scale=Math.min(area.width/540,area.height/960);
 const project=(x,y,z)=>{
  const v=new THREE.Vector3(x,y,z).project(camera);
  return {x:(v.x*area.width/2)/scale+270,y:(-v.y*area.height/2)/scale+480};
 };
 return {
  roundState,round,mode,autoCameraChanges,remaining,arenaIndex,lanes:cars.map(c=>c.laneIndex),season:[...season],codes:[...codes],metres:Math.max(0,Math.ceil(RACE_METRES-Math.max(...cars.map(c=>c.progress))*METRES_PER_PERCENT)),boosts:cars.map(c=>c.boost),
  laneColorsCorrect:cars.every(c=>laneStrips[c.laneIndex].material.color.getHex()===c.color&&laneAccentMaterials[c.laneIndex].color.getHex()===c.color),
  audio:{enabled:soundEngine.enabled,state:soundEngine.ctx?.state},
  cars:cars.map(car=>{
   const b=new THREE.Box3().setFromObject(car.group),p=[];
   for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])p.push(project(x,y,z));
   return {left:Math.min(...p.map(v=>v.x)),right:Math.max(...p.map(v=>v.x)),top:Math.min(...p.map(v=>v.y)),bottom:Math.max(...p.map(v=>v.y))};
  })
 };
};
`;

async function check(page, frame, label, width, height) {
  await frame.evaluate(() => { window.__skipRender=false; window.__tick(50); });
  const state = await frame.evaluate(() => {
    const rect = node => {
      const r=node.getBoundingClientRect();
      return {x:r.x,y:r.y,width:r.width,height:r.height};
    };
    const canvas=document.querySelector('canvas');
    const visible=['header','#rank','#battle','#countdown','#joinHint','#giftGuide','#giftMoment','#event','#leagueBoard','#winnerCard','#supporterThanks',...Array.from({length:4},(_,i)=>'.carLabel:nth-child('+(i+1)+')')];
    const hud=document.querySelector('#hud').getBoundingClientRect();
    const scale=hud.width/540;
    return {
      ...window.__inspectRace(),app:rect(document.querySelector('#app')),
      canvas:[canvas.width,canvas.height],
      hud:visible.flatMap(selector=>{
        const node=document.querySelector(selector);
        if(node.hidden||!node.getClientRects().length||getComputedStyle(node).display==='none'||getComputedStyle(node).opacity==='0')return [];
        const r=rect(node);
        return [{selector,...r,left:(r.x-hud.x)/scale,right:(r.x+r.width-hud.x)/scale,
          top:(r.y-hud.y)/scale,bottom:(r.y+r.height-hud.y)/scale}];
      }),
      soundVisible:getComputedStyle(document.querySelector('#soundUnlock')).display!=='none',
      overflow:[document.documentElement.scrollWidth,document.documentElement.scrollHeight]
    };
  });
  assert.deepEqual(state.canvas,[width,height]);
  assert.deepEqual(state.app,{x:0,y:0,width,height});
  assert.deepEqual(state.overflow,[width,height]);
  assert.equal(state.soundVisible,false);
  assert.equal(state.laneColorsCorrect,true);
  assert.equal(await frame.locator('#joinHint').isVisible(),true);
  assert.match(await frame.locator('#joinHint').textContent(),/COMMENT .*TO JOIN · FREE/);
  assert.equal(await frame.locator('.leagueTeam').count(),4);
  for (const row of state.hud) {
    assert.ok(row.left>=21 && row.right<=475, label+' HUD safe width '+JSON.stringify(row));
    assert.ok(row.top>=99 && row.bottom<=660, label+' HUD safe height '+JSON.stringify(row));
  }
  for (const car of state.cars) {
    assert.ok(car.left>=21 && car.right<=475,label+' car width '+JSON.stringify(car));
    assert.ok(car.top>=400 && car.bottom<=650,label+' car height '+JSON.stringify(car));
    assert.ok(car.right-car.left>=32,label+' car too small '+JSON.stringify(car));
  }
  await frame.evaluate(()=>Promise.all(document.getAnimations().filter(a=>Number.isFinite(a.effect?.getTiming().duration)).map(a=>a.finished.catch(()=>{}))));
  await page.screenshot({path:path.join(output,label+'.jpg'),type:'jpeg',quality:90,timeout:60000});
  await fs.writeFile(path.join(output,label+'.json'),JSON.stringify(state,null,2));
  console.log(label, state.roundState, 'canvas',state.canvas,'cars',state.cars.map(c=>Math.round(c.right-c.left)));
  await frame.evaluate(()=>{window.__skipRender=true;});
  return state;
}

(async()=>{
  await fs.mkdir(output,{recursive:true});
  const server=http.createServer(async(req,res)=>{
    const pathname=new URL(req.url,'http://localhost').pathname;
    if(!['/live.html','/index.html'].includes(pathname)){res.writeHead(404).end();return;}
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.end(await fs.readFile(path.join(root,pathname.slice(1))));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try {
    const args=['--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'];
    if(process.env.WORLD_RUSH_IGNORE_CERT_ERRORS==='1')args.push('--ignore-certificate-errors');
    browser=await chromium.launch({
      executablePath:process.env.WORLD_RUSH_CHROMIUM || undefined,args
    });
    const base='http://127.0.0.1:'+server.address().port;
    const resizeOnly=process.argv.includes('--resize-only');
    const themesOnly=process.argv.includes('--themes-only');
    const cameraOnly=process.argv.includes('--camera-only');
    const viewports=(themesOnly||cameraOnly)?[[1080,1920]]:resizeOnly?[[540,960]]:[[1080,1920],[540,960],[1080,1080]];
    for (const [width,height] of viewports) {
      const page=await browser.newPage({viewport:{width,height}});
      const errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      await page.addInitScript(()=>{
        const realNow=performance.now.bind(performance);
        window.__time=realNow();
        performance.now=()=>window.__time;
        const pending=[];
        window.requestAnimationFrame=fn=>pending.push(fn);
        window.__skipRender=true;
        window.__tick=milliseconds=>{
          window.__time+=milliseconds;
          pending.splice(0).forEach(fn=>fn(window.__time));
        };
      });
      await page.route('**/index.html?stream=1',async route=>{
        const html=(await source).replace('</script><script>',instrumentation+'\n</script><script>');
        await route.fulfill({contentType:'text/html',body:html});
      });
      let socket;
      await page.routeWebSocket('ws://127.0.0.1:8765/',ws=>{
        socket=ws;
        ws.send(JSON.stringify({type:'status',connected:true}));
      });
      await page.goto(base+'/live.html');
      const frame=await page.locator('iframe').elementHandle().then(h=>h.contentFrame());
      await frame.waitForSelector('#app:not(.booting)',{timeout:45000});
      assert.equal(await frame.locator('#giftGuide').isVisible(),false);
      assert.equal(await frame.locator('#giftGuide .giftName').count(),5);
      assert.equal(await frame.locator('#joinHint').textContent().then(text=>text.includes('@worldrush.live')),false);
      const prefix=width+'x'+height;
      await check(page,frame,prefix+'-start',width,height);
      if(cameraOnly){
        await frame.evaluate(()=>{
          for(let n=0;n<5000&&window.__inspectRace().roundState!=='results';n++)window.__tick(50);
        });
        const finish=await check(page,frame,prefix+'-calm-finish',width,height);
        assert.equal(finish.roundState,'results');
        assert.equal(finish.autoCameraChanges,3);
        assert.equal(await frame.locator('#carLabels').isVisible(),false);
        assert.equal(await frame.locator('#event').isVisible(),false);
        assert.equal(await frame.locator('#leagueBoard').isVisible(),false);
        assert.equal(await frame.locator('#joinHint').isVisible(),true);
        assert.equal(await frame.locator('#rank .racer').count(),4);
        assert.deepEqual(errors,[]);await page.close();continue;
      }
      if(themesOnly){
        let previous=await frame.evaluate(()=>window.__inspectRace());
        for(let i=1;i<=20;i++){
          await frame.evaluate(()=>{window.__nextArena();for(let n=0;n<40;n++)window.__tick(50);});
          const next=i<=8?await check(page,frame,prefix+'-arena-'+i,width,height):await frame.evaluate(()=>window.__inspectRace());
          assert.equal(next.arenaIndex,i%8);
          assert.ok(next.lanes.every((lane,index)=>lane!==previous.lanes[index]));
          assert.deepEqual(next.codes,previous.codes);
          previous=next;
        }
        assert.deepEqual(errors,[]);await page.close();continue;
      }
      if(resizeOnly){
        await frame.evaluate(()=>{for(let n=0;n<600;n++)window.__tick(50);});
        for(const [newWidth,newHeight] of [[1080,1080],[1080,1920],[540,960]]){
          await page.setViewportSize({width:newWidth,height:newHeight});
          await frame.waitForFunction(([w,h])=>innerWidth===w&&innerHeight===h,[newWidth,newHeight]);
          await check(page,frame,'resize-'+newWidth+'x'+newHeight,newWidth,newHeight);
        }
        assert.deepEqual(errors,[]);
        await page.close();
        continue;
      }
      await frame.evaluate(()=>{for(let i=0;i<1270;i++)window.__tick(50);});
      const mid=await check(page,frame,prefix+'-race',width,height);
      assert.equal(mid.roundState,'racing');
      assert.ok(mid.remaining<151);
      assert.equal(await frame.locator('#rank .racer').count(),4);
      const before=await frame.evaluate(()=>window.__inspectRace().boosts);
      socket.send(JSON.stringify({type:'comment',userId:'viewer',nickname:'TEST VIEWER',text:'SA'}));
      socket.send(JSON.stringify({type:'gift',userId:'viewer',eventId:'v2-test',value:30000,giftName:'Lion',quantity:1,nickname:'TEST VIEWER'}));
      await frame.waitForFunction(()=>document.querySelector('#lastGift').textContent.includes('NO RACE EFFECT'));
      socket.send(JSON.stringify({type:'gift',userId:'viewer',eventId:'v2-test',value:30000,giftName:'Lion'}));
      assert.deepEqual(await frame.evaluate(()=>window.__inspectRace().boosts),before);
      assert.equal(await frame.locator('#supporterThanks').isVisible(),true);
      assert.match(await frame.locator('#supporterThanks').textContent(),/TEST VIEWER/);
      await check(page,frame,prefix+'-thanks',width,height);
      assert.equal(await frame.locator('#giftGuide').isVisible(),false);
      assert.equal(await frame.locator('#giftMoment').isVisible(),false);
      // Exercise all three camera modes and automatic round restart.
      for(let i=0;i<3;i++){
        const oldMode=await frame.evaluate(()=>window.__inspectRace().mode);
        await frame.locator('[data-action=cam]').first().dispatchEvent('click');
        assert.equal(await frame.evaluate(()=>window.__inspectRace().mode),(oldMode+1)%3);
        await frame.evaluate(()=>{for(let n=0;n<180;n++)window.__tick(50);});
        await check(page,frame,prefix+'-camera-'+i,width,height);
      }
      await frame.evaluate(()=>{
        for(let n=0;n<4500&&window.__inspectRace().roundState==='racing'&&window.__inspectRace().metres>50;n++)window.__tick(50);
      });
      await frame.evaluate(()=>{for(let n=0;n<4;n++)window.__tick(50);});
      const sprint=await check(page,frame,prefix+'-sprint',width,height);
      assert.equal(sprint.roundState,'racing');
      assert.match(await frame.locator('#countdown').textContent(),/FINAL SPRINT/);
      await frame.evaluate(()=>{
        for(let n=0;n<4500&&window.__inspectRace().roundState==='racing';n++)window.__tick(50);
      });
      await frame.evaluate(()=>{for(let n=0;n<4;n++)window.__tick(50);});
      const result=await check(page,frame,prefix+'-winner',width,height);
      assert.equal(result.roundState,'results');
      assert.equal(result.autoCameraChanges,3);
      assert.equal(result.season.reduce((a,b)=>a+b,0),6);
      assert.equal(await frame.locator('#winnerCard').isVisible(),false);
      assert.match(await frame.locator('#winnerCard').textContent(),/WINS!/);
      assert.match(await frame.locator('#countdown').textContent(),/NEXT RACE/);
      await frame.evaluate(()=>{for(let n=0;n<100;n++)window.__tick(50);});
      assert.deepEqual(await frame.evaluate(()=>window.__inspectRace().boosts),[0,0,0,0]);
      assert.ok((await frame.evaluate(()=>window.__inspectRace().round))>1);
      const next=await check(page,frame,prefix+'-next-round',width,height);
      assert.equal(next.roundState,'racing');
      assert.notEqual(next.arenaIndex,result.arenaIndex);
      assert.equal(new Set(next.lanes).size,4);
      assert.ok(next.lanes.every((lane,i)=>lane!==result.lanes[i]));
      await frame.evaluate(()=>{
        const chat=document.createElement('div');chat.id='testChatOverlay';
        chat.style.cssText='position:absolute;left:22px;right:66px;top:660px;height:260px;padding:16px;background:#10121ac9;color:white;font:14px/1.5 sans-serif;z-index:20';
        chat.textContent='CHAT OVERLAY SIMULATION — TikTok LIVE welcome message / Viewer comments / Team comments. This shaded area is reserved for chat.';
        document.querySelector('#hud').appendChild(chat);
      });
      await check(page,frame,prefix+'-chat-preview',width,height);
      assert.deepEqual(errors,[]);
      await page.close();
    }
    console.log('PASS. Screenshots and measurements saved to '+output);
  } finally {
    await browser?.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
