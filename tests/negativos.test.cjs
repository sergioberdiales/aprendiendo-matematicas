const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=name=>fs.readFileSync(path.join(__dirname,'../negativos',name),'utf8');
function setup(a=5,b=8) {
  const elements=new Map(), timers=new Map(); let id=0;
  class Element {
    constructor(){this.hidden=false;this.disabled=false;this.textContent='';this.value='';this.children=[];this.attrs={};this.clientWidth=360;this.scrollLeft=0;this.classList={toggle(){}};}
    setAttribute(k,v){this.attrs[k]=v;}
    append(el){this.children.push(el);}
    replaceChildren(...els){this.children=els;}
    addEventListener(type,fn){this[type]=fn;}
    focus(){}
  }
  function $(key){if(!elements.has(key)){const el=new Element();el.parentElement=new Element();elements.set(key,el);}return elements.get(key);}
  const context=vm.createContext({console,document:{getElementById:$,createElementNS:()=>new Element()},setTimeout:fn=>{timers.set(++id,fn);return id;},clearTimeout:id=>timers.delete(id)});
  context.window=context;context.addEventListener=()=>{};
  vm.runInContext(source('questions.js'),context);
  const generator=context.MathQuestions.createGenerator;
  context.MathQuestions.createGenerator=()=>()=>({a,b,result:a-b,scenario:context.MathQuestions.scenarios[0],kind:'result'});
  vm.runInContext(source('numberLine.js'),context);vm.runInContext(source('app.js'),context);
  $('start').onclick();
  return {$,context,generator,timers,submit(n){$('answer').value=String(n);$('answer-form').submit({preventDefault(){}});},tick(){const [id,fn]=timers.entries().next().value;timers.delete(id);fn();}};
}
test('Exact movement counts and final positions, including starting at zero',()=>{
  for(const [a,b,r] of [[5,8,-3],[3,5,-2],[8,3,5],[0,4,-4],[6,0,6],[20,20,0]]){
    const s=setup(a,b);s.$('play').onclick();
    for(let i=1;i<=b;i++){assert.equal(s.timers.size,1);s.tick();assert.match(s.$('step-status').textContent,new RegExp(`Paso ${i} de ${b}`));}
    assert.equal(s.timers.size,0);assert.equal(s.$('step').disabled,true);
    assert.ok(s.$('meaning').textContent.includes(`${a} − ${b} = ${String(r).replace('-','−')}`));
    const svg=s.$('number-line').children[0];
    assert.equal(svg.children.filter(n=>n.attrs['stroke-width']===2&&n.attrs.stroke==='#9f87bc').length,b*2);
  }
});
test('Absolute-value error explains distance, crosses zero, allows retry without double counting',()=>{
  const s=setup();s.submit(3);assert.match(s.$('feedback').textContent,/distancia entre 5 y 8/);assert.equal(s.$('distance-panel').hidden,false);
  for(let i=0;i<5;i++)s.tick();assert.match(s.$('step-status').textContent,/todavía quedan 3 pasos/);
  for(let i=0;i<3;i++)s.tick();s.submit(-3);assert.match(s.$('feedback').textContent,/Exacto/);assert.equal(s.$('done').textContent,1);assert.equal(s.$('correct').textContent,0);
});
test('Pause, manual step, reset, next question cancel pending movement',()=>{
  const s=setup();s.$('play').onclick();s.tick();s.$('play').onclick();assert.equal(s.timers.size,0);
  s.$('step').onclick();assert.match(s.$('step-status').textContent,/Paso 2 de 8/);
  s.$('reset-line').onclick();assert.match(s.$('step-status').textContent,/Empiezas en 5/);
  s.submit(3);s.$('next').onclick();assert.equal(s.timers.size,0);
});
test('Contrast pairs keep operands and ask for positive distance',()=>{
  const s=setup();s.$('contrast-mode').onclick();s.submit(-3);assert.equal(s.$('correct').textContent,1);s.$('next').onclick();
  assert.match(s.$('story').textContent,/distancia hay entre 5 y 8/);s.submit(-3);assert.match(s.$('feedback').textContent,/distancia es positiva/);s.submit(3);assert.match(s.$('feedback').textContent,/Exacto/);
  assert.equal(s.$('done').textContent,2);
});
test('Levels gate help, invalid input leaves progress untouched, restart resets',()=>{
  const s=setup();s.$('level').value='3';s.$('level').onchange();assert.equal(s.$('step').disabled,true);
  s.submit('');assert.equal(s.$('done').textContent,0);s.submit('3.2');assert.equal(s.$('done').textContent,0);
  s.submit(-3);assert.equal(s.$('step').disabled,false);
  s.$('level').value='4';s.$('level').onchange();assert.equal(s.$('line-panel').hidden,true);s.submit(-3);assert.equal(s.$('reveal').hidden,false);s.$('reveal').onclick();assert.equal(s.$('line-panel').hidden,false);
  s.$('restart').onclick();assert.equal(s.$('done').textContent,0);assert.equal(s.$('welcome').hidden,false);
});
test('Generator respects bounds and excludes recent duplicates across 4,000 exercises',()=>{
  const s=setup();for(let level=1;level<=4;level++){
    const gen=s.generator(),recent=[];
    for(let i=0;i<1000;i++){
      const q=gen(level,'practice');assert.equal(q.result,q.a-q.b);assert.ok(q.a>=0&&q.b>=0);assert.ok(Math.abs(q.result)<= (level<=2?10:20));
      if(level===1)assert.ok(q.result>=0);if(level===2)assert.ok(q.result<0);
      const key=`${q.a}:${q.b}`;assert.ok(!recent.includes(key));recent.push(key);if(recent.length>12)recent.shift();
    }
  }
});
