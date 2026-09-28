(() => {
  const $ = id => document.getElementById(id);
  const {fmt,createGenerator} = MathQuestions;
  let generate=createGenerator(), question, level=1, mode='practice', steps=0, timer=null, submitted=false, solved=false;
  let stats={done:0,correct:0,streak:0};
  function stop() { clearTimeout(timer); timer=null; $('play').textContent='Ver todos los pasos'; }
  function updateStats() { Object.keys(stats).forEach(k=>$(k).textContent=stats[k]); $('level-status').textContent=mode==='contrast'?'Distancia / resultado':`Nivel ${level}`; }
  function distanceView() {
    $('distance-panel').hidden=false;
    $('distance-copy').textContent=`Entre ${question.a} y ${question.b} hay ${Math.abs(question.result)} unidades. Esa distancia no indica dónde termina una resta.`;
    NumberLine.render($('distance-visual'),question.a,question.b,0,true);
  }
  function draw() {
    const {a,b,result,scenario}=question, position=a-steps, left=b-steps;
    NumberLine.render($('number-line'),a,b,steps);
    $('step-status').textContent=steps===0 ? `Empiezas en ${a}. Retrocede ${b} posiciones hacia la izquierda.${a===0&&b>0 ? ` Ya estás en cero y quedan ${b} pasos.`:''}` : position===0 && left>0 ? `Paso ${steps} de ${b} → 0. Has llegado a 0, pero todavía quedan ${left} pasos.` : `Paso ${steps} de ${b} → ${fmt(position)}.${position<0?' Ahora estás por debajo de cero.':''}`;
    $('remaining').textContent=`${left} ${left===1?'paso pendiente':'pasos pendientes'}`;
    const awaitingPrediction=level===3 && !submitted && mode==='practice';
    $('step').disabled=steps>=b || awaitingPrediction; $('play').disabled=steps>=b || awaitingPrediction;
    $('meaning').textContent=awaitingPrediction ? 'Primero escribe tu predicción. Después exploramos el recorrido.' : steps===b ? `${a} − ${b} = ${fmt(result)}. ${scenario.meaning(result)}` : '';
  }
  function showLine() { $('line-panel').hidden=false; $('reveal').hidden=true; draw(); }
  function step() { if(steps<question.b) steps++; draw(); }
  function animate() {
    showLine();
    if(steps>=question.b) return;
    $('play').textContent='Pausar';
    timer=setTimeout(()=>{ step(); if(steps<question.b) animate(); else stop(); },question.a-steps===0?1700:850);
  }
  function load(nextQuestion) {
    stop(); question=nextQuestion || generate(level,mode); steps=0; submitted=false; solved=false;
    $('theme').textContent=mode==='contrast'?'¿Distancia o resultado?':question.scenario.label;
    $('question-count').textContent=`Reto ${stats.done+1}`;
    $('instruction').textContent=mode==='contrast'?'Mismos números, dos preguntas. Fíjate en qué te pide cada una.': ['','Observa el recorrido y prueba una respuesta.','El cero es una parada, no el final.','Predice primero. Después podrás ver los pasos.','Imagina el recorrido antes de verlo.'][level];
    const distance=question.kind==='distance';
    $('story').textContent=distance ? `¿Qué distancia hay entre ${question.a} y ${question.b}?` : mode==='contrast' ? `Estás en ${question.a} y retrocedes ${question.b} posiciones. ¿Dónde terminas?` : question.scenario.story(question.a,question.b);
    $('operation').textContent=distance ? `${question.a} ↔ ${question.b}` : `${question.a} − ${question.b} = ?`;
    $('answer-label').textContent=distance?'¿Cuántas unidades los separan?':'¿Cuál es el resultado?';
    $('answer').value=''; $('answer').disabled=false; $('check').disabled=false; $('minus').disabled=false;
    $('validation').textContent=''; $('feedback').hidden=true; $('distance-panel').hidden=true; $('next').hidden=true; $('reveal').hidden=true;
    $('line-panel').hidden=level===4 || mode==='contrast';
    $('step').disabled=level===3; $('play').disabled=level===3;
    $('reset-line').disabled=level===3;
    if(!$('line-panel').hidden) { draw(); if(level===3) { $('step').disabled=true; $('play').disabled=true; $('meaning').textContent='Primero escribe tu predicción. Después exploramos el recorrido.'; } }
    $('footer-hint').textContent=mode==='contrast' ? 'Una distancia cuenta la separación entre dos números.' : 'Puedes probar, observar y volver a intentarlo.';
    updateStats();
  }
  $('answer-form').addEventListener('submit',event=>{
    event.preventDefault(); if(solved) return;
    const raw=$('answer').value.trim().replace('−','-');
    if(!/^[+-]?\d+$/.test(raw)) { $('validation').textContent='Escribe un número entero, por ejemplo 3 o −3. El botón +/− cambia el signo.'; return; }
    $('validation').textContent='';
    const value=Number(raw), {a,b,result,scenario,kind}=question, expected=kind==='distance'?Math.abs(result):result;
    const right=value===expected;
    if(!submitted) { stats.done++; if(right) { stats.correct++; stats.streak++; } else stats.streak=0; submitted=true; }
    updateStats(); $('feedback').hidden=false; $('feedback').classList.toggle('success',right); $('next').hidden=false; $('reset-line').disabled=false;
    if(right) {
      solved=true; stop(); $('answer').disabled=true; $('check').disabled=true; $('minus').disabled=true;
      $('feedback').textContent=kind==='distance' ? `Exacto. Los separan ${expected} unidades. Una distancia no lleva signo negativo. En cambio, ${a} − ${b} = ${fmt(result)} indica dónde terminas al retroceder.` : `Exacto. ${a} − ${b} = ${fmt(result)}. ${scenario.meaning(result)}`;
      if(kind==='distance') distanceView(); else if($('line-panel').hidden) $('reveal').hidden=false; else draw();
    } else {
      stop(); steps=0;
      if(kind==='result' && result<0 && value===Math.abs(result)) {
        $('feedback').textContent=`Ese ${value} tiene sentido: es la distancia entre ${a} y ${b}. Pero aquí preguntamos dónde terminas: empiezas en ${a} y retrocedes ${b} posiciones. Vamos a verlo. Después puedes volver a responder.`;
        distanceView(); animate();
      } else if(kind==='distance') {
        $('feedback').textContent=`Aquí preguntamos cuánto separa ${a} de ${b}, no dónde termina una resta. Cuenta las unidades entre los dos: hay ${Math.abs(result)}. La distancia es positiva. Prueba de nuevo.`;
        distanceView();
      } else {
        $('feedback').textContent=value===0 && result<0 ? `Llegar a cero no termina el recorrido. De los ${b} pasos, usas ${a} para llegar a 0 y todavía quedan ${-result}. Vamos a verlos.` : `Vamos a seguir el recorrido: empieza en ${a} y muévete ${b} veces hacia la izquierda. El número donde pares será tu respuesta. Puedes volver a intentarlo.`;
        animate();
      }
    }
    $('next').textContent=mode==='contrast'&&kind==='result'?'Mismos números, otra pregunta →':'Siguiente reto →';
  });
  $('start').onclick=()=>{ $('welcome').hidden=true; $('game').hidden=false; load(); $('level').focus(); };
  $('step').onclick=()=>{ stop(); step(); };
  $('play').onclick=()=>{ if(timer) stop(); else animate(); };
  $('reset-line').onclick=()=>{ stop(); steps=0; draw(); };
  $('reveal').onclick=()=>{ showLine(); };
  $('minus').onclick=()=>{ const value=$('answer').value.trim(); $('answer').value=/^[-−]/.test(value)?value.slice(1):'-'+value.replace(/^\+/,''); $('answer').focus(); };
  $('next').onclick=()=>{ const paired=mode==='contrast'&&question.kind==='result'?{...question,kind:'distance'}:null; load(paired); $('answer').focus(); };
  $('level').onchange=()=>{ level=Number($('level').value); load(); };
  function setMode(value) { mode=value; $('practice-mode').setAttribute('aria-pressed',mode==='practice'); $('contrast-mode').setAttribute('aria-pressed',mode==='contrast'); $('level').disabled=mode==='contrast'; load(); }
  $('practice-mode').onclick=()=>setMode('practice'); $('contrast-mode').onclick=()=>setMode('contrast');
  $('restart').onclick=()=>{ stop(); stats={done:0,correct:0,streak:0}; generate=createGenerator(); level=1; $('level').value='1'; setMode('practice'); $('game').hidden=true; $('welcome').hidden=false; $('start').focus(); };
  window.addEventListener('resize',()=>{ if(question) { if(!$('line-panel').hidden) { const locked=level===3&&!submitted; draw(); if(locked) { $('step').disabled=true; $('play').disabled=true; } } if(!$('distance-panel').hidden) distanceView(); } });
})();
