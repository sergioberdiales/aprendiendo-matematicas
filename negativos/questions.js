/* Añade contextos aquí: story(a,b) plantea el saldo/posición, meaning(r) lo explica. */
(function (root) {
  const fmt = n => String(n).replace('-', '−');
  const scenarios = [
    { id: 'numbers', label: 'En la recta', story: (a,b) => `Empiezas en ${a} y retrocedes ${b} posiciones. ¿Dónde terminas?`, meaning: r => r < 0 ? `Estás ${-r} posiciones por debajo de cero.` : `Terminas en la posición ${r}.` },
    { id: 'dance', label: 'Danza · ensayo', story: (a,b) => `Estás en la marca ${a} del escenario. La coreografía te lleva ${b} posiciones hacia la izquierda. ¿En qué marca terminas?`, meaning: r => `Tu marca es ${fmt(r)}${r < 0 ? `: ${-r} posiciones a la izquierda del cero` : ''}.` },
    { id: 'shopping', label: 'Compras · tu próxima camiseta', story: (a,b) => `Tienes ${a} € y compras una camiseta de ${b} €. Si falta dinero, tu madre te lo adelanta. ¿Cuál es tu saldo?`, meaning: r => r < 0 ? `Te faltaban ${-r} €. Ahora debes ${-r} €: tu saldo es ${fmt(r)} €.` : `Tu saldo es ${r} €. No debes dinero.` },
    { id: 'concert', label: 'Pop · día de concierto', story: (a,b) => `En un juego de concierto pop, tu marcador de energía empieza en ${a}. La cola y el baile restan ${b} puntos. Puede bajar de cero. ¿En qué valor termina?`, meaning: r => `El marcador del juego queda en ${fmt(r)}${r < 0 ? `, ${-r} puntos por debajo de cero` : ''}.` },
    { id: 'friends', label: 'De tiendas con amigas', story: (a,b) => `Sales con tus amigas con ${a} €. Gastas ${b} €; te adelantan lo que falte. ¿Cuál es tu saldo?`, meaning: r => r < 0 ? `¿Cuánto te falta? ${-r} €. ¿Cuál es tu saldo? ${fmt(r)} €. Son dos preguntas diferentes.` : `Te quedan ${r} € de saldo. No te falta dinero.` },
    { id: 'points', label: 'Juego · una nueva ronda', story: (a,b) => `Tienes ${a} puntos y recibes una penalización de ${b} puntos. ¿Cuál es tu puntuación ahora?`, meaning: r => `Tu puntuación es ${fmt(r)}${r < 0 ? `: ${-r} puntos por debajo de cero` : ''}.` }
  ];
  const integer = (min,max) => min + Math.floor(Math.random() * (max-min+1));
  function createGenerator() {
    let index = 0;
    const recent = [];
    return function generate(level, mode) {
      let a,b,key;
      for (let tries=0; tries<100; tries++) {
        if (mode === 'contrast') { a = integer(0,8); b = integer(a+1,10); }
        else if (level === 1) { a = integer(1,10); b = integer(0,a); }
        else if (level === 2) { a = integer(0,9); b = integer(a+1,10); }
        else { a = integer(0,20); b = integer(0,20); }
        key = `${a}:${b}`;
        if (!recent.includes(key)) break;
      }
      recent.push(key); if(recent.length > 12) recent.shift();
      const scenario = scenarios[index++ % scenarios.length];
      return { a,b,result:a-b,scenario,kind:'result' };
    };
  }
  root.MathQuestions = { scenarios, createGenerator, fmt };
})(typeof window === 'undefined' ? globalThis : window);
